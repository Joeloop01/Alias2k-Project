use axum::extract::Path;
use axum::http::StatusCode;
use axum::{extract::State, response::IntoResponse, Json};
use axum::{routing, Router};
use chrono::NaiveDateTime;
use sqlx::{MySql, Pool};

use crate::AppState;

#[derive(serde::Serialize)]
pub struct Todo {
    id: i32,
    user_id: i32,
    title: String,
    description: Option<String>,
    completed_at: Option<NaiveDateTime>,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime,
    #[serde(skip_serializing)]
    deleted_at: Option<NaiveDateTime>,
}

#[derive(serde::Deserialize)]
pub struct NewTodo {
    title: String,
    description: Option<String>,
    completed_at: Option<NaiveDateTime>,
}

#[derive(serde::Deserialize)]
pub struct EditTodo {
    title: Option<String>,
    #[serde(default, with = "::serde_with::rust::double_option")]
    description: Option<Option<String>>,
    #[serde(default, with = "::serde_with::rust::double_option")]
    completed_at: Option<Option<NaiveDateTime>>,
}

const URL: &str = "/users/:user_id/todos";
const URL_ID: &str = "/users/:user_id/todos/:id";
pub fn router() -> Router<AppState> {
    Router::new()
        .route(URL, routing::get(get_all))
        .route(URL, routing::post(post))
        .route(URL_ID, routing::get(get))
        .route(URL_ID, routing::put(put))
        .route(URL_ID, routing::patch(patch))
        .route(URL_ID, routing::delete(delete))
}

pub async fn find_one(pool: &Pool<MySql>, user_id: i32, id: i32) -> Option<Todo> {
    sqlx::query_as!(
        Todo,
        "select * from todo where user_id = ? and id = ? and deleted_at is null",
        user_id,
        id
    )
    .fetch_optional(pool)
    .await
    .expect("error from database")
}

pub async fn get_all(State(state): State<AppState>, Path(user_id): Path<i32>) -> impl IntoResponse {
    let select_users = sqlx::query_as!(
        Todo,
        "select * from todo where user_id = ? and deleted_at is null",
        user_id
    )
    .fetch_all(&state.pool)
    .await
    .expect("error from database");
    Json(select_users).into_response()
}

pub async fn get(
    State(state): State<AppState>,
    Path((user_id, id)): Path<(i32, i32)>,
) -> impl IntoResponse {
    match find_one(&state.pool, user_id, id).await {
        None => StatusCode::NOT_FOUND.into_response(),
        Some(todo) => Json(todo).into_response(),
    }
}

pub async fn post(
    State(state): State<AppState>,
    Path(user_id): Path<i32>,
    Json(payload): Json<NewTodo>,
) -> impl IntoResponse {
    sqlx::query!(
        "insert into todo (user_id, title, description, completed_at) values (?,?,?,?)",
        user_id,
        payload.title,
        payload.description,
        payload.completed_at
    )
    .execute(&state.pool)
    .await
    .expect("db error");
    StatusCode::CREATED.into_response()
}

pub async fn put(
    State(state): State<AppState>,
    Path((user_id, id)): Path<(i32, i32)>,
    Json(payload): Json<NewTodo>,
) -> impl IntoResponse {
    let result = find_one(&state.pool, user_id, id).await;
    if result.is_none() {
        return StatusCode::NOT_FOUND.into_response();
    }
    sqlx::query!(
        "update todo set title = ?, description = ?, completed_at = ? where user_id = ? and id = ?",
        payload.title,
        payload.description,
        payload.completed_at,
        user_id,
        id
    )
    .execute(&state.pool)
    .await
    .expect("db error");
    StatusCode::NO_CONTENT.into_response()
}

pub async fn patch(
    State(state): State<AppState>,
    Path((user_id, id)): Path<(i32, i32)>,
    Json(payload): Json<EditTodo>,
) -> impl IntoResponse {
    let result = find_one(&state.pool, user_id, id).await;
    if result.is_none() {
        return StatusCode::NOT_FOUND.into_response();
    }
    let result = result.unwrap();
    sqlx::query!(
        "update todo set title = ?, description = ? , completed_at = ? where user_id = ? and id = ?",
        payload.title.unwrap_or(result.title),
        payload.description.unwrap_or(result.description),
        payload.completed_at.unwrap_or(result.completed_at),
        user_id,
        id
    )
    .execute(&state.pool)
    .await
    .expect("db error");
    StatusCode::NO_CONTENT.into_response()
}

pub async fn delete(
    State(state): State<AppState>,
    Path((user_id, id)): Path<(i32, i32)>,
) -> impl IntoResponse {
    let result = find_one(&state.pool, user_id, id).await;
    if result.is_none() {
        return StatusCode::NOT_FOUND.into_response();
    }
    sqlx::query!(
        "update todo set deleted_at = now() where user_id = ? and id = ?",
        user_id,
        id
    )
    .execute(&state.pool)
    .await
    .expect("db error");
    StatusCode::NO_CONTENT.into_response()
}
