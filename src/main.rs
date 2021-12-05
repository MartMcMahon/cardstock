use eframe::{egui, epi};
use eframe::{
    egui::{
        CentralPanel, Label, ScrollArea, Separator, TextStyle, TextureId, TextureId::User,
        TopBottomPanel, Ui, Vec2, Visuals,
    },
    epi::App,
    run_native, NativeOptions,
};

struct Image {
    size: (usize, usize),
    pixels: Vec<egui::Color32>,
}
/// Immediate mode texture manager that supports at most one texture at the time :)
#[derive(Default)]
struct TexMngr {
    texture_id: Option<egui::TextureId>,
}

impl TexMngr {
    fn texture(&mut self, frame: &mut epi::Frame<'_>, image: &Image) -> Option<egui::TextureId> {
        if let Some(texture_id) = self.texture_id.take() {
            frame.tex_allocator().free(texture_id);
        }

        self.texture_id = Some(
            frame
                .tex_allocator()
                .alloc_srgba_premultiplied(image.size, &image.pixels),
        );
        self.texture_id
    }
}

pub struct CardStockApp {
    image: Option<Image>,
    tex_mngr: TexMngr,
}
impl CardStockApp {
    pub fn new() -> CardStockApp {
        CardStockApp {
            image: None,
            tex_mngr: Default::default(),
        }
        // let img = Image::new
    }
}
impl App for CardStockApp {
    fn setup(
        &mut self,
        _ctx: &egui::CtxRef,
        _frame: &mut eframe::epi::Frame<'_>,
        _storage: Option<&dyn eframe::epi::Storage>,
    ) {
        use image::GenericImageView;

        let image_bytes =
            std::fs::read("assets/images/urza-jess.jpg").expect("error loading image");
        let image = image::load_from_memory(&image_bytes as &[u8]).unwrap();

        let image_buffer = image.to_rgba8();
        let size = (image.width() as usize, image.height() as usize);
        let pixels = image_buffer.into_vec();
        assert_eq!(size.0 * size.1 * 4, pixels.len());
        let pixels = pixels
            .chunks(4)
            .map(|p| egui::Color32::from_rgba_unmultiplied(p[0], p[1], p[2], p[3]))
            .collect();

        self.image = Some(Image { size, pixels });
    }

    fn update(&mut self, ctx: &egui::CtxRef, frame: &mut eframe::epi::Frame<'_>) {
        ctx.request_repaint();

        CentralPanel::default().show(ctx, |ui| {
            if let Some(image) = &self.image {
                if let Some(texture_id) = self.tex_mngr.texture(frame, &image) {
                    let mut size = egui::Vec2::new(image.size.0 as f32, image.size.1 as f32);
                    size *= (ui.available_width() / size.x).min(1.0);
                    ui.image(texture_id, size);
                }
            } else {
                ui.monospace("[binary]");
            }
        });
    }

    fn name(&self) -> &str {
        "cardstock"
    }
}

fn main() {
    let app = CardStockApp::new();
    let mut win_option = NativeOptions::default();
    win_option.initial_window_size = Some(Vec2::new(540., 660.));
    run_native(Box::new(app), win_option);
}
