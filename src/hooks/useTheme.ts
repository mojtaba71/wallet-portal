import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export const useTheme = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  
  const isDark = theme === 'dark';
  const isLight = theme === 'light';
  
  return {
    theme,
    isDark,
    isLight,
    getThemeClasses: (lightClass: string, darkClass: string) => 
      isDark ? darkClass : lightClass,
  };
};
