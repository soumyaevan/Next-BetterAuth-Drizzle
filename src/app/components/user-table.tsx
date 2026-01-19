"use client";
import { UserResponse } from "@/types/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import LoaderElement from "./LoaderElement";

const UserTable = () => {
  const queryClient = useQueryClient();
  const { data, isPending, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }

      const result = await response.json();
      return result.users as UserResponse[];
    },
  });

  if (isPending) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Loading users...</p>
          <LoaderElement />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    toast.error(error.message);
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-center text-red-600">Error: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No users found</p>
        </CardContent>
      </Card>
    );
  }

  const banUser = async ({ userId }: { userId: string }) => {
    await authClient.admin.banUser(
      {
        userId: userId, // required
        banReason: "Spamming",
        banExpiresIn: 60 * 60 * 24 * 7,
      },
      {
        onSuccess: () => {
          toast.success("User is banned");
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Banning is failed");
        },
      }
    );
  };

  const unBanUser = async ({ userId }: { userId: string }) => {
    await authClient.admin.unbanUser(
      {
        userId: userId, // required
      },
      {
        onSuccess: () => {
          toast.success("User is un-banned");
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Banning is failed");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>Total users: {data.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold">Verified</th>
                <th className="text-left py-3 px-4 font-semibold">Created</th>
                <th className="text-left py-3 px-4 font-semibold">Banned</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Ban Reason
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Ban Expires
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  User Banning
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  User Deletion
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {user.emailVerified ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">✗</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {user.banned ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">✗</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {user.banReason ? user.banReason : ""}
                  </td>
                  <td className="py-3 px-4">
                    {user.banExpires
                      ? new Date(user.banExpires).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="py-3 px-4">
                    {user.role !== "admin" ? (
                      user.banned ? (
                        <Button
                          className="px-4 py-2 rounded text-sx font-semibold bg-green-200 text-red-600"
                          onClick={() => unBanUser({ userId: user.id })}
                        >
                          Unban
                        </Button>
                      ) : (
                        <Button
                          className="px-4 py-2 rounded text-sx font-semibold bg-amber-200 text-red-600"
                          onClick={() => banUser({ userId: user.id })}
                        >
                          Ban
                        </Button>
                      )
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {user.role !== "admin" ? (
                      <Button className="px-2 py-2 rounded text-sx font-semibold bg-red-200 text-red-600">
                        Delete
                      </Button>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTable;
