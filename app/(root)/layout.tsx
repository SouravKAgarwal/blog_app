import Navbar from "../../components/Navbar";
import { Suspense } from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-work-sans">
      <Suspense
        fallback={
          <div className="h-16 bg-white/50 backdrop-blur-md border-b border-white/20" />
        }
      >
        <Navbar />
      </Suspense>
      {children}
    </main>
  );
}
