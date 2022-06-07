use std::{collections::HashMap, sync::Mutex};

// use actix::{Actor, StreamHandler};
use actix_cors::Cors;
use actix_web::{
    body::MessageBody,
    get,
    http::{self, header::ContentType},
    middleware::Logger,
    post, web, App, Error, HttpRequest, HttpResponse, HttpServer, Responder,
};
use serde::{Deserialize, Serialize};
use serde_json::json;

/// Handler for ws::Message message
// impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for MyWs {
//     fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
//         match msg {
//             Ok(ws::Message::Ping(msg)) => ctx.pong(&msg),
//             Ok(ws::Message::Text(text)) => ctx.text(text),
//             Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
//             _ => (),
//         }
//     }
// }

#[derive(Debug, Deserialize, Serialize)]
struct State {
    clients: Vec<String>,
}

#[get("/")]
async fn root() -> HttpResponse {
    HttpResponse::Ok().body("ok".to_owned())
}

// #[get("/id/{id}")]
// async fn index(: web::Path<String>, data: web::Data<Mutex<State>>) -> HttpResponse {
//     println!("index GET");

//     // let id = params.get("id").unwrap().to_owned();

//     println!("got params ");
//     let mut state = data.lock().unwrap();
//     state.clients.push(id.id);
//     println!("pushed to vec ");

//     // println!("{:?} connected", id.to_string());
//     // println!("{:?}", params);
//     // id
//     println!("returning");
//     HttpResponse::Ok().body(json!({"test": "cool"}).to_string())
// }

#[derive(Deserialize)]
struct IdPost {
    id: String,
}

#[post("/id/")]
async fn id(data: web::Data<Mutex<State>>, body: web::Json<IdPost>) -> web::Json<String> {
    let mut state = data.lock().unwrap();
    state.clients.push(body.id.clone());
    web::Json("ok".to_owned())
}

#[derive(Debug, Deserialize)]
struct Info {
    ok: String,
}

#[post("/")]
async fn message(data: web::Data<Mutex<State>>, body: web::Json<Info>) -> impl Responder {
    let ok = body.ok.clone();

    println!("body: {:?}", ok);

    // web::Json(json!({ "ok": ok }).to_string())
    HttpResponse::Ok().body("great! got it")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let logger = Logger::default();
        let cors = Cors::permissive();
        // .allowed_origin("*")
        // .allowed_origin("http://localhost:8000")
        // .allowed_methods(vec!["GET", "POST"])
        // .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
        // .allowed_header(http::header::CONTENT_TYPE)
        // .max_age(3600);
        App::new()
            .app_data(web::Data::new(Mutex::new(State {
                clients: Vec::new(),
            })))
            .wrap(cors)
            .service(root)
            .service(id)
            .service(message)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
