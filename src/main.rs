use bevy::{input::mouse::*, prelude::*};
use bevy_mod_picking::*;
use cardstock::network;

#[derive(Default)]
struct GameCamera;
#[derive(Default)]
struct MenuOption;

enum GameState {
    InitConnection,
    Connecting,
    Game,
}

const DEBUG: bool = true;

fn main() {
    App::build()
        .insert_resource(Msaa { samples: 4 })
        .insert_resource(WindowDescriptor {
            title: "cardstock".to_string(),
            width: 800.0,
            height: 800.0,
            vsync: !DEBUG,
            ..Default::default()
        })
        .insert_resource(Selection::default())
        .add_plugins(DefaultPlugins)
        .add_plugin(PickingPlugin)
        .add_plugin(InteractablePickingPlugin)
        .add_plugin(HighlightablePickingPlugin)
        // .add_plugin(DebugCursorPickingPlugin)
        // .add_plugin(DebugEventsPickingPlugin)
        .add_startup_system(setup.system())
        .add_startup_system(create_menu.system())
        .add_system(input_system.system())
        .add_system(update_color.system())
        .run();
}

/// set up a simple 3D scene
fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    // camera
    commands
        .spawn_bundle(PerspectiveCameraBundle {
            transform: Transform::from_xyz(0.1, 5.0, 0.0).looking_at(Vec3::ZERO, Vec3::Y),
            ..Default::default()
        })
        .insert_bundle(PickingCameraBundle::default())
        .insert(GameCamera);

    // plane
    commands.spawn_bundle(PbrBundle {
        mesh: meshes.add(Mesh::from(shape::Plane { size: 15.0 })),
        material: materials.add(Color::rgb(0.3, 0.5, 0.3).into()),
        ..Default::default()
    });
    // .insert_bundle(PickableBundle::default());
    // light
    commands.spawn_bundle(LightBundle {
        transform: Transform::from_xyz(4.0, 8.0, 4.0),
        ..Default::default()
    });
}

fn create_menu(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    let mesh = meshes.add(Mesh::from(shape::Cube { size: 1.0 }));
    let white_material = materials.add(Color::rgb(1.0, 1.0, 1.0).into());

    commands
        .spawn_bundle(PbrBundle {
            mesh: meshes.add(Mesh::from(shape::Cube { size: 0.5 })),
            material: materials.add(Color::rgb(0.3, 0.6, 0.6).into()),
            transform: Transform::from_xyz(-0.5, 0.25, 0.0),
            ..Default::default()
        })
        .insert_bundle(PickableBundle::default())
        .insert(MenuOption);

    commands
        .spawn_bundle(PbrBundle {
            mesh: meshes.add(Mesh::from(shape::Cube { size: 0.5 })),
            material: materials.add(Color::rgb(0.8, 0.6, 0.6).into()),
            transform: Transform::from_xyz(0.5, 0.25, 0.0),
            ..Default::default()
        })
        .insert_bundle(PickableBundle::default())
        .insert(MenuOption);

    //     let font = asset_server.load("fonts/Fira_Sans/FiraSans-Bold.ttf");
    //     let text_style = TextStyle {
    //         font,
    //         font_size: 69.0,
    //         color: Color::WHITE,
    //     };
    //     let text_alignment = TextAlignment {
    //         vertical: VerticalAlign::Center,
    //         horizontal: HorizontalAlign::Center,
    //     };
    //     commands
    //         .spawn_bundle(Text2dBundle {
    //             text: Text::with_section("translation", text_style.clone(), text_alignment),
    //             ..Default::default()
    //         })
    //         .insert(AnimateTranslation);
}

fn update_color(
    mut events: EventReader<PickingEvent>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut query: Query<Entity, With<MenuOption>>,
) {
    // for event in events.iter() {
    //     let entity = match event {
    //         PickingEvent::Hover(hover_event) => {
    //             println!("This HoverEvent::JustEntered happened! {:?}", hover_event);
    //             match hover_event {
    //                 HoverEvent::JustEntered(entity) => entity,
    //                 HoverEvent::JustLeft(entity) => entity,
    //             }
    //         }
    //         PickingEvent::Selection(selection_event) => {
    //             println!(
    //                 "This PickingEvent::Selection happened! {:?}",
    //                 selection_event
    //             );
    //             match selection_event {
    //                 SelectionEvent::JustSelected(entity) => entity,
    //                 SelectionEvent::JustDeselected(entity) => entity,
    //             }
    //         }
    //     };
    //     println!("the entity is {:?}", entity);
    //     for ent in query.iter() {
    //         println!("ent {:?}", ent);
    //     }
    // }
}

fn input_system(
    mut mouse_button_input_events: EventReader<MouseButtonInput>,
    mut mouse_motion_events: EventReader<MouseMotion>,
    mut cursor_moved_events: EventReader<CursorMoved>,
    mut mouse_wheel_events: EventReader<MouseWheel>,
    mut events: EventReader<PickingEvent>,
    mut query: Query<PickingCamera>,
) {
    for event in mouse_button_input_events.iter() {
        // for mut text in query.iter_mut() {
        //     text.sections[1].value = format!("{:?}", event);
        // }
    }
    for event in mouse_motion_events.iter() {
        // for mut text in query.iter_mut() {
        //     text.sections[1].value = format!("{:?}", event);
        // }
    }
    for event in cursor_moved_events.iter() {
        // for mut text in query.iter_mut() {
        //     text.sections[1].value = format!("{:?}", event.position);
        // }
    }
    for event in mouse_wheel_events.iter() {
        // for mut text in query.iter_mut() {
        //     text.sections[1].value = format!("{:?}", event);
        // }
    }

    for event in events.iter() {
        eprintln!("{:?}", event);
    }

    for cam in query {
        eprintln!("{:?}", cam);
    }
}

fn server_init(mut commands: Commands, mut mode: ResMut<GameState>) {
    eprintln!("initializing server..");
    network::server();
}
