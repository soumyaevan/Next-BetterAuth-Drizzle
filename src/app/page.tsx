"use client";
import Image from "next/image";
import { SignupForm } from "./components/signup-form";
import Link from "next/link";
import { LoginForm } from "./components/login-form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const { data: session, isPending: loading } = authClient.useSession();
  const router = useRouter();
  useEffect(() => {
    if (!loading && session) {
      toast.info("You are already logged in");
      router.push("/post-list");
    }
  }, [loading, session, router]);
  if (loading) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 mt-10 flex flex-col justify-center items-center">
      <header className="px-2 mt-4 mb-10">
        <h1 className="text-3xl text-center">Your Blog</h1>
      </header>
      <main className="mt-10">
        <div>
          <p className="text-xl">
            Welcome to Your Blog - a modern platform where your stories come to
            life. Share your thoughts, connect with readers, and join a
            community of writers. Create your account to start publishing, or
            log in to continue your journey. Your voice matters here. Discover a
            space designed for authentic storytelling. Whether you are a
            seasoned writer or just beginning, Your Blog provides the tools to
            share your ideas with the world. Sign up today to publish your first
            post and connect with like-minded readers.
          </p>
        </div>
        <div className="mt-10">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
