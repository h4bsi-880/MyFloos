export const CATEGORY_EMOJIS = {
  Food: "🍔",
  Groceries: "🛒",
  Clothing: "👕",
  Coffee: "☕",
  Health: "❤️",
  Cosmetics: "💄",
  "Car Maintenance": "🔧",
  Petrol: "⛽",
  "Home Maintenance": "🏠",
  Gaming: "🎮",
  Electronics: "💻",
  Furniture: "🛋️",
  Gym: "🏋️",
  School: "🎒",
  University: "🎓",
  Bills: "🧾",
  Entertainment: "🎬",
  Other: "📦",
  // Income categories
  Salary: "💰",
  Gift: "🎁",
  Freelance: "💼",
};
 
export function getCategoryEmoji(category) {
  return CATEGORY_EMOJIS[category] || "📦";
}
