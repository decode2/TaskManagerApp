import { ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";

interface Props {
  children: ReactNode;
}

export default function CenteredFormLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <ThemeToggle />
      {children}
    </div>
  );
}
