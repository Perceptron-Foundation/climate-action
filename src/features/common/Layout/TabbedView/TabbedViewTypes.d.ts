export interface TabItem {
  label: string;
  link: string;
  disabled?: boolean;
  hasList?: boolean;
  step: number | string;
}
