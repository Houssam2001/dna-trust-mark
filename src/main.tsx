import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

createRoot(document.getElementById("root")!).render(
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-foreground font-bold text-lg">Loading Language...</div>}>
        <App />
    </Suspense>
);
