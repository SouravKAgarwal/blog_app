import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import NavbarUser from "./NavbarUser";
import NavbarUserSkeleton from "./NavbarUserSkeleton";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md px-6 py-4 transition-all duration-300">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-1 group">
          <div className="relative overflow-hidden rounded-full border border-primary/20 bg-secondary/50 p-1 group-hover:border-primary/50 transition-colors">
            <Image
              src="/logo.png"
              alt="Blogify Logo"
              width={28}
              height={28}
              className="object-contain group-hover:rotate-12 transition-transform duration-500"
              loading="eager"
              preload
              fetchPriority="high"
            />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Blogify.
          </span>
        </Link>

        <Suspense fallback={<NavbarUserSkeleton />}>
          <NavbarUser />
        </Suspense>
      </nav>
    </header>
  );
};

export default Navbar;
