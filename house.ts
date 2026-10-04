export const FREE_SHIPPING = 50000;
export const STANDARD_SHIPPING = 3500;
export const EXPRESS_SHIPPING = 4500;

export const CATEGORIES = [
  "Evening",
  "Ready-to-Wear",
  "Outerwear",
  "Leather",
  "Shoes",
  "Accessories",
] as const;

export const COUNTRIES = [
  "France",
  "Italy",
  "United Kingdom",
  "United States",
  "Germany",
  "Switzerland",
  "Spain",
  "Japan",
  "United Arab Emirates",
  "Other",
];

export const CLOTHING_MEASURES = [
  { size: "34", bust: "80", waist: "62", hip: "88" },
  { size: "36", bust: "84", waist: "66", hip: "92" },
  { size: "38", bust: "88", waist: "70", hip: "96" },
  { size: "40", bust: "92", waist: "74", hip: "100" },
  { size: "42", bust: "96", waist: "78", hip: "104" },
  { size: "44", bust: "100", waist: "82", hip: "108" },
];

export const SHOE_MEASURES = [
  { size: "36", cm: "23.0" },
  { size: "37", cm: "23.7" },
  { size: "38", cm: "24.3" },
  { size: "39", cm: "25.0" },
  { size: "40", cm: "25.7" },
  { size: "41", cm: "26.3" },
];

export function shippingCost(subtotal: number, method: string) {
  if (method === "express") return EXPRESS_SHIPPING;
  if (subtotal >= FREE_SHIPPING) return 0;
  return STANDARD_SHIPPING;
}

export function shippingLabel(method: string) {
  return method === "express" ? "Express atelier dispatch" : "Standard salon delivery";
}
