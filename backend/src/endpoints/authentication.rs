use std::time::Duration;

use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use chrono::NaiveDateTime;
use rand::{distributions::Alphanumeric, thread_rng, Rng};
use sha2::{Digest, Sha512};
use sqlx::{MySql, Pool};

use crate::AppState;

#[derive(serde::Serialize)]
pub struct LogInUser {
    email: String,
    password: String,
}

#[derive(serde::Serialize)]
pub struct Secret {
    id: String,
    secret: String,
    description: String,
    expired_at: Option<NaiveDateTime>,
}

#[derive(serde::Serialize)]
pub struct Id {
    id: i32,
}

const URL: &str = "/signin";

//pub fn router() -> Router<AppState> {
//    Router::new().route(URL, routing::get(sign_in))
//}

pub async fn find_one(pool: &Pool<MySql>, email: String, password: String) -> Option<Id> {
    sqlx::query_as!(
        Id,
        "SELECT id FROM user WHERE email = ? AND password = ?",
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
        StatusCode::UNAUTHORIZED.into_response();
    }
    let token: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(16)
        .map(char::from)
        .collect();

    let refresh_token: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(16)
        .map(char::from)
        .collect();
    let expire_at = Duration::new(900, 0);

    let mut hasher1 = Sha512::new();
    hasher1.update(token);
    let codified_token = hasher1.finalize();

    let mut hasher2 = Sha512::new();
    hasher2.update(refresh_token);
    let codified_refresh_token = hasher2.finalize();

    sqlx::query!(
        "INSERT INTO token (token, user_id, refresh_token, expired_at) VALUES (?,?,?,?)",
        format!("{:x}", codified_token),
        user_id.unwrap().id,
        format!("{:x}", codified_refresh_token),
        expire_at.as_secs()
    )
    .execute(&state.pool)
    .await
    .expect("error from database");
}
