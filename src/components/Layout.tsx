import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }

    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem("theme");
      setIsDarkMode(currentTheme === "dark");
    };

    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  return (
    <div className={`layout ${isDarkMode ? "dark-mode" : ""}`}>
      <Header />
      <main className={`main-content ${isDarkMode ? "dark-mode" : ""}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
