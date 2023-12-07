use axum::extract::{State, TypedHeader};
use axum::http::{Request, StatusCode};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use chrono::{NaiveDateTime, Utc};
use headers::authorization::Bearer;
use headers::Authorization;
use sqlx::{MySql, Pool};

use crate::endpoints::authentication::codify_token;
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
    let codified_token = codify_token(token.token());

    let today = Utc::now().naive_utc();
    let result = sqlx::query_as!(
        GetToken,
        "SELECT * FROM token WHERE token = ? AND expired_at > ?",
        codified_token,
        today
    )
    .fetch_optional(&state.pool)
    .await
    .expect("error from db");
    if result.is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }

    let token = result.unwrap();
    let result_user = find_one(&state.pool, token.user_id).await;
    if result_user.is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    let result_user = result_user.unwrap();

    request.extensions_mut().insert(result_user);
    next.run(request).await
}

pub async fn authentication_refresh_token<B>(
    State(state): State<AppState>,
    refresh_token: TypedHeader<Authorization<Bearer>>,
    mut request: Request<B>,
    next: Next<B>,
) -> Response {
    let codified_refresh_token = codify_token(refresh_token.token());

    let today = Utc::now().naive_utc();
    let result = sqlx::query_as!(
        GetToken,
        "SELECT * FROM token WHERE refresh_token = ? AND expired_at > ?",
        codified_refresh_token,
        today
    )
    .fetch_optional(&state.pool)
    .await
    .expect("error from db");
    if result.is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }

    let token = result.unwrap();

    let result_user = find_one(&state.pool, token.user_id).await;
    if result_user.is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    let result_user = result_user.unwrap();

    request.extensions_mut().insert(result_user);
    next.run(request).await
}

async fn find_one(pool: &Pool<MySql>, id: i32) -> Option<User> {
    sqlx::query_as!(
        User,
        "select * from user where id = ? and deleted_at is null",
        id
    )
    .fetch_optional(pool)
    .await
    .expect("error from database")
}
