import type { Metadata } from "next";
import { CommandCenterDashboard } from "./CommandCenterDashboard";

export const metadata: Metadata = {
  title: "Command Center — Brad Frost Design System",
  description:
    "Design system investigation dashboard — AI-assisted component analysis, governance workflows, and system health monitoring.",
};

export default function CommandCenterPage() {
  return <CommandCenterDashboard />;
}
