import * as v from "./src";
import { createRoot } from "react-dom/client";

globalThis.v = v;

if (typeof v.v2 === "function") {
	const root = createRoot(document.getElementById("root"));
	const C = v.v2;
	root.render(<C />);
}
