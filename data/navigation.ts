export interface NavigationItem {
  label: string;
  href: `#${string}` | "#";
}

export const navigationItems: NavigationItem[] = [
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Design Lab", href: "#design-lab" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];