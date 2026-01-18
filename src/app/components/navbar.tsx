"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
        },
      },
    });
  };
  return (
    <nav className="bg-gray-700 fixed z-50 w-full top-0">
      <div className="max-w-6xl px-2 py-3 flex flex-col md:flex-row justify-between items-center mx-auto w-full">
        <div>
          {session ? (
            <Link href="/post-list">Your Blog</Link>
          ) : (
            <Link href="/">Your Blog</Link>
          )}
        </div>
        <div>
          {session ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-3">
              <p>{session.user.name}</p>
              <Button variant="outline" type="button" onClick={handleSignOut}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/signup">Sign Up</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
