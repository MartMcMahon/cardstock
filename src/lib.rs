use wasm_bindgen::prelude::*;

mod coin;
// mod sock;
use crate::coin::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn start() {
    log("ok. cool");
    // sock::socket();
    coin::main();
}
