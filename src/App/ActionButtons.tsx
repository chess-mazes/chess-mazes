import { FC } from "react";
import { Theme } from "./themes/themes";

export interface ActionButtonsProps {
  theme: Theme;
}

export const ActionButtons: FC<ActionButtonsProps> = ({ theme }) => {
  return <div className={`theme-${theme}`}>Action Buttons</div>;
};
