use axum::{
    extract::{Extension, State},
    http::StatusCode,
    middleware,
    response::IntoResponse,
    routing, Json, Router, TypedHeader,
};
use chrono::{Duration, NaiveDateTime, Utc};
use headers::{authorization::Bearer, Authorization};
use rand::{distributions::Alphanumeric, thread_rng, Rng};
use sha2::{Digest, Sha512};
use sqlx::{MySql, Pool};

use crate::{middlewares, AppState};

use super::users::User;

#[derive(serde::Deserialize)]
pub struct LogInUser {
    email: String,
    password: String,
}

#[derive(serde::Serialize)]
pub struct ReturnToken {
    token: String,
    refresh_token: String,
    expires_in: i64,
}

#[derive(serde::Serialize)]
pub struct GetToken {
    token: String,
    user_id: i32,
    refresh_token: String,
    expired_at: NaiveDateTime,
}

#[derive(serde::Serialize)]
pub struct Id {
    id: i32,
}

pub fn router_sign_in(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/auth/signin", routing::any(sign_in))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            middlewares::secret::authentication_secret,
        ))
}

pub fn router_user_info() -> Router<AppState> {
    Router::new().route("/auth/userinfo", routing::get(user_info))
}

pub fn router_refresh_token(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/auth/refreshtoken", routing::any(refresh_token))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            middlewares::token::authentication_refresh_token,
        ))
}

pub async fn find_one(pool: &Pool<MySql>, email: String, password: String) -> Option<Id> {
    sqlx::query_as!(
        Id,
        "SELECT id FROM user WHERE email = ? AND password = ? AND deleted_at IS NULL",
        email,
        password
    )
    .fetch_optional(pool)
    .await
    .expect("error from database")
}

pub async fn sign_in(
    State(state): State<AppState>,
    Json(payload): Json<LogInUser>,
) -> impl IntoResponse {
    let user_id = find_one(&state.pool, payload.email, payload.password).await;
    if user_id.is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    let result = user_id.unwrap();

    let token = create_token();
    let refresh_token = create_token();

    let codified_token = codify_token(&token);
    let codified_refresh_token = codify_token(&refresh_token);

    let expires_in = Duration::seconds(900);
    let expired_at = Utc::now().naive_utc() + expires_in;

    post_token(
        state,
        codified_token,
        result.id,
        codified_refresh_token,
        expired_at,
    )
    .await;

    let token = ReturnToken {
        token,
        refresh_token,
        expires_in: expires_in.num_seconds(),
    };
    Json(token).into_response()
}

pub async fn user_info(Extension(user): Extension<User>) -> impl IntoResponse {
    Json(user).into_response()
}

pub async fn refresh_token(
    State(state): State<AppState>,
    refresh_token: TypedHeader<Authorization<Bearer>>,
    Extension(user): Extension<User>,
) -> impl IntoResponse {
    let codified_refresh_token = codify_token(refresh_token.token());
    let today = Utc::now().naive_utc();

    sqlx::query!(
        "UPDATE token SET expired_at = ? WHERE refresh_token = ? AND expired_at > ?",
        today,
        codified_refresh_token,
        today
    )
    .execute(&state.pool)
    .await
    .expect("db error");

    let token = create_token();
    let refresh_token = create_token();

    let codified_token = codify_token(&token);
    let codified_refresh_token = codify_token(&refresh_token);

    let expires_in = Duration::seconds(900);
    let expired_at = Utc::now().naive_utc() + expires_in;

    post_token(
        state,
        codified_token,
        user.id,
        codified_refresh_token,
        expired_at,
    )
    .await;

    let token = ReturnToken {
        token,
        refresh_token,
        expires_in: expires_in.num_seconds(),
    };
    Json(token).into_response()
}

fn create_token() -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(90012)
        .map(char::from)
        .collect()
}

pub fn codify_token(token: &str) -> String {
    let mut hasher1 = Sha512::new();
    hasher1.update(token);
    format!("{:x}", hasher1.finalize())
}

async fn post_token(
    state: AppState,
    codified_token: String,
    id: i32,
    codified_refresh_token: String,
    expired_at: NaiveDateTime,
) {
    sqlx::query!(
        "INSERT INTO token (token, user_id, refresh_token, expired_at) VALUES (?,?,?,?)",
        codified_token,
        id,
        codified_refresh_token,
        expired_at
    )
    .execute(&state.pool)
    .await
    .expect("error from database");
}
