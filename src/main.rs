use std::{net::SocketAddr, str::FromStr};

use axum::{response::IntoResponse, routing, Json, Router};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = Router::new().route("/", routing::get(home));

    let address = SocketAddr::from_str("127.0.0.1:6969").expect("invalid address");
    println!("Listen to {}", address);
    axum::Server::bind(&address)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
#[derive(serde::Serialize)]
struct User {
    name: String,
    surname: String,
    email: String,
    age: u32,
}

async fn home() -> impl IntoResponse {
    let user = User {
        name: "John".to_string(),
        surname: "Dee".to_string(),
        email: "asd".to_string(),
        age: 32,
    };
    Json(user).into_response()
}
