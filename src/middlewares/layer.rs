use axum::response::IntoResponse;
use chrono::NaiveDateTime;

#[derive(serde::Serialize)]
pub struct Secret {
    id: String,
    secret: String,
    description: String,
    expired_at: Option<NaiveDateTime>,
}

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

//pub async fn layer1(TypedHeader(auth): TypedHeader<Authorization<Bearer>>) -> impl IntoResponse {}
