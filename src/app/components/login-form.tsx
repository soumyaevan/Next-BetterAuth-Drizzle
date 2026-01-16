"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: (ctx) => {
          toast.success("Login is successful");
          setIsLoading(false);
          const userRole = ctx.data?.user?.role;
          console.log(userRole);

          if (userRole && userRole === "admin") {
            router.push("/admin-dashboard");
          } else {
            router.push("/post-list");
          }
        },
        onError: (ctx) => {
          if (ctx.error.code === "BANNED_USER") {
            toast.error(
              "This user is banned, Please contact the Administrator"
            );
            setIsLoading(false);
            router.push("/");
          } else if (ctx.error.status === 403) {
            toast.error("Please verify your email address");
            setIsLoading(false);
            router.push("/");
          } else {
            toast.error(ctx.error.message || "Login is failed");
            setIsLoading(false);
            router.push("/");
          }
        },
      }
    );
  };
  const handleSocialLogin = async () =>
    await authClient.signIn.social(
      {
        provider: "google", // or any other provider id
        callbackURL: "/auth/callback",
      },
      {
        onSuccess: () => {
          toast.success("Login is successful");
          setIsLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Login is failed");
          setIsLoading(false);
        },
      }
    );
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/request-password-reset"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </Field>
              <Field aria-disabled={isLoading}>
                <Button type="submit">
                  {" "}
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleSocialLogin}
                >
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
