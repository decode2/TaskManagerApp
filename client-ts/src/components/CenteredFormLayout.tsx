import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function CenteredFormLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300 px-4">
      {children}
    </div>
  );
}
