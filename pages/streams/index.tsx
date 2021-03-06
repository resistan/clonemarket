import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import useSWR from "swr";
import { Stream } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PageNav from "@components/paginav";
import Image from "next/image";

interface IStreamListResponse {
  ok: boolean;
  streams: Stream[];
  maxPage: number;
}

const Live: NextPage = () => {
  const router = useRouter();
  const { page: callPage } = router.query;
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (callPage) setPage(callPage ? +callPage : 1);
  }, [callPage]);
  const { data, error } = useSWR<IStreamListResponse>(
    `/api/streams?page=${page}`
  );
  // console.log(data?.maxPage);
  return (
    <Layout hasTabBar title="라이브">
      <div className=" divide-y-[1px] space-y-4">
        {data?.streams ? (
          <>
            {data?.streams.map((stream) => (
              <Link key={stream.id} href={`/streams/${stream.id}`}>
                <a className="pt-4 block  px-4">
                  {/* <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" /> */}
                  <div className="relative h-[270px] object-cover">
                    <Image
                      // src={`https://videodelivery.net/${stream.cfId}/thumbnails/thumbnail.jpg`}
                      src={
                        "https://videodelivery.net/5d5bc37ffcf54c9b82e996823bffbb81/thumbnails/thumbnail.jpg"
                      }
                      alt="live thumbnail"
                      layout="fill"
                      className="w-full rounded-md shadow-sm bg-slate-300 aspect-video"
                    />
                  </div>
                  <h1 className="text-2xl mt-2 font-bold text-gray-900">
                    {stream.name}
                  </h1>
                </a>
              </Link>
            ))}
            <PageNav maxData={data?.maxPage} currentPage={page} />
          </>
        ) : (
          <p>{error ? error : "Loading..."}</p>
        )}
        <FloatingButton href="/streams/create">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>라이브 시작</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};;;;

export default Live;
