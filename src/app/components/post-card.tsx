import { PostRequest } from "@/types/users";

const PostCard = ({ post }: { post: PostRequest }) => {
  return (
    <div className="bg-blue-200 flex flex-col my-5 px-6 py-5 gap-4 w-[600px] rounded">
      <div className="">
        <h3 className="font-bold text-2xl text-blue-600">{post.title}</h3>
      </div>
      <div className="bg-blue-300 p-2 border border-blue-700 w-full rounded shadow-md">
        <p className="px-2 py-1 text-blue-500">{post.content}</p>
      </div>
    </div>
  );
};

export default PostCard;
