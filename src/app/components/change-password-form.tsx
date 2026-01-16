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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function ChangePasswordForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    await authClient.changePassword(
      {
        newPassword: newPassword, // required
        currentPassword: currentPassword, // required
        revokeOtherSessions: true,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to change password");
        },
        onSuccess: () => {
          toast.success("successfully changed the password", {
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
        <CardTitle className="text-center">Change Your Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="currentPassword">
                Current Password
              </FieldLabel>
              <Input
                id="currentPassword"
                type="password"
                name="currentPassword"
                required
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <Input
                id="newPassword"
                type="password"
                name="newPassword"
                required
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm New Password
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
            <Field className="mt-6">
              <Button type="submit">Reset Password</Button>
              <FieldDescription className="px-6 text-center"></FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
