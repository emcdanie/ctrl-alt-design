import { CommandCenterNav } from "./CommandCenterNav";
import "./command-center.css";

export default function CommandCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="command-center-shell">
      <CommandCenterNav />
      <div style={{ paddingTop: 52 }}>{children}</div>
    </div>
  );
}
