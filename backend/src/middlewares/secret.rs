use axum::extract::{State, TypedHeader};
use axum::http::{Request, StatusCode};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use chrono::NaiveDateTime;
use headers::authorization::Bearer;
use headers::Authorization;
use sha2::{Digest, Sha512};

use crate::AppState;

#[derive(serde::Serialize)]
pub struct Secret {
    id: String,
    secret: String,
    description: String,
    expired_at: Option<NaiveDateTime>,
}

pub async fn authentication_secret<B>(
    State(state): State<AppState>,
    //auth: TypedHeader<Authorization<Bearer>>,
    request: Request<B>,
    next: Next<B>,
) -> Response {
    //let token: &str = auth.token();
    dotenvy::dotenv().ok();
    let client_id = std::env::var("CLIENT_ID").expect("CLIENT_ID not found");
    let secret = std::env::var("SECRET").expect("SECRET not found");
    let mut hasher = Sha512::new();
    hasher.update(secret);
    let result = hasher.finalize();
    let secret = format!("{:x}", result);
    let token = format!("{client_id}:{secret}");
    if token.is_empty() {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    if !token.contains(':') {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    let data: Vec<&str> = token.split(':').collect();
    if data[0].is_empty() || data[1].is_empty() {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    let secret = sqlx::query_as!(
        Secret,
        "SELECT * FROM secret WHERE id = ? AND secret = ? AND (expired_at IS NULL OR CURDATE() < expired_at)",
        data[0],
        data[1]
    )
    .fetch_optional(&state.pool)
    .await
    .expect("db error");
    if secret.is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    next.run(request).await
}
