use axum::extract::Path;
use axum::http::StatusCode;
use axum::{extract::State, response::IntoResponse, Json};
use axum::{routing, Router};
use chrono::NaiveDateTime;
use sqlx::{MySql, Pool};

use crate::AppState;

#[derive(serde::Serialize)]
pub struct User {
    id: i32,
    name: String,
    email: String,
    #[serde(skip_serializing)]
    password: String,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime,
    #[serde(skip_serializing)]
    deleted_at: Option<NaiveDateTime>,
}

#[derive(serde::Deserialize)]
pub struct NewUser {
    name: String,
    email: String,
    password: String,
}

#[derive(serde::Deserialize)]
pub struct EditUser {
    name: Option<String>,
    email: Option<String>,
    password: Option<String>,
}

const URL: &str = "/users";
const URL_ID: &str = "/users/:id";
pub fn router() -> Router<AppState> {
    Router::new()
        .route(URL, routing::get(get_all))
        .route(URL, routing::post(post))
        .route(URL_ID, routing::get(get))
        .route(URL_ID, routing::put(put))
        .route(URL_ID, routing::patch(patch))
        .route(URL_ID, routing::delete(delete))
}

pub async fn find_one(pool: &Pool<MySql>, id: i32) -> Option<User> {
    sqlx::query_as!(
        User,
        "select * from user where id = ? and deleted_at is null",
        id
    )
    .fetch_optional(pool)
    .await
    .expect("error from database")
}

pub async fn get_all(State(state): State<AppState>) -> impl IntoResponse {
    let select_users = sqlx::query_as!(User, "select * from user where deleted_at is null")
        .fetch_all(&state.pool)
        .await
        .expect("error from database");
    Json(select_users).into_response()
}

pub async fn get(State(state): State<AppState>, Path(id): Path<i32>) -> impl IntoResponse {
    match find_one(&state.pool, id).await {
        None => StatusCode::NOT_FOUND.into_response(),
        Some(user) => Json(user).into_response(),
    }
}

pub async fn post(
    State(state): State<AppState>,
    Json(payload): Json<NewUser>,
) -> impl IntoResponse {
    sqlx::query!(
        "insert into user (name,email,password) values (?,?,?)",
        payload.name,
        payload.email,
        payload.password,
    )
    .execute(&state.pool)
    .await
    .expect("db error");
    StatusCode::CREATED.into_response()
}

pub async fn put(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(payload): Json<NewUser>,
) -> impl IntoResponse {
    let result = find_one(&state.pool, id).await;
    if result.is_none() {
        return StatusCode::NOT_FOUND.into_response();
    }
    sqlx::query!(
        "update user set name = ?, email = ?, password = ? where id = ?",
        payload.name,
        payload.email,
        payload.password,
        id
    )
    .execute(&state.pool)
    .await
    .expect("db error");
    StatusCode::NO_CONTENT.into_response()
}

pub async fn patch(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(payload): Json<EditUser>,
) -> impl IntoResponse {
    let result = find_one(&state.pool, id).await;
    if result.is_none() {
        return StatusCode::NOT_FOUND.into_response();
    }
    let result = result.unwrap();
    sqlx::query!(
        "update user set name = ?, email = ?, password = ? where id = ?",
        payload.name.unwrap_or(result.name),
        payload.email.unwrap_or(result.email),
        payload.password.unwrap_or(result.password),
        id
    )
    .execute(&state.pool)
    .await
    .expect("db error");
    StatusCode::NO_CONTENT.into_response()
}

pub async fn delete(State(state): State<AppState>, Path(id): Path<i32>) -> impl IntoResponse {
    let result = find_one(&state.pool, id).await;
    if result.is_none() {
        return StatusCode::NOT_FOUND.into_response();
    }
    sqlx::query!("update user set deleted_at = now() where id = ?", id)
        .execute(&state.pool)
        .await
        .expect("db error");
    StatusCode::NO_CONTENT.into_response()
}