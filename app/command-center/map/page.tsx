import type { Metadata } from "next";
import { SystemMap } from "./SystemMap";

export const metadata: Metadata = {
  title: "System Map — Brad Frost Design System",
  description:
    "Interactive explorable map of the Atomic Design system — pan, zoom, and discover how atoms compose into molecules, organisms, and templates.",
};

export default function MapPage() {
  return <SystemMap />;
}
