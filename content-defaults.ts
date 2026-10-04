import { photo } from "@/db/catalog-data";

/**
 * Every editable string and image on the site, keyed by page.section.field.
 * Values here are defaults; anything saved from the Studio overrides them.
 */
export const contentDefaults: Record<string, string> = {
  // Brand
  "brand.wordmark": "JONGLEI",
  "brand.name": "Jonglei",
  "brand.tagline": "Jonglei, Paris. Evening, tailoring and leather, cut in the atelier since 1924.",
  "brand.sideNote": "Paris — 1924",

  // Navigation (one per line: Label | /path)
  "nav.links": [
    "New Arrivals | /shop?sort=new",
    "Nocturne | /collections/nocturne",
    "Jardin Blanc | /collections/jardin-blanc",
    "Rue | /collections/rue",
    "Evening | /shop?category=Evening",
    "Ready-to-Wear | /shop?category=Ready-to-Wear",
    "Outerwear | /shop?category=Outerwear",
    "Leather | /shop?category=Leather",
    "Shoes | /shop?category=Shoes",
    "Accessories | /shop?category=Accessories",
    "Lookbook | /lookbook",
    "Campaign | /campaign/nocturne",
    "The House | /about",
    "Client Services | /client-services",
  ].join("\n"),
  "nav.menuImage": photo(24740643, 1400),
  "nav.menuLabel": "Autumn / Winter 2026",
  "nav.menuTitle": "Nocturne",

  // Home — hero
  "home.hero.image": photo(35773806, 2200),
  "home.hero.video": "https://videos.pexels.com/video-files/31889391/13583016_2160_3840_25fps.mp4",
  "home.hero.label": "Autumn / Winter 2026",
  "home.hero.title": "Nocturne",
  "home.hero.cta": "Explore",
  "home.hero.href": "/collections/nocturne",

  // Home — editorial
  "home.editorial.image": photo(24740643, 1800),
  "home.editorial.kicker": "House notes — 01",
  "home.editorial.title": "The night, cut in silk.",
  "home.editorial.body":
    "Nocturne is a study in ink and silence. Column silks, lacquered leather, and tailoring cut close to the body — a wardrobe for rooms lit only by chandeliers.",
  "home.editorial.cta": "View the campaign",
  "home.editorial.href": "/campaign/nocturne",
  "home.editorial.smallImage": photo(20437814, 1400),
  "home.editorial.smallCaption": "Obsidian coat, unlined",

  // Home — collection intro
  "home.collection.image": photo(33497604, 2200),
  "home.collection.cta": "Enter the collection",
  "home.collection.href": "/collections/nocturne",
  "home.edit.kicker": "The edit",
  "home.edit.link": "All Nocturne",

  // Home — quote
  "home.quote.text": "“A garment should enter the room first.”",
  "home.quote.author": "Hélène Sèvre, 1924",

  // Home — Jardin Blanc
  "home.jardin.cta": "Enter the collection",
  "home.jardin.href": "/collections/jardin-blanc",

  // Home — film
  "home.film.image": photo(24740643, 2000),
  "home.film.label": "Film",
  "home.film.title": "Nocturne",
  "home.film.cta": "Watch the campaign",
  "home.film.href": "/campaign/nocturne",

  // Home — lookbook teaser
  "home.lookbook.image1": photo(36136307, 1400),
  "home.lookbook.image2": photo(29222663, 1400),
  "home.lookbook.kicker": "Lookbook",
  "home.lookbook.title": "A magazine, not a catalogue.",
  "home.lookbook.cta": "Open the lookbook",
  "home.lookbook.href": "/lookbook",

  // Home — Rue
  "home.rue.label": "Permanent line",
  "home.rue.cta": "View Rue",
  "home.rue.href": "/collections/rue",

  // Home — house
  "home.house.image": photo(8526931, 1600),
  "home.house.kicker": "The house",
  "home.house.title": "Still cut in Paris.",
  "home.house.body":
    "Above a porcelain workshop on the rue de Sèvres, Hélène Sèvre opened an atelier in 1924. The address has not changed. Neither has the rule: fewer pieces, better cloth, no noise.",
  "home.house.cta": "Read the house",
  "home.house.href": "/about",

  // About
  "about.hero.image": photo(19685876, 2200),
  "about.hero.label": "Paris — 1924",
  "about.hero.title": "The House",
  "about.philosophy.title": "A garment should enter the room before the person wearing it — and then disappear into gesture.",
  "about.philosophy.body1":
    "Jonglei was established by couturière Hélène Sèvre, who kept her tables above a porcelain workshop and borrowed its discipline: thin walls, exact edges, no decoration that did not earn its place.",
  "about.philosophy.body2":
    "The house still cuts in Paris. Creative direction is held by Camille Vasseur, who treats each collection as a short film — one hour, one light, one silhouette.",
  "about.direction.image": photo(21855757, 1800),
  "about.direction.kicker": "Creative direction",
  "about.direction.title": "Camille Vasseur",
  "about.direction.body":
    "Appointed in 2012, Vasseur did not rename the house and did not move it. She edits. A collection is finished when nothing else can be removed. Colour is rare, and therefore remembered.",
  "about.visit.image": photo(19892804, 1600),
  "about.visit.kicker": "Visit",
  "about.visit.title": "12 rue de Sèvres",
  "about.visit.body": "The flagship is by appointment. Fittings are unhurried. Alterations are done upstairs, where the first tables still stand.",
  "about.visit.cta": "Request a fitting",
  "about.visit.href": "/contact?subject=Appointment",

  // Footer
  "footer.title": "Jonglei",
  "footer.body": "Jonglei, 12 rue de Sèvres, Paris. Evening, tailoring and leather, cut in the atelier since 1924.",
  "footer.newsletterLabel": "Correspondence",
  "footer.newsletterButton": "Join",
  "footer.city": "Paris",
};

export const contentGroups = [
  { id: "brand", title: "Brand" },
  { id: "nav", title: "Navigation & menu" },
  { id: "home", title: "Homepage" },
  { id: "about", title: "About" },
  { id: "footer", title: "Footer" },
];

export function isImageKey(key: string) {
  return /(^|\.)(image|smallImage|image1|image2|menuImage)$/i.test(key);
}

export function isLinkKey(key: string) {
  return /\.href$/.test(key);
}

export function isLongKey(key: string) {
  return /(body|body1|body2|text|links|tagline)$/.test(key);
}
