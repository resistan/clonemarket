import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import useMutation from "@libs/client/useMutation";
import { Answer, Post, User } from "@prisma/client";
import Link from "next/link";
import { cls } from "@libs/client/utils";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import client from "@libs/server/prismaClient";

interface IAnswerWithUser extends Answer {
  user: User;
}
interface IPostWithUser extends Post {
  user: User;
  _count: {
    answers: number;
    wonderings: number;
  };
  answers: IAnswerWithUser[];
  isWonder: boolean;
}
interface IPostResponse {
  ok: boolean;
  post: IPostWithUser;
  isWonder: boolean;
}
interface IAnswerForm {
  answer?: string;
}
interface IAnswerResponse {
  ok: boolean;
  answer: Answer;
}

const CommunityPostDetail: NextPage<IPostResponse> = ({ post }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<IPostResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );
  if (data && !data?.ok) {
    // console.log(404);
    router.replace("/404");
  }
  const [toggleWonder, { loading }] = useMutation(
    `/api/posts/${router.query.id}/wonder`
  );
  const onWonderClick = () => {
    if (!data) return;
    mutate(
      {
        ...data,
        post: {
          ...data?.post,
          _count: {
            ...data?.post._count,
            wonderings: data.isWonder
              ? data?.post._count.wonderings - 1
              : data?.post._count.wonderings + 1,
          },
        },
        isWonder: !data.isWonder,
      },
      false
    );
    if (!loading) toggleWonder({});
  };
  const { register, handleSubmit, reset } = useForm();
  const [sendAnswer, { loading: answerLoading, data: answerData }] =
    useMutation<IAnswerResponse>(`/api/posts/${router.query.id}/answers`);
  const onValid = (form: IAnswerForm) => {
    if (answerLoading) return;
    sendAnswer(form);
  };
  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      mutate();
    }
  }, [answerData, reset, mutate]);
  // console.log(data);
  if (router.isFallback) {
    return (
      <Layout canGoBack title="질문 불러오는 중">
        <h1>Loading...</h1>
      </Layout>
    );
  }
  return (
    <Layout canGoBack title="동네질문">
      {data?.post ? (
        <div>
          <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            동네질문
          </span>
          <div className="flex mb-3 px-4 cursor-pointer pb-3  border-b items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {data?.post?.user?.name}
              </p>
              <p className="text-xs font-medium text-gray-500">
                <Link href={`/profile/${data?.post.userId}`}>
                  <a>View profile &rarr;</a>
                </Link>
              </p>
            </div>
          </div>
          <div>
            <div className="mt-2 px-4 text-gray-700">
              <span className="text-orange-500 font-medium">Q.</span>
              {data?.post.question}
            </div>
            <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
              <button
                onClick={onWonderClick}
                className={cls(
                  "flex space-x-2 items-center text-sm",
                  data?.isWonder ? "text-teal-600" : ""
                )}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>궁금해요 {data?.post?._count?.wonderings}</span>
              </button>
              <span className="flex space-x-2 items-center text-sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
                <span>답변 {data?.post?._count?.answers}</span>
              </span>
            </div>
          </div>
          <div className="px-4 my-5 space-y-5">
            {data?.post.answers.map((answer) => (
              <div key={answer.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full" />
                <div>
                  <span className="text-sm block font-medium text-gray-700">
                    {answer.user.name}
                  </span>
                  <span className="text-xs text-gray-500 block ">
                    {answer.createdAt}
                  </span>
                  <p className="text-gray-700 mt-2">{answer.answer}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit(onValid)} className="px-4">
            <TextArea
              register={register("answer", { required: true, minLength: 5 })}
              name="answer"
              placeholder="Answer this question!"
              required
            />
            <button className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none ">
              {answerLoading ? "Loading..." : "Reply"}
            </button>
          </form>
        </div>
      ) : null}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};
export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }
  const post = await client.post.findUnique({
    where: { id: +ctx.params.id.toString() },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      answers: {
        take: 10,
        skip: 0,
        select: {
          answer: true,
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      _count: {
        select: {
          answers: true,
          wonderings: true,
        },
      },
    },
  });
  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
    // revalidate: 20, // seconds -> API revalidate
  };
};

export default CommunityPostDetail;
