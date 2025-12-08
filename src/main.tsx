import { ViteReactSSG } from "vite-react-ssg";
import { ssgRoutes } from "./App";
import "./index.css";

export const createRoot = ViteReactSSG({
  routes: ssgRoutes,
  basename: import.meta.env.BASE_URL,
});
