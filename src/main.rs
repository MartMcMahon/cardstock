use bevy::{prelude::*, transform};

#[derive(Component)]
struct Person;

#[derive(Component)]
struct Name(String);

#[derive(Component)]
struct Card;

#[derive(Component)]
struct InputText;

pub struct HelloPlugin;
impl Plugin for HelloPlugin {
    fn build(&self, app: &mut App) {
        app.add_startup_system(setup)
            .add_startup_system(setup_button)
            .add_system(cycle_through_cards_system)
            .add_system(button_system)
            .add_system(text_input_system);
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

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugin(HelloPlugin)
        .run();
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
    commands
        .spawn_bundle(SpriteSheetBundle {
            texture_atlas: texture_atlas_handle,
            transform: Transform {
                scale: Vec3::splat(1.33334),
                translation: Vec3::ZERO,
                ..Default::default()
            },
            ..Default::default()
        })
        .insert(Timer::from_seconds(0.35, true))
        .insert(Card);

    commands.spawn_bundle(SpriteBundle {
        texture: asset_server.load("images/cards.png"),
        ..Default::default()
    });

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
                .spawn_bundle(NodeBundle {
                    style: Style {
                        size: Size::new(Val::Px(100.), Val::Percent(100.)),
                        border: Rect::all(Val::Px(2.)),
                        ..Default::default()
                    },
                    color: Color::rgb(0.65, 0.65, 0.65).into(),
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

fn cycle_through_cards_system(
    time: Res<Time>,
    texture_atlases: Res<Assets<TextureAtlas>>,
    mut query: Query<(&mut Timer, &mut TextureAtlasSprite, &Handle<TextureAtlas>)>,
) {
    for (mut timer, mut sprite, texture_atlas_handle) in query.iter_mut() {
        timer.tick(time.delta());
        if timer.finished() {
            let texture_atlas = texture_atlases.get(texture_atlas_handle).unwrap();
            sprite.index = (sprite.index + 1) % texture_atlas.textures.len();
        }
    }
}

fn card_moving_system(time: Res<Time>, mut query: Query<(&mut Timer, &mut Transform)>) {
    for (mut timer, mut transform) in query.iter_mut() {
        timer.tick(time.delta());
        if timer.finished() {
            transform.translation.x += 100.;
            transform.translation.y += 100.;
        }
    }
}

fn add_people(mut commands: Commands) {
    commands
        .spawn()
        .insert(Person)
        .insert(Name("Elaina Proctor".to_string()));
    commands
        .spawn()
        .insert(Person)
        .insert(Name("Renzo Hume".to_string()));
    commands
        .spawn()
        .insert(Person)
        .insert(Name("Zayna Nieves".to_string()));
}

fn greet_people(query: Query<&Name, With<Person>>) {
    for name in query.iter() {
        println!("hello {}!", name.0);
    }
}
