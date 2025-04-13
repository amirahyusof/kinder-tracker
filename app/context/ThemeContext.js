"use client"
import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

 //load theme from local storage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if(savedTheme){
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  //save theme to local storage and set it on the document element
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove(theme === "light" ? "dark" : "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  //toggle theme between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
