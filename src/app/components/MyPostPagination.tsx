import Link from "next/link";

const MyPostPagination = ({
  page,
  pageSize,
  totalItems,
}: {
  page: number;
  pageSize: number;
  totalItems: number;
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  return (
    <section className="container m-auto flex justify-center items-center">
      {page > 1 ? (
        <Link
          href={`/my-post?page=${page - 1}&pageSize=${pageSize}`}
          className="py-1 px-4 text-sm border rounded mr-2"
        >
          Prev
        </Link>
      ) : null}

      <span className="text-sm mx-2">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={`/my-post?page=${page + 1}&pageSize=${pageSize}`}
          className="py-1 px-4 text-sm border rounded ml-2"
        >
          Next
        </Link>
      ) : null}
    </section>
  );
};

export default MyPostPagination;
