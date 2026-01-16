"use client";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
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
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function ResetPasswordForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    // Validate Token
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      toast.error("The link is not valid anymore, try again!!!");
      router.push("/request-password-reset");
      return;
    }

    await authClient.resetPassword(
      {
        newPassword: password, // required
        token, // required
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to reset password");
        },
        onSuccess: () => {
          toast.success("successfully reset the password", {
            description: "Redirecting to login",
          });
          setTimeout(() => {
            router.push("/");
          }, 1000);
        },
      }
    );
  };
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Password Reset Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" name="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                name="confirm-password"
                required
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <Button type="submit">Reset Password</Button>
              <FieldDescription className="px-6 text-center">
                <Link href="/">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
