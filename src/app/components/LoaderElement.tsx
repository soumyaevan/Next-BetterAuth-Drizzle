import { Spinner } from "./ui/spinner";

export default function LoaderElement() {
  return (
    <div className="max-w-6xl mx-auto text-center mt-40">
      <div className="flex items-center gap-6">
        <Spinner className="size-6 text-red-500" />
        <Spinner className="size-6 text-green-500" />
        <Spinner className="size-6 text-blue-500" />
        <Spinner className="size-6 text-yellow-500" />
        <Spinner className="size-6 text-purple-500" />
      </div>
    </div>
  );
}
