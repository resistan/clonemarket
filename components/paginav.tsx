import Link from "next/link";

interface IPageNavProps {
  maxData: number;
  currentPage: number;
}

export default function PageNav({ maxData, currentPage }: IPageNavProps) {
  return (
    <div className="flex items-center justify-center py-4 space-x-4">
      {currentPage > 5 && (
        <Link href={`?page=1`}>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <title>First page</title>
              <path
                fillRule="evenodd"
                d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </Link>
      )}
      {currentPage > 3 && (
        <Link href={`?page=${currentPage - 3}`}>
          <a>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Previous Pages</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </a>
        </Link>
      )}
      {currentPage > 2 && (
        <Link href={`?page=${currentPage - 2}`}>
          <a>{currentPage - 2}</a>
        </Link>
      )}
      {currentPage > 1 && (
        <Link href={`?page=${currentPage - 1}`}>
          <a>{currentPage - 1}</a>
        </Link>
      )}
      <span className="text-gray-400">{currentPage}</span>
      {currentPage < maxData - 3 && (
        <Link href={`?page=${currentPage + 1}`}>
          <a>{currentPage + 1}</a>
        </Link>
      )}
      {currentPage < maxData - 2 && (
        <Link href={`?page=${currentPage + 2}`}>
          <a>{currentPage + 2}</a>
        </Link>
      )}
      {currentPage < maxData - 1 && (
        <Link href={`?page=${currentPage + 3}`}>
          <a>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Next pages</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </a>
        </Link>
      )}
      {currentPage < maxData && (
        <Link href={`?page=${maxData}`}>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <title>Last page</title>
              <path
                fillRule="evenodd"
                d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </Link>
      )}
    </div>
  );
}
