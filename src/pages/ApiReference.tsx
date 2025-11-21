import { DocsLayout } from "@/components/docs/DocsLayout";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import { useEffect, useState } from "react";

export const ApiReference = () => {
  const [theme, setTheme] = useState(
    () =>
      (typeof window !== "undefined" && localStorage.getItem("theme")) || "dark"
  );

  const [loadedCss, setLoadedCss] = useState(false);

  useEffect(() => {
    import("@scalar/api-reference-react/style.css").then(() => {
      setLoadedCss(true);
    });
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem("theme") || "dark");
    };

    window.addEventListener("theme-change", updateTheme);
    return () => {
      window.removeEventListener("theme-change", updateTheme);
    };
  }, []);

  if (!loadedCss) return null;

  return (
    <DocsLayout>
      <ApiReferenceReact
        key={theme}
        configuration={{
          url: "/api.json",
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
