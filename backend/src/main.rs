mod endpoints;
mod middlewares;

use std::{net::SocketAddr, str::FromStr};

use tower_http::cors::CorsLayer;

use axum::{middleware, Router};
use sqlx::{mysql::MySqlPoolOptions, MySql, Pool};

use crate::endpoints::*;
#[derive(Clone)]
pub struct AppState {
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
        .merge(users::router())
        .merge(todos::router())
        .merge(secrets::router())
        .merge(authentication::router_user_info())
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            middlewares::token::authentication_token,
        ))
        .merge(users::router_post(state.clone()))
        .merge(authentication::router_refresh_token(state.clone()))
        .merge(authentication::router_sign_in(state.clone()))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let address = SocketAddr::from_str(&address).expect("invalid address");
    println!("Listen to {}", address);
    axum::Server::bind(&address)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
