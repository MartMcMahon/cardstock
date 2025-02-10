use serde::Deserialize;
use std::collections::HashMap;

#[derive(Clone, Debug, Deserialize)]
pub struct CardSet {
    artist: Option<String>,
    artist_ids: Option<Vec<String>>,
    ascii_name: Option<String>,
    attraction_lights: Option<Vec<u32>>,
    availability: Vec<String>,
    booster_types: Option<Vec<String>>,
    border_color: String,
    card_parts: Option<Vec<String>>,
    color_identity: Vec<String>,
    color_indicator: Option<Vec<String>>,
    pub colors: Vec<String>,
    converted_mana_cost: f64,
    defense: Option<String>,
    duel_deck: Option<String>,
    edhrec_rank: Option<u32>,
    edhrec_saltiness: Option<f64>,
    face_converted_mana_cost: Option<f64>,
    face_flavor_name: Option<String>,
    face_mana_value: Option<f64>,
    face_name: Option<String>,
    finishes: Vec<String>,
    flavor_name: Option<String>,
    flavor_text: Option<String>,
    foreign_data: Option<Vec<ForeignData>>,
    frame_effects: Option<Vec<String>>,
    frame_version: String,
    hand: Option<String>,
    has_alternative_deck_limit: Option<bool>,
    has_content_warning: Option<bool>,
    has_foil: bool,
    has_non_foil: bool,
    pub identifiers: Identifiers,
    is_alternative: Option<bool>,
    is_full_art: Option<bool>,
    is_funny: Option<bool>,
    is_online_only: Option<bool>,
    is_oversized: Option<bool>,
    is_promo: Option<bool>,
    is_rebalanced: Option<bool>,
    is_reprint: Option<bool>,
    is_reserved: Option<bool>,
    is_starter: Option<bool>,
    is_story_spotlight: Option<bool>,
    is_textless: Option<bool>,
    is_timeshifted: Option<bool>,
    keywords: Option<Vec<String>>,
    language: String,
    layout: String,
    leadership_skills: Option<LeadershipSkills>,
    legalities: Legalities,
    life: Option<String>,
    loyalty: Option<String>,
    mana_cost: Option<String>,
    mana_value: f64,
    pub name: String,
    number: String,
    original_printings: Option<Vec<String>>,
    original_release_date: Option<String>,
    original_text: Option<String>,
    original_type: Option<String>,
    other_face_ids: Option<Vec<String>>,
    power: Option<String>,
    printings: Option<Vec<String>>,
    promo_types: Option<Vec<String>>,
    purchase_urls: PurchaseUrls,
    rarity: String,
    related_cards: Option<RelatedCards>,
    rebalanced_printings: Option<Vec<String>>,
    rulings: Option<Vec<Rulings>>,
    security_stamp: Option<String>,
    pub set_code: String,
    side: Option<String>,
    signature: Option<String>,
    source_products: Option<SourceProducts>,
    subsets: Option<Vec<String>>,
    subtypes: Vec<String>,
    supertypes: Vec<String>,
    text: Option<String>,
    toughness: Option<String>,
    type_: String, // `type` is a reserved keyword in Rust
    types: Vec<String>,
    pub uuid: String,
    variations: Option<Vec<String>>,
    watermark: Option<String>,
}

// Define dependent structs based on the fields used
#[derive(Clone, Debug, Deserialize)]
struct ForeignData {
    // Add appropriate fields here
}

#[derive(Clone, Debug, Deserialize)]
pub struct Identifiers {
    card_kingdom_etched_id: Option<String>,
    card_kingdom_foil_id: Option<String>,
    card_kingdom_id: Option<String>,
    cardsphere_id: Option<String>,
    cardsphere_foil_id: Option<String>,
    mcm_id: Option<String>,
    mcm_meta_id: Option<String>,
    mtg_arena_id: Option<String>,
    mtgjson_foil_version_id: Option<String>,
    mtgjson_non_foil_version_id: Option<String>,
    mtgjson_v4_id: Option<String>,
    mtgo_foil_id: Option<String>,
    mtgo_id: Option<String>,
    multiverse_id: Option<String>,
    pub scryfall_id: Option<String>,
    scryfall_card_back_id: Option<String>,
    scryfall_oracle_id: Option<String>,
    scryfall_illustration_id: Option<String>,
    tcgplayer_product_id: Option<String>,
    tcgplayer_etched_product_id: Option<String>,
}

#[derive(Clone, Debug, Deserialize)]
struct LeadershipSkills {
    // Add appropriate fields here
}

#[derive(Clone, Debug, Deserialize)]
struct Legalities {
    // Add appropriate fields here
}

#[derive(Clone, Debug, Deserialize)]
struct PurchaseUrls {
    // Add appropriate fields here
}

#[derive(Clone, Debug, Deserialize)]
struct RelatedCards {
    // Add appropriate fields here
}

#[derive(Clone, Debug, Deserialize)]
struct Rulings {
    // Add appropriate fields here
}

#[derive(Clone, Debug, Deserialize)]
struct SourceProducts {
    // Add appropriate fields here
}

#[derive(Debug, Deserialize)]
pub struct Set {
    base_set_size: u32,    // number in TypeScript is typically mapped to u32 in Rust
    block: Option<String>, // optional string
    booster: Option<HashMap<String, BoosterConfig>>, // optional Record<string, BoosterConfig>
    pub cards: Vec<CardSet>, // array of CardSet
    cardsphere_set_id: Option<u32>, // optional number
    code: String,          // string
    code_v3: Option<String>, // optional string
    decks: Option<Vec<DeckSet>>, // optional array of DeckSet
    is_foreign_only: Option<bool>, // optional boolean
    is_foil_only: bool,    // boolean
    is_non_foil_only: Option<bool>, // optional boolean
    is_online_only: bool,  // boolean
    is_paper_only: Option<bool>, // optional boolean
    is_partial_preview: Option<bool>, // optional boolean
    keyrune_code: String,  // string
    languages: Option<Vec<String>>, // optional array of strings
    mcm_id: Option<u32>,   // optional number
    mcm_id_extras: Option<u32>, // optional number
    mcm_name: Option<String>, // optional string
    mtgo_code: Option<String>, // optional string
    name: String,          // string
    parent_code: Option<String>, // optional string
    release_date: String,  // string
    sealed_product: Option<Vec<SealedProduct>>, // optional array of SealedProduct
    tcgplayer_group_id: Option<u32>, // optional number
    tokens: Vec<CardToken>, // array of CardToken
    token_set_code: Option<String>, // optional string
    total_set_size: u32,   // number
    translations: Translations, // Translations (assuming non-optional)
    type_: String,         // string (renamed from 'type' due to Rust keyword)
}

#[derive(Debug, Deserialize)]
struct BoosterConfig {
    // Define fields based on actual BoosterConfig structure
}

#[derive(Debug, Deserialize)]
struct DeckSet {
    // Define fields based on actual DeckSet structure
}

#[derive(Debug, Deserialize)]
struct SealedProduct {
    // Define fields based on actual SealedProduct structure
}

#[derive(Debug, Deserialize)]
struct CardToken {
    // Define fields based on actual CardToken structure
}

#[derive(Debug, Deserialize)]
struct Translations {
    // Define fields based on actual Translations structure
}
