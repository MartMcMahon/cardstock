use wasm_bindgen::prelude::*;

mod cardstock;
// mod sock;
use crate::cardstock::*;

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
    cardstock::main();
}
