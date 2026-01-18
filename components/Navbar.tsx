import { auth, signIn, signOut } from "@/auth";
import { BadgePlus, LogOut, Pen, PenTool } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md px-6 py-4 transition-all duration-300">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-1 group">
          <div className="relative overflow-hidden rounded-full border border-primary/20 bg-secondary/50 p-1 group-hover:border-primary/50 transition-colors">
            <Image
              src="/logo.png"
              alt="logo"
              width={28}
              height={28}
              className="object-contain group-hover:rotate-12 transition-transform duration-500"
            />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Blogify.
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          {session && session?.user ? (
            <>
              <Link href="/blog/create">
                <Button
                  variant="default"
                  className="hidden sm:flex items-center gap-2 rounded-full font-bold bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-all shadow-sm px-5 h-10"
                >
                  <Pen className="size-4" />
                  <span>Write</span>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="sm:hidden text-foreground hover:bg-secondary rounded-full"
                >
                  <BadgePlus className="size-6" />
                </Button>
              </Link>

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
                >
                  <LogOut className="size-5" />
                </Button>
              </form>

              <Link href={`/user/${session?.id}`}>
                <Avatar className="size-10 border border-border hover:ring-2 hover:ring-primary/50 transition-all shadow-sm cursor-pointer">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">
                    {session?.user?.name?.slice(0, 2).toUpperCase() || "CN"}
                  </AvatarFallback>
                </Avatar>
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
      </nav>
    </header>
  );
};

export default Navbar;
