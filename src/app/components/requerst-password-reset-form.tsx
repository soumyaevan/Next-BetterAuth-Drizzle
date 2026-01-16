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
export function RequestPasswordResetForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    await authClient.requestPasswordReset(
      {
        email: email,
        redirectTo: "/reset-password",
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to reset password");
          router.push("/");
        },
        onSuccess: () => {
          toast.success("Reset password link is sent to the registered email", {
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
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else. Make sure this email is the same you
                registered with
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Reset Password</Button>
                <FieldDescription className="px-6 text-center">
                  <Link href="/">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
