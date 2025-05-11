import { useEffect, useState } from "react";

type Theme = "light" | "dark";

// Function to get initial theme based on localStorage or system preference
const getInitialTheme = (): Theme => {
  // Check for saved theme in localStorage
  const savedTheme = localStorage.getItem("foshizzle-theme") as Theme | null;
  if (savedTheme) {
    return savedTheme;
  }

  // If no saved theme, check system preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useTheme = () => {
  // Initialize with the correct theme instead of hardcoding "light"
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Update HTML class and localStorage when theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("foshizzle-theme", theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
};
