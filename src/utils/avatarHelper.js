// Avatar helper for generating initials and gradient palettes

const GRADIENT_PALETTES = [
  "linear-gradient(135deg, #FF7722, #EA580C)", // Saffron / Orange
  "linear-gradient(135deg, #3B82F6, #1D4ED8)", // Royal Blue
  "linear-gradient(135deg, #10B981, #047857)", // Emerald Green
  "linear-gradient(135deg, #8B5CF6, #6D28D9)", // Deep Purple
  "linear-gradient(135deg, #EC4899, #BE185D)", // Rose Pink
  "linear-gradient(135deg, #F59E0B, #D97706)", // Amber Gold
  "linear-gradient(135deg, #06B6D4, #0E7490)", // Cyan Teal
  "linear-gradient(135deg, #6366F1, #4338CA)", // Indigo
  "linear-gradient(135deg, #14B8A6, #0F766E)", // Turquoise
  "linear-gradient(135deg, #F43F5E, #E11D48)"  // Crimson
];

/**
 * Extracts 1-2 letter initials from a full name
 */
export const getInitials = (fullName) => {
  if (!fullName) return "IN";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "IN";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Deterministically generates a gradient based on the person's name
 */
export const getAvatarGradient = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[index];
};
