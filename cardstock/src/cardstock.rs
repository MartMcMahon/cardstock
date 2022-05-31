use bevy::{
    input::{
        mouse::{MouseButtonInput, MouseMotion},
        ElementState,
    },
    prelude::*,
    window::PresentMode,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen(module = "/mod.js")]
extern "C" {
    fn send(s: &str) -> Option<String>;
    fn read() -> Option<String>;
}

struct CursorState {
    x: f32,
    y: f32,
    holding: Option<u32>,
}
#[derive(Component)]
struct Held;

#[derive(Component)]
struct Movable {
    width: f32,
    height: f32,
}
impl Movable {
    fn within_bounds(&self, transform: &Transform, pos: (f32, f32)) -> bool {
        let x = pos.0 - 400.;
        let y = pos.1 - 300.;
        let left = transform.translation.x - self.width / 2.;
        let top = transform.translation.y + self.height / 2.;
        let right = transform.translation.x + self.width / 2.;
        let bottom = transform.translation.y - self.height / 2.;
        if x > left && x < right && y < top && y > bottom {
            log(format!("{:?}", pos.0).as_str());
            log(format!("{:?}", pos.1).as_str());
            return true;
        }
        log("not in bounds");
        return false;
    }
}

#[derive(Component)]
struct Card;

#[derive(Component)]
struct InputText;

pub fn main() {
    App::new()
        .insert_resource(WindowDescriptor {
            width: 800.0,
            height: 600.0,
            present_mode: PresentMode::Fifo,
            ..Default::default()
        })
        .insert_resource(CursorState {
            x: 0.,
            y: 0.,
            holding: None,
        })
        .add_plugins(DefaultPlugins)
        .add_startup_system(setup)
        .add_startup_system(setup_button)
        .add_startup_system(setup_connection)
        .add_system(button_system)
        // .add_system(print_mouse_events_system)
        .add_system(text_input_system)
        .add_system(drag_entities)
        // .add_plugin(HelloPlugin)
        .add_system(text_input_system)
        .run();
}

fn print_mouse_events_system(
    // mut mouse_state: ResMut<CursorState>,
    mut mouse_event_reader: EventReader<MouseMotion>,
    mut cursor_event_reader: EventReader<CursorMoved>,
    mut mouse_button_reader: EventReader<MouseButtonInput>,
) {
    for event in cursor_event_reader.iter() {
        // log(format!("{:?}", event).as_str());
    }
    for event in mouse_event_reader.iter() {
        // log(format!("{:?}", event).as_str());
    }
    for event in mouse_button_reader.iter() {
        log(format!("{:?}", event).as_str());
    }
}

fn drag_entities(
    mut cursor_state: ResMut<CursorState>,
    // mut mouse_event_reader: EventReader<MouseMotion>,
    mut cursor_event_reader: EventReader<CursorMoved>,
    mut mouse_button_reader: EventReader<MouseButtonInput>,
    mut movable_q: Query<(Entity, &mut Transform, &Sprite, &Movable)>,
) {
    for (cursor_moved_event, _event_id) in cursor_event_reader.iter_with_id() {
        for (entity, mut transform, _sprite, movable) in movable_q.iter_mut() {
            match cursor_state.holding {
                Some(id) => {
                    if id == entity.id() {
                        transform.translation.x = cursor_moved_event.position.x - 400.;
                        transform.translation.y = cursor_moved_event.position.y - 300.;
                        log(format!("transform: {:?}", transform).as_str());
                        log(format!("cursor_event: {:?}", cursor_moved_event.position).as_str());
                    }
                }
                None => {}
            }
        }

        cursor_state.x = cursor_moved_event.position.x;
        cursor_state.y = cursor_moved_event.position.y;
    }

    for mb_event in mouse_button_reader.iter() {
        match mb_event {
            MouseButtonInput {
                button: MouseButton::Left,
                state: ElementState::Pressed,
            } => {
                log("left pressed");
                // grab island
                for (mut entity, mut transform, sprite, movable) in movable_q.iter_mut() {
                    log(format!("transform: {:?}", transform).as_str());
                    log(
                        format!("cursor_state: {:?}, {:?}", cursor_state.x, cursor_state.y)
                            .as_str(),
                    );
                    // commands.entity(entity).insert(Held);
                    if movable.within_bounds(&transform, (cursor_state.x, cursor_state.y)) {
                        cursor_state.holding = Some(entity.id());
                    }
                }
            }
            MouseButtonInput {
                button: MouseButton::Left,
                state: ElementState::Released,
            } => {
                cursor_state.holding = None;
                log("released");
                send("released");
                let res = read();

                match res {
                    Some(s) => {
                        log(format!("received {} from echo server", s).as_str());
                    }
                    None => {
                        log("got None back");
                    }
                }
            }
            _ => {
                log("not left");
            }
        }
    }
}

const NORMAL_BUTTON: Color = Color::rgb(0.15, 0.15, 0.15);
const HOVERED_BUTTON: Color = Color::rgb(0.25, 0.25, 0.25);
const PRESSED_BUTTON: Color = Color::rgb(0.35, 0.75, 0.35);

fn setup_button(mut commands: Commands, asset_server: Res<AssetServer>) {
    commands
        .spawn_bundle(ButtonBundle {
            style: Style {
                size: Size::new(Val::Px(150.), Val::Px(65.)),
                margin: Rect::all(Val::Auto),
                justify_content: JustifyContent::Center,
                align_items: AlignItems::Center,
                ..Default::default()
            },
            color: NORMAL_BUTTON.into(),
            ..Default::default()
        })
        .with_children(|parent| {
            parent.spawn_bundle(TextBundle {
                text: Text::with_section(
                    "Button",
                    TextStyle {
                        font: asset_server.load("fonts/Fira_Sans/FiraSans-Black.ttf"),
                        font_size: 40.,
                        color: Color::rgb(0.1, 0.1, 0.1),
                    },
                    Default::default(),
                ),
                ..Default::default()
            });
        });
}

fn button_system(
    mut interaction_query: Query<
        (&Interaction, &mut UiColor, &Children),
        (Changed<Interaction>, With<Button>),
    >,
    mut text_query: Query<&mut Text>,
) {
    for (interaction, mut color, children) in interaction_query.iter_mut() {
        let mut text = text_query.get_mut(children[0]).unwrap();
        match *interaction {
            Interaction::Clicked => {
                text.sections[0].value = "Press".to_string();
                *color = PRESSED_BUTTON.into();
            }
            Interaction::Hovered => {
                text.sections[0].value = "Hover".to_string();
                *color = HOVERED_BUTTON.into();
            }
            Interaction::None => {
                text.sections[0].value = "Button".to_string();
                *color = NORMAL_BUTTON.into();
            }
        }
    }
}

/// prints every char coming in; press enter to echo the full string
fn text_input_system(
    mut char_evr: EventReader<ReceivedCharacter>,
    keys: Res<Input<KeyCode>>,
    mut input_string: Local<String>,
    mut text_query: Query<&mut Text, With<InputText>>,
) {
    for ev in char_evr.iter() {
        println!("Got char: '{}'", ev.char);
        input_string.push(ev.char);
    }

    if keys.just_pressed(KeyCode::Return) {
        println!("Text input: {}", *input_string);
        input_string.clear();
    }

    for mut text in text_query.iter_mut() {
        text.sections[0].value = input_string.to_string();
    }
}

fn setup(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
    mut texture_atlases: ResMut<Assets<TextureAtlas>>,
) {
    commands.spawn_bundle(OrthographicCameraBundle::new_2d());

    let texture_handle = asset_server.load("images/cards.png");
    let texture_atlas = TextureAtlas::from_grid(texture_handle, Vec2::new(73., 98.), 13, 4);

    let texture_atlas_handle = texture_atlases.add(texture_atlas);
    // commands
    //     .spawn_bundle(SpriteSheetBundle {
    //         texture_atlas: texture_atlas_handle,
    //         transform: Transform {
    //             // scale: Vec3::splat(1.33334),
    //             translation: Vec3::ZERO,
    //             ..Default::default()
    //         },
    //         ..Default::default()
    //     })
    //     .insert(Timer::from_seconds(0.35, true))
    //     .insert(Card);
    // // .insert(Movable);

    // commands.spawn_bundle(SpriteBundle {
    //     texture: asset_server.load("images/cards.png"),
    //     ..Default::default()
    // });

    // ui test
    commands.spawn_bundle(UiCameraBundle::default());
    commands
        .spawn_bundle(NodeBundle {
            style: Style {
                size: Size::new(Val::Percent(100.), Val::Percent(100.)),
                justify_content: JustifyContent::SpaceBetween,
                ..Default::default()
            },
            color: Color::NONE.into(),
            ..Default::default()
        })
        .with_children(|parent| {
            parent
                .spawn_bundle(TextBundle {
                    text: Text::with_section(
                        "test",
                        TextStyle {
                            font: asset_server.load("fonts/Fira_Sans/FiraSans-Black.ttf"),
                            font_size: 40.,
                            color: Color::rgb(0.1, 0.1, 0.1),
                        },
                        Default::default(),
                    ),
                    ..Default::default()
                })
                .insert(InputText);
        });

    // setup text input
    commands.spawn_bundle(NodeBundle {
        style: Style {
            size: Size::new(Val::Px(120.), Val::Px(40.)),
            justify_content: JustifyContent::FlexStart,
            align_items: AlignItems::Center,
            ..Default::default()
        },
        color: Color::CYAN.into(),
        ..Default::default()
    });

    // setup island
    commands
        .spawn_bundle(SpriteBundle {
            texture: asset_server.load("images/island.png"),
            transform: Transform::from_xyz(0., 0., 0.),
            ..Default::default()
        })
        .insert(Card)
        .insert(Movable {
            width: 312.,
            height: 445.,
        });
}

fn setup_connection() {
    let res = send("test!!!");
    match res {
        Some(s) => {
            log(format!("received {} from echo server", s).as_str());
        }
        None => {
            log("got None back");
        }
    }
}
