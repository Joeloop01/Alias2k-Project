use axum::extract::{State, TypedHeader};
use axum::http::{Request, StatusCode};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use chrono::{NaiveDateTime, Utc};
use headers::authorization::Bearer;
use headers::Authorization;
use sha2::{Digest, Sha512};

use crate::endpoints::users::User;
use crate::AppState;

#[derive(serde::Serialize)]
pub struct GetToken {
    token: String,
    user_id: i32,
    refresh_token: String,
    expired_at: NaiveDateTime,
}

pub async fn authentication_token<B>(
    State(state): State<AppState>,
    token: TypedHeader<Authorization<Bearer>>,
    mut request: Request<B>,
    next: Next<B>,
) -> Response {
    let mut hasher = Sha512::new();
    hasher.update(token.token());
    let codified_token = hasher.finalize();

    let today = Utc::now().naive_utc();
    let result = sqlx::query_as!(
        GetToken,
        "SELECT * FROM token WHERE token = ? AND expired_at > ?",
        format!("{:x}", codified_token),
        today
    )
    .fetch_optional(&state.pool)
    .await
    .expect("error from db");
    if result.is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }

    let token = result.unwrap();
    let result_user = sqlx::query_as!(
        User,
        "select * from user where id = ? and deleted_at is null",
        token.user_id
    )
    .fetch_optional(&state.pool)
    .await
    .expect("error from database");
    if result_user.is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    let result_user = result_user.unwrap();

    request.extensions_mut().insert(result_user);
    next.run(request).await
}
