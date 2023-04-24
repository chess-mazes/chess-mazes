export const themeList = ['default', 'emerald', 'wood', 'candy'] as const;

export type Theme = (typeof themeList)[number];
