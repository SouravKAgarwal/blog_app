import { Button } from "./ui/button";
import { auth, signIn, signOut } from "@/auth";
import { BadgePlus, LogOut, Pen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NavbarUser = async () => {
  const session = await auth();

  return (
    <div className="flex items-center gap-1.5">
      {session && session?.user ? (
        <>
          <Button
            asChild
            variant="default"
            className="hidden sm:flex items-center gap-2 rounded-full font-bold bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-all shadow-sm px-5 h-10"
          >
            <Link href="/blog/create">
              <Pen className="size-4" />
              <span>Write</span>
            </Link>
          </Button>
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="sm:hidden text-foreground hover:bg-secondary rounded-full"
            aria-label="Write a new blog post"
          >
            <Link href="/blog/create">
              <BadgePlus className="size-6" />
            </Link>
          </Button>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button
              variant="ghost"
              type="submit"
              className="hidden sm:flex text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-medium transition-colors"
            >
              Logout
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="sm:hidden text-muted-foreground hover:text-destructive"
              aria-label="Log out"
            >
              <LogOut className="size-5" />
            </Button>
          </form>

          <Link href={`/user/${session?.id}`}>
            <div className="size-10 overflow-hidden rounded-full border border-border hover:ring-2 hover:ring-primary/50 transition-all shadow-sm cursor-pointer relative bg-secondary flex items-center justify-center">
              {session?.user?.image ? (
                <Image
                  src={session?.user?.image}
                  alt={session?.user?.name || "User Avatar"}
                  fill
                  className="object-cover"
                  loading="eager"
                  preload
                  fetchPriority="high"
                />
              ) : (
                <span className="text-secondary-foreground font-bold">
                  {session?.user?.name?.slice(0, 2).toUpperCase() || "CN"}
                </span>
              )}
            </div>
          </Link>
        </>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <Button
            type="submit"
            className="font-bold rounded-full bg-primary text-primary-foreground hover:bg-foreground hover:text-background px-6 h-10 shadow-sm transition-all"
          >
            Login
          </Button>
        </form>
      )}
    </div>
  );
};

export default NavbarUser;
