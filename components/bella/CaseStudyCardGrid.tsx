import { ReactNode } from "react";
import styles from "./CaseStudyCardGrid.module.css";

export interface CaseStudyCardGridProps {
  children: ReactNode;
  className?: string;
}

export default function CaseStudyCardGrid({
  children,
  className,
}: CaseStudyCardGridProps) {
  return (
    <div className={`${styles.grid}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
