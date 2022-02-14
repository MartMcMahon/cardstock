#![forbid(unsafe_code)]

use eframe::egui::{CtxRef, FontData, FontDefinitions, FontFamily, Label, Separator, Ui, Vec2};
use eframe::{egui, epi, run_native, NativeOptions};

struct Cardstock {
    name: String,
    number: i32,
}
impl epi::App for Cardstock {
    fn name(&self) -> &str {
        "My egui App"
    }

    fn update(&mut self, ctx: &egui::CtxRef, frame: &epi::Frame) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("Hello World!");
            self.render_something(ui);
        });
    }
}
impl Cardstock {
    fn new() -> Cardstock {
        Cardstock {
            name: "Ok, cool!".to_string(),
            number: 42,
        }
    }

    fn configure_fonts(&self, ctx: &CtxRef) {
        let mut fonts = FontDefinitions::default();

        fonts.font_data.insert(
            "my_font".to_owned(),
            FontData::from_static(include_bytes!(
                "../assets/fonts/Fira_Sans/FiraSans-Thin.ttf"
            )),
        ); // .ttf and .otf supported

        // Put my font first (highest priority):
        fonts
            .fonts_for_family
            .get_mut(&FontFamily::Proportional)
            .unwrap()
            .insert(0, "my_font".to_owned());

        // Put my font as last fallback for monospace:
        fonts
            .fonts_for_family
            .get_mut(&FontFamily::Monospace)
            .unwrap()
            .push("my_font".to_owned());

        ctx.set_fonts(fonts);
    }

    fn render_something(&self, ui: &mut Ui) {
        ui.add_space(10.);
        let label = Label::new(&self.name);
        ui.add(label);
        ui.add(Separator::default());
    }
}

fn main() {
    tracing_subscriber::fmt::init();

    let app = Cardstock::new();
    let mut win_option = NativeOptions::default();
    win_option.initial_window_size = Some(Vec2::new(540., 960.));
    run_native(Box::new(app), win_option);
}
