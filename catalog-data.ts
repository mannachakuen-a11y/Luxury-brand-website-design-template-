export const NOCTURNE_FILM =
  "https://videos.pexels.com/video-files/31889391/13583016_2160_3840_25fps.mp4";

export function photo(id: number, width = 1800) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

export const CLOTHING = ["34", "36", "38", "40", "42", "44"];
export const SHOES = ["36", "37", "38", "39", "40", "41"];
export const ONE = ["OS"];

export const collectionSeeds = [
  {
    slug: "nocturne",
    name: "Nocturne",
    season: "Autumn / Winter 2026",
    statement: "An evening language of black silk, polished calf, and light caught once.",
    story: "Nocturne returns as the house night collection. Silhouettes are long, almost architectural, then broken by a single liquid drape. It is shown in rooms with no daylight, and worn in the same conditions.",
    heroId: 35773806,
    secondaryId: 24740643,
    videoUrl: NOCTURNE_FILM,
    sortOrder: 1,
  },
  {
    slug: "jardin-blanc",
    name: "Jardin Blanc",
    season: "Spring / Summer 2026",
    statement: "A paler hour. Ivory cloth, bare shoulders, pearls worn as if forgotten.",
    story: "Jardin Blanc is cut for morning light and stone courtyards. The palette is cream, pearl, and — once — a heated amber kept because the cloth refused to be quiet.",
    heroId: 31674953,
    secondaryId: 20425011,
    videoUrl: null as string | null,
    sortOrder: 2,
  },
  {
    slug: "rue",
    name: "Rue",
    season: "The permanent line",
    statement: "City tailoring for the walk between appointments.",
    story: "Rue is the house uniform away from evening. Bordeaux wool, an architectural shoulder, and leather meant to be worn rather than displayed. Nothing here asks to be noticed twice.",
    heroId: 36136307,
    secondaryId: 33401683,
    videoUrl: null as string | null,
    sortOrder: 3,
  },
];

type SeedImage = {
  id?: number;
  url?: string;
  alt: string;
  kind: "model" | "detail" | "product" | "campaign" | "video";
};

export type SeedProduct = {
  slug: string;
  name: string;
  category: string;
  collection: string;
  description: string;
  materials: string;
  details: string;
  price: number;
  featured: boolean;
  isNew: boolean;
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: SeedImage[];
};

const ink = { name: "Ink", hex: "#141414" };
const noir = { name: "Noir", hex: "#0c0c0c" };
const ivory = { name: "Ivory", hex: "#f3eee6" };
const pearl = { name: "Pearl", hex: "#f4efe8" };
const bordeaux = { name: "Bordeaux", hex: "#6d2e36" };
const cognac = { name: "Cognac", hex: "#6a4630" };
const amber = { name: "Amber", hex: "#c65a2e" };

export const productSeeds: SeedProduct[] = [
  {
    slug: "column-gown",
    name: "Column Gown",
    category: "Evening",
    collection: "nocturne",
    description:
      "A floor-length column in double-faced silk, cut to fall without interruption. The neckline is a quiet boat; the back, a single opening. Made for rooms lit only after dark.",
    materials: "Double-faced silk satin. Silk habotai lining. Covered hook at the nape.",
    details:
      "Cut close through the body and released at the hem. Model wears size 36. The salon can lengthen the hem for frames above 178 cm.",
    price: 485000,
    featured: true,
    isNew: true,
    colors: [ink],
    sizes: CLOTHING,
    images: [
      { id: 35773806, alt: "Model in a long black column gown", kind: "model" },
      { id: 16814077, alt: "Black evening dress, studio portrait", kind: "model" },
      { id: 20808809, alt: "Full-length black dress against a pale ground", kind: "campaign" },
      { id: 4814074, alt: "Close drape of black silk", kind: "detail" },
      { url: NOCTURNE_FILM, alt: "Nocturne campaign film", kind: "video" },
    ],
  },
  {
    slug: "piano-gown",
    name: "Piano Gown",
    category: "Evening",
    collection: "nocturne",
    description:
      "Sequin laid over silk tulle, catching light only when the wearer turns. A gown for a room with a piano and very little else.",
    materials: "Silk tulle, hand-laid sequin, silk crepe lining.",
    details: "Fitted through the bodice, fluid from the hip. Allow ease at the shoulder. Zip closure.",
    price: 560000,
    featured: true,
    isNew: true,
    colors: [noir],
    sizes: CLOTHING,
    images: [
      { id: 24740643, alt: "Model in a black sequined gown beside a piano", kind: "model" },
      { id: 33497604, alt: "Black gown against a deep red ground", kind: "campaign" },
      { id: 10398198, alt: "Evening silhouette on a dark ground", kind: "model" },
      { id: 6843237, alt: "Silk with a low sheen", kind: "detail" },
    ],
  },
  {
    slug: "galliera-gown",
    name: "Galliera Gown",
    category: "Evening",
    collection: "nocturne",
    description:
      "Black lace, fully lined, with a neckline that sits away from the throat. Named for the closed room where the house first showed evening.",
    materials: "Cotton-silk lace. Silk charmeuse lining. Covered buttons.",
    details: "Follows the body without clinging. Model wears size 36. Lined to the hem.",
    price: 620000,
    featured: false,
    isNew: false,
    colors: [noir],
    sizes: CLOTHING,
    images: [
      { id: 950779, alt: "Lace evening gown, editorial portrait", kind: "model" },
      { id: 7494258, alt: "Black and white portrait in a long gown", kind: "campaign" },
      { id: 19590843, alt: "Long evening dress in the studio", kind: "model" },
      { id: 4814074, alt: "Textile detail", kind: "detail" },
    ],
  },
  {
    slug: "obsidian-coat",
    name: "Obsidian Coat",
    category: "Outerwear",
    collection: "nocturne",
    description:
      "Leather cut like cloth. Unlined through the sleeve, weighted at the hem, with a collar that stands only if asked.",
    materials: "Calf leather. Silk binding. Horn button.",
    details: "Relaxed shoulder, straight sleeve. The leather will mark with wear. That is intended.",
    price: 320000,
    featured: true,
    isNew: false,
    colors: [noir],
    sizes: CLOTHING,
    images: [
      { id: 20437814, alt: "Model in a black leather coat, studio", kind: "model" },
      { id: 32310029, alt: "Leather tailoring, full silhouette", kind: "model" },
      { id: 15161529, alt: "Portrait in a black leather jacket", kind: "campaign" },
      { id: 4814074, alt: "Dark material, close", kind: "detail" },
    ],
  },
  {
    slug: "after-hours-suit",
    name: "After-Hours Suit",
    category: "Ready-to-Wear",
    collection: "nocturne",
    description:
      "A jacket and trouser cut as one thought. Dense wool, a narrow lapel, a straight leg. Evening, without the costume.",
    materials: "Wool gabardine. Silk lining. Horn buttons.",
    details: "Sold as a suit. Jacket and trouser share a size. Slightly long sleeve, meant to break at the hand.",
    price: 248000,
    featured: true,
    isNew: false,
    colors: [ink],
    sizes: CLOTHING,
    images: [
      { id: 27623995, alt: "Model seated in a dark tailored suit", kind: "model" },
      { id: 16107553, alt: "Formal black tailoring, studio portrait", kind: "model" },
      { id: 15161529, alt: "Close portrait in black", kind: "campaign" },
    ],
  },
  {
    slug: "opera-stiletto",
    name: "Opera Stiletto",
    category: "Shoes",
    collection: "nocturne",
    description:
      "A narrow heel and a sharp toe, made for carpet rather than cobblestone. Patent, so the light has somewhere to go.",
    materials: "Patent calf. Leather sole. 95 mm heel.",
    details: "European sizing. Fits true to size. Leather sole can be tipped by the salon.",
    price: 98000,
    featured: true,
    isNew: true,
    colors: [noir],
    sizes: SHOES,
    images: [
      { id: 34341694, alt: "Black stiletto on a pale ground", kind: "product" },
      { id: 29222663, alt: "Stiletto with pearls and gloves", kind: "campaign" },
      { id: 10686370, alt: "Black heel worn with evening cloth", kind: "model" },
      { id: 8511324, alt: "Close study of a black heel", kind: "detail" },
    ],
  },
  {
    slug: "ivory-dress",
    name: "Ivory Dress",
    category: "Ready-to-Wear",
    collection: "jardin-blanc",
    description:
      "A long ivory dress with almost no ornament. The luxury is the fall of the cloth and the quiet of the neckline.",
    materials: "Silk crepe. Cotton bodice lining.",
    details: "Ankle length. Clean shoulder. Model wears size 36. Side zip.",
    price: 219000,
    featured: true,
    isNew: true,
    colors: [ivory],
    sizes: CLOTHING,
    images: [
      { id: 31674953, alt: "Model in an ivory dress, dramatic light", kind: "model" },
      { id: 13381715, alt: "Ivory dress against a dark ground", kind: "model" },
      { id: 13707429, alt: "Long ivory dress, studio", kind: "campaign" },
      { id: 8465992, alt: "Cream silk, folded", kind: "detail" },
    ],
  },
  {
    slug: "atelier-silk",
    name: "Atelier Silk",
    category: "Evening",
    collection: "jardin-blanc",
    description:
      "Bias-cut silk that moves a half-second after the body. A dress that can cross a courtyard and still arrive composed.",
    materials: "Silk satin, bias cut. Rolled hem. No lining below the hip.",
    details: "Fluid fit. Best in your usual size. The hem is meant to skim, not pool.",
    price: 390000,
    featured: true,
    isNew: false,
    colors: [ivory],
    sizes: CLOTHING,
    images: [
      { id: 20425011, alt: "Silk dress photographed in the atelier", kind: "model" },
      { id: 19771938, alt: "Long silk dress, tonal portrait", kind: "model" },
      { id: 12466602, alt: "Silk dress in an architectural arch", kind: "campaign" },
      { id: 8465992, alt: "Silk fold", kind: "detail" },
    ],
  },
  {
    slug: "blanc-coat",
    name: "Blanc Coat",
    category: "Outerwear",
    collection: "jardin-blanc",
    description:
      "Ivory wool, double-breasted, with a shoulder that is structured and then immediately forgotten. The coat of the daytime house.",
    materials: "Double-faced wool. Horn buttons. No contrast lining.",
    details: "Knee length. Room through the arm for a knit or a shirt. Not a rain coat.",
    price: 275000,
    featured: false,
    isNew: false,
    colors: [ivory],
    sizes: CLOTHING,
    images: [
      { id: 6702736, alt: "Ivory coat, studio", kind: "model" },
      { id: 11826093, alt: "Pale tailoring with a black bag", kind: "campaign" },
      { id: 13707429, alt: "Ivory cloth in long light", kind: "model" },
    ],
  },
  {
    slug: "plume-shawl",
    name: "Plume Shawl",
    category: "Accessories",
    collection: "jardin-blanc",
    description:
      "A shawl for the short walk from car to room. Light enough to forget, precise enough to finish a neckline.",
    materials: "Dyed ostrich plume on silk organza. Hidden hook.",
    details: "One size. Handle as evening cloth. The salon can refresh the plumes between seasons.",
    price: 128000,
    featured: false,
    isNew: false,
    colors: [ivory],
    sizes: ONE,
    images: [
      { id: 10933466, alt: "Feather shawl worn over the shoulder", kind: "model" },
      { id: 13381600, alt: "Pale cloth in low light", kind: "campaign" },
      { id: 8465992, alt: "Organza texture", kind: "detail" },
    ],
  },
  {
    slug: "pearl-drop",
    name: "Pearl Drop",
    category: "Accessories",
    collection: "jardin-blanc",
    description:
      "A single drop, suspended from a barely-there wire. Worn as if it had always been there.",
    materials: "Cultured pearl. White-gold plated silver wire. Post fastening.",
    details: "Sold as a pair. Drop length 18 mm. Keep apart from perfume.",
    price: 68000,
    featured: true,
    isNew: true,
    colors: [pearl],
    sizes: ONE,
    images: [
      { id: 9428790, alt: "Pearl earring, close", kind: "product" },
      { id: 9429420, alt: "Pearls worn at the ear and throat", kind: "model" },
      { id: 8195828, alt: "Pearl study, profile", kind: "campaign" },
    ],
  },
  {
    slug: "collier-de-perle",
    name: "Collier de Perle",
    category: "Accessories",
    collection: "jardin-blanc",
    description:
      "A short strand, uneven by a millimetre on purpose. The clasp sits at the nape and disappears.",
    materials: "Cultured pearls. Silk thread. Gold-plated clasp.",
    details: "Length 40 cm. One size. Restringing is offered by the salon after two years of wear.",
    price: 89000,
    featured: false,
    isNew: false,
    colors: [pearl],
    sizes: ONE,
    images: [
      { id: 9429434, alt: "Pearl necklace at the nape", kind: "product" },
      { id: 9429420, alt: "Pearls worn with bare shoulders", kind: "model" },
      { id: 8195828, alt: "Pearl portrait", kind: "detail" },
    ],
  },
  {
    slug: "soleil-gown",
    name: "Soleil Gown",
    category: "Evening",
    collection: "jardin-blanc",
    description:
      "Evening cloth in a heated amber, photographed against drapery of the same temperature. A rare colour for the house, used once and kept.",
    materials: "Silk lamé. Silk lining. Covered zip.",
    details: "Column fit. The cloth marks if folded sharply — hang it. Model wears size 36.",
    price: 520000,
    featured: true,
    isNew: true,
    colors: [amber],
    sizes: CLOTHING,
    images: [
      { id: 37346214, alt: "Amber evening gown in dramatic drapery", kind: "model" },
      { id: 37346213, alt: "Portrait in orange cloth", kind: "campaign" },
      { id: 6843237, alt: "Sheen of evening cloth", kind: "detail" },
    ],
  },
  {
    slug: "bordeaux-coat",
    name: "Bordeaux Coat",
    category: "Outerwear",
    collection: "rue",
    description:
      "Wool the colour of a closed theatre curtain. Cut for the street, not the salon, with a belt that is optional and usually ignored.",
    materials: "Wool cashmere blend. Viscose lining. Horn buckle, removable.",
    details: "Mid-calf. Room for a jacket beneath. Dry clean only.",
    price: 298000,
    featured: true,
    isNew: true,
    colors: [bordeaux],
    sizes: CLOTHING,
    images: [
      { id: 36136307, alt: "Bordeaux coat on a city street", kind: "model" },
      { id: 5671039, alt: "Coat walking a European street", kind: "campaign" },
      { id: 19058888, alt: "Coat in motion, crossing", kind: "model" },
    ],
  },
  {
    slug: "atelier-shoulder",
    name: "Atelier Shoulder",
    category: "Leather",
    collection: "rue",
    description:
      "A shoulder bag in cognac calf, soft enough to collapse, structured enough to keep a book’s spine. One strap. No logo.",
    materials: "Calf leather. Unlined interior in cotton suede. Magnetic close.",
    details: "One size. Strap drop 28 cm. The leather will darken at the handle.",
    price: 285000,
    featured: true,
    isNew: false,
    colors: [cognac],
    sizes: ONE,
    images: [
      { id: 10296778, alt: "Cognac leather bag worn at the shoulder", kind: "model" },
      { id: 35324419, alt: "Leather bag, isolated", kind: "product" },
      { id: 7953286, alt: "Leather goods study", kind: "detail" },
    ],
  },
  {
    slug: "architectural-blazer",
    name: "Architectural Blazer",
    category: "Ready-to-Wear",
    collection: "rue",
    description:
      "An oversized blazer with a shoulder that extends just past the arm, then stops. Worn open, over very little.",
    materials: "Wool tropical. Cupro lining. Single button, usually undone.",
    details: "Take your usual size for the intended volume. A size down will read as a jacket, not a blazer.",
    price: 168000,
    featured: true,
    isNew: false,
    colors: [noir],
    sizes: CLOTHING,
    images: [
      { id: 33401683, alt: "Oversized black blazer, urban", kind: "model" },
      { id: 11311402, alt: "Tailored black outer layer", kind: "campaign" },
      { id: 16107553, alt: "Black tailoring, close", kind: "detail" },
    ],
  },
  {
    slug: "salon-bag",
    name: "Salon Bag",
    category: "Leather",
    collection: "rue",
    description:
      "A small structured bag in black calf. The handle is short, so it sits under the arm and disappears into the coat.",
    materials: "Box calf. Suede interior. Gold-tone clasp, unsigned.",
    details: "One size. Fits a telephone, a card case, a lipstick. Not a day bag.",
    price: 220000,
    featured: true,
    isNew: false,
    colors: [noir],
    sizes: ONE,
    images: [
      { id: 11826093, alt: "Black handbag with pale tailoring", kind: "model" },
      { id: 35324419, alt: "Structured leather bag", kind: "product" },
      { id: 10296778, alt: "Bag carried close to the body", kind: "campaign" },
    ],
  },
  {
    slug: "lacquer-pump",
    name: "Lacquer Pump",
    category: "Shoes",
    collection: "rue",
    description:
      "The daytime sister of the Opera Stiletto. The same last, a lower heel, a quieter shine.",
    materials: "Calf leather with a lacquered finish. Leather sole. 70 mm heel.",
    details: "European sizing. Fits true. The finish is not intended for heavy rain.",
    price: 89000,
    featured: false,
    isNew: true,
    colors: [noir],
    sizes: SHOES,
    images: [
      { id: 33812281, alt: "Sculptural heel against architecture", kind: "product" },
      { id: 34341694, alt: "Black pump, minimal ground", kind: "product" },
      { id: 10686370, alt: "Heel worn with a dark hem", kind: "model" },
      { id: 8511324, alt: "Heel detail", kind: "detail" },
    ],
  },
];

export const DEMO_EMAIL = "client@jonglei.com";
export const DEMO_PASSWORD = "nocturne1924";
export const DEMO_NAME = "Camille Laurent";
