export const colorsList = ['default', 'emerald', 'wood', 'candy'] as const;

export type BoardColors = (typeof colorsList)[number];

export const boardColorClass = (colors: BoardColors) => `board-colors-${colors}`;
