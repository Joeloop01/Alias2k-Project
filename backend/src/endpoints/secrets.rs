use axum::extract::Path;
use axum::http::StatusCode;
use axum::{extract::State, response::IntoResponse, Router};
use axum::{routing, Json};
use chrono::NaiveDateTime;
use sha2::{Digest, Sha512};
use sqlx::{MySql, Pool};
use uuid::Uuid;

use crate::AppState;

#[derive(serde::Serialize)]
pub struct Secret {
    id: String,
    secret: String,
    description: String,
    expired_at: Option<NaiveDateTime>,
}

#[derive(serde::Deserialize)]
pub struct NewSecret {
    description: String,
    expired_at: Option<NaiveDateTime>,
}

static URL: &str = "/secrets";
static URL_ID: &str = "/secrets/:id";

pub fn router() -> Router<AppState> {
    Router::new()
        .route(URL, routing::get(get_all))
        .route(URL, routing::post(post))
        .route(URL_ID, routing::get(get))
        .route(URL_ID, routing::delete(delete))
}

pub async fn find_one(pool: &Pool<MySql>, id: String) -> Option<Secret> {
    sqlx::query_as!(Secret, "SELECT * FROM secret WHERE id = ?", id)
        .fetch_optional(pool)
        .await
        .expect("error from database")
}

pub async fn get(State(state): State<AppState>, Path(id): Path<String>) -> impl IntoResponse {
    match find_one(&state.pool, id).await {
        None => StatusCode::NOT_FOUND.into_response(),
        Some(secret) => Json(secret).into_response(),
    }
}

pub async fn get_all(State(state): State<AppState>) -> impl IntoResponse {
    Json(
        sqlx::query_as!(Secret, "SELECT * FROM secret")
            .fetch_all(&state.pool)
            .await
            .expect("error from database"),
    )
    .into_response()
}

pub async fn post(
    State(state): State<AppState>,
    Json(payload): Json<NewSecret>,
) -> impl IntoResponse {
    let secret = Uuid::new_v4();
    let mut hasher = Sha512::new();
    hasher.update(secret.to_string());
    let result = hasher.finalize();
    sqlx::query!(
        "INSERT INTO secret (secret, description, expired_at) VALUES (?,?,?)",
        format!("{:x}", result),
        payload.description,
        payload.expired_at
    )
    .execute(&state.pool)
    .await
    .expect("error from database");
    StatusCode::CREATED.into_response()
}

pub async fn delete(State(state): State<AppState>, Path(id): Path<String>) -> impl IntoResponse {
    let result = find_one(&state.pool, id.clone()).await;
    if result.is_none() {
        return StatusCode::NOT_FOUND.into_response();
    }
    sqlx::query!("UPDATE secret SET expired_at = now() WHERE id = ?", id)
        .execute(&state.pool)
        .await
        .expect("error from database");
    StatusCode::NO_CONTENT.into_response()
}
