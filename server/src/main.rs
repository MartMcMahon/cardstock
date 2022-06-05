use actix_web::{get, web, App, HttpRequest, HttpServer, Responder};

struct State {
    users: Vec<String>,
}

#[get("/init/{id}")]
async fn hello(data: web::Data<State>, name: web::Path<String>) -> String {
    let name = &data.users[0];
    format!("hello {name}")
}

async fn index(req: HttpRequest) -> &'static str {
    println!("req: {:?}", req);
    "HELLO"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .app_data(web::Data::new(State {
                users: vec!["mart".to_owned()],
            }))
            .service(web::resource("/world").to(|| async { "Hello world!" }))
            .service(web::resource("/").to(index))
            .service(hello)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
