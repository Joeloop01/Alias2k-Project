use axum::{routing, Router};

use crate::AppState;

const URL: &str = "/signin";

pub fn router() -> Router<AppState> {
    Router::new().route(URL, routing::get(sign_in))
}

pub async fn sign_in() {}
