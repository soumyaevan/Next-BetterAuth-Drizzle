import Link from "next/link";

const ProfileSection = ({ name, email }: { name: string; email: string }) => {
  return (
    <aside className="sticky top-12 md:h-[calc(100vh)] bg-gray-800 border-r border-gray-700 p-4 rounded-md">
      <div className="pt-15 py-4 flex flex-col justify-center gap-4">
        <div className="flex justify-start gap-5 items-center">
          <p>Name:</p>
          <p>{name}</p>
        </div>
        <div className="flex justify-start gap-5 items-center">
          <p>Email:</p>
          <p>{email}</p>
        </div>
        <div className="w-full mt-5 text-center">
          <Link
            href="/change-password"
            className="bg-gray-300 text-black px-3 py-2 rounded"
          >
            Change Password
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSection;
