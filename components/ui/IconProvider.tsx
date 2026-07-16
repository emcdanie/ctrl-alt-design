"use client";

import { IconoirProvider } from "iconoir-react";

/* BELLA defaults for any Iconoir glyph that might bypass the <Icon>
 * wrapper: currentColor + the token stroke. The wrapper remains the
 * sanctioned path. */
export default function IconProvider({ children }: { children: React.ReactNode }) {
  return (
    <IconoirProvider
      iconProps={{
        color: "currentColor",
        strokeWidth: 1.5,
      }}
    >
      {children}
    </IconoirProvider>
  );
}
