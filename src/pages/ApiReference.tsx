import { DocsLayout } from "@/components/docs/DocsLayout";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { useEffect, useState } from "react";

export const ApiReference = () => {
  const [theme, setTheme] = useState(
    () =>
      (typeof window !== "undefined" && localStorage.getItem("theme")) || "dark"
  );

  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem("theme") || "dark");
    };

    window.addEventListener("theme-change", updateTheme);

    return () => {
      window.removeEventListener("theme-change", updateTheme);
    };
  }, []);

  return (
    <DocsLayout>
      <ApiReferenceReact
        key={theme}
        configuration={{
          url: "https://a2insights.com.br/docs/api.json",
          theme: "default",
          forceDarkModeState: theme === "dark" ? "dark" : "light",
          hideModels: false,
          hideDownloadButton: false,
          hideDarkModeToggle: true,
          hiddenClients: true,
        }}
      />
    </DocsLayout>
  );
};
