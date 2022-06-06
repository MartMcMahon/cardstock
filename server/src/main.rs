// use actix::{Actor, StreamHandler};
use actix_cors::Cors;
use actix_web::{get, http, web, App, Error, HttpRequest, HttpResponse, HttpServer};

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

#[get("/")]
async fn index(req: HttpRequest, stream: web::Payload) -> String {
    let resp = "ok!!!".to_owned();
    println!("{:?}", resp);
    resp
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::permissive();
        // .allowed_origin("*")
        // .allowed_origin("http://localhost:8000")
        // .allowed_methods(vec!["GET", "POST"])
        // .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
        // .allowed_header(http::header::CONTENT_TYPE)
        // .max_age(3600);

        App::new().wrap(cors).service(index)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
