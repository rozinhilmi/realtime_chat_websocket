import { store } from "../utils/store/store";

type StyleInterface = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  primaryTextColor: string;
  primaryTextTitleColor: string;
  secondaryTextColor: string;
  backgroundContainer: string;
  backgroundContainer2: string;
  selectedItem: string;
  borderColor: string;
  customBorder: string;
  borderWhite: string;
  inputColor: string;
  inputBackgroundColor: string;
  primaryButtonColor: string;
  gradientColor: string;
  borderRadius: string;
};

const currentTheme = (): boolean => {
  const currentTheme = store("currentTheme");
  return currentTheme;
};
export const useStyle = (): StyleInterface => {
  return {
    primaryColor: "#42AA58",
    secondaryColor: "#FF9228",
    backgroundColor: currentTheme() ? "#1B2627" : "#F8F9FA",
    primaryTextColor: currentTheme() ? "#FFFFFF" : "#2D3748",
    primaryTextTitleColor: "rgb(55, 158, 104)",
    secondaryTextColor: "#A0AEC0",
    backgroundContainer: currentTheme() ? "#202C2D" : "#FFFFFF",
    backgroundContainer2: currentTheme() ? "rgba(37, 53, 54, 1)" : "rgba(233, 237, 247, 1)",
    selectedItem: currentTheme() ? "rgba(66, 170, 88, 0.05)" : "#F8F9FA",
    borderColor: currentTheme() ? "#2C3D3F" : "#A0AEC0",
    customBorder: currentTheme() ? "1px solid #253536" : "1px solid #E9EDF7",
    borderWhite: "1px solid #E9EDF7",
    inputColor: currentTheme() ? "#FFFFFF" : "#2D3748",
    inputBackgroundColor: currentTheme() ? "#1B2627" : "#F8F9FA",
    primaryButtonColor: "#42AA58",
    gradientColor: "linear-gradient(90deg, #3EA955 50%, #D8F285 126.52%)",
    borderRadius: "14px",
  };
};
