import type { CSSProperties, ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import s from "./Kit.module.css";

/* The Case UI kit as site components (Site v3 run 2, Elleta: "can't we just
   build it?"). Product UI for case pictures only; see Kit.module.css. Kit
   text is real text, decorative to the page: a picture's alt-equivalent is
   its figure caption, and each picture names itself with role="img". */

export function KitTheme({ mode = "default", children }: { mode?: "default" | "federated"; children: ReactNode }) {
  return (
    <div className={s.theme} data-mode={mode}>
      {children}
    </div>
  );
}

export function KitPanel({ className = "", style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={`${s.panel} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

export function KitButton({ children, size = "md", className = "" }: { children: ReactNode; size?: "md" | "sm"; className?: string }) {
  return (
    <span className={`${s.button} ${className}`.trim()} data-size={size}>
      {children}
    </span>
  );
}

export function KitInput({ children, search = false, className = "" }: { children: ReactNode; search?: boolean; className?: string }) {
  return (
    <span className={`${s.input} ${className}`.trim()}>
      {search ? <Icon name="Search" size="sm" /> : null}
      {children}
    </span>
  );
}

export function KitChip({ children, selected = false, swatch, className = "" }: { children: ReactNode; selected?: boolean; swatch?: string; className?: string }) {
  return (
    <span className={`${s.chip} ${className}`.trim()} data-selected={selected || undefined}>
      {swatch ? <span className={s.swatch} style={{ background: swatch }} /> : null}
      {children}
    </span>
  );
}

export function KitTag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`${s.tag} ${className}`.trim()}>{children}</span>;
}

export function KitStatus({ children, tone = "success", className = "" }: { children: ReactNode; tone?: "success" | "neutral" | "danger"; className?: string }) {
  return (
    <span className={`${s.status} ${className}`.trim()} data-tone={tone}>
      {children}
    </span>
  );
}

export function KitAvatar({ src, size, className = "" }: { src: string; size?: number; className?: string }) {
  return <img className={`${s.avatar} ${className}`.trim()} src={src} alt="" width={size ?? 36} height={size ?? 36} style={size ? { width: size, height: size } : undefined} loading="lazy" decoding="async" />;
}

export function KitUserRow({ avatar, name, email, role }: { avatar: string; name: string; email: string; role: string }) {
  return (
    <span className={s.userRow}>
      <KitAvatar src={avatar} />
      <span className={s.who}>
        <span className={s.name}>{name}</span>
        <span className={s.email}>{email}</span>
      </span>
      <KitTag>{role}</KitTag>
    </span>
  );
}

/* markup layer */
export function MarkupBadge({ kind, size = "sm", className = "" }: { kind: "pass" | "fail"; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span className={`${s.badge} ${className}`.trim()} data-kind={kind} data-size={size}>
      <Icon name={kind === "pass" ? "Check" : "Xmark"} size={size === "lg" ? "lg" : size === "md" ? "md" : "sm"} />
    </span>
  );
}

/** a dashed ring 4px outside the part it marks; the parent is position: relative */
export function MarkupRing() {
  return <span className={s.ring} aria-hidden="true" />;
}

/** an annotation pill: red (a problem) or neutral (a named part) */
export function MarkupNote({ children, tone = "red", dot = false, className = "" }: { children: ReactNode; tone?: "red" | "neutral"; dot?: boolean; className?: string }) {
  return (
    <span className={`${s.note} ${className}`.trim()} data-tone={tone === "neutral" ? "neutral" : undefined}>
      {dot ? <span className={s.noteDot} /> : null}
      {children}
    </span>
  );
}

export const kitLeader = s.leader;
