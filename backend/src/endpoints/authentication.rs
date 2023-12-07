use axum::{
    extract::{Extension, State},
    http::StatusCode,
    middleware,
    response::IntoResponse,
    routing, Json, Router,
};
use chrono::{Duration, NaiveDateTime, Utc};
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
        .route("/auth/signin", routing::get(sign_in))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            middlewares::secret::authentication_secret,
        ))
}

pub fn router_user_info(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/auth/userinfo", routing::get(user_info))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            middlewares::token::authentication_token,
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

    let token: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(512)
        .map(char::from)
        .collect();

    let refresh_token: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(512)
        .map(char::from)
        .collect();

    let mut hasher1 = Sha512::new();
    hasher1.update(&token);
    let codified_token = hasher1.finalize();

    let mut hasher2 = Sha512::new();
    hasher2.update(&refresh_token);
    let codified_refresh_token = hasher2.finalize();

    let expires_in = Duration::seconds(900);
    let expired_at = Utc::now() + expires_in;
    sqlx::query!(
        "INSERT INTO token (token, user_id, refresh_token, expired_at) VALUES (?,?,?,?)",
        format!("{:x}", codified_token),
        result.id,
        format!("{:x}", codified_refresh_token),
        expired_at.naive_utc()
    )
    .execute(&state.pool)
    .await
    .expect("error from database");

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
