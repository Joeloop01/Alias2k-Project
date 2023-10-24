use std::{net::SocketAddr, str::FromStr};

use axum::extract::Path;
use axum::http::StatusCode;
use axum::{extract::State, response::IntoResponse, routing, Json, Router};
use chrono::{naive, NaiveDateTime};
use sqlx::{mysql::MySqlPoolOptions, pool, MySql, Pool};

#[derive(Clone)]
struct AppState {
    pool: Pool<MySql>,
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    let dburl = std::env::var("DATABASE_URL").expect("DATABASE_URL not set");
    let host = std::env::var("HOST").expect("HOST not set");
    let port = std::env::var("PORT").expect("PORT not set");
    let address = format!("{}:{}", host, port);
    tracing_subscriber::fmt::init();

    let pool = MySqlPoolOptions::new()
        .connect(&dburl)
        .await
        .expect("pool creation failed");

    let state = AppState { pool };

    let app = Router::new()
        .route("/users", routing::get(get_all))
        .route("/users/:id", routing::get(get))
        //.route("/users", routing::post(handler))
        .with_state(state);

    let address = SocketAddr::from_str(&address).expect("invalid address");
    println!("Listen to {}", address);
    axum::Server::bind(&address)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
#[derive(serde::Serialize)]
struct User {
    id: i32,
    name: String,
    email: String,
    password: String,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime,
    deleted_at: Option<NaiveDateTime>,
}

async fn get_all(State(state): State<AppState>) -> impl IntoResponse {
    let select_users = sqlx::query_as!(User, "select * from user")
        .fetch_all(&state.pool)
        .await
        .expect("error from database");
    Json(select_users).into_response()
}

async fn get(State(state): State<AppState>, Path(id): Path<i32>) -> impl IntoResponse {
    let select_one_user = sqlx::query_as!(User, "select * from user where id = ?", id)
        .fetch_optional(&state.pool)
        .await
        .expect("error from database");
    match select_one_user {
        None => StatusCode::NOT_FOUND.into_response(),
        Some(user) => Json(user).into_response(),
    }
}

//async fn post(State(state): State<AppState>) -> impl IntoResponse {
//   let add_user = sqlx::
//}
