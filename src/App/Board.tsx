import { FC } from "react";
import { Theme } from "./themes/themes";

export interface BoardProps {
  theme: Theme;
}

export const Board: FC<BoardProps> = ({ theme }) => {
  return <div className={`theme-${theme} flex-auto`}>Board</div>;
};
