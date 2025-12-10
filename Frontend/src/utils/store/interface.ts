export type StoreInterface = {
  setStore: (key: string, newValue: any) => void;
  count: number;
  inputState: string;
  currentTheme: boolean;
  setTheme: () => void;
  token: string;
};
