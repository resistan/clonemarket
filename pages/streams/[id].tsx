import type { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import Message from "@components/message";

interface IStreamWithMsg {
  id: number;
  message: string;
  user: {
    id: number;
    avatar?: string;
  };
}
interface IStreamWithMsgs extends Stream {
  messages: IStreamWithMsg[];
}
interface IStreamResponse {
  ok: boolean;
  stream: IStreamWithMsgs;
}
interface IMsgForm {
  message: string;
}

const StreamDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<IMsgForm>();
  const { data, mutate } = useSWR<IStreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    {
      refreshInterval: 1000,
    }
  );
  const [sendMessage, { loading, data: msgData }] = useMutation(
    `/api/streams/${router.query.id}/messages`
  );
  const onValid = (form: IMsgForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              {
                id: Date.now(),
                message: form.message,
                user: {
                  ...user,
                },
              },
            ],
          },
        } as any),
      false // revalidation
    );
    sendMessage(form);
  };
  return (
    <Layout title="Streaming" canGoBack>
      {data?.stream ? (
        <div className="py-10 px-4  space-y-4">
          {data?.stream?.cfId ? (
            <iframe
              src={`https://iframe.videodelivery.net/${data?.stream?.cfId}`}
              className="border-0 w-full aspect-video"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={true}
            ></iframe>
          ) : (
            <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video flex items-center justify-center">
              <p>Video / Streaming not found.</p>
            </div>
          )}
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {data?.stream?.name}
            </h1>
            <span className="text-2xl block mt-3 text-gray-900">
              ${data?.stream?.price}
            </span>
            <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
            <div className="bg-orange-300 p-5 rounded-md flex flex-col space-y-3 overflow-scroll">
              <span>Stream Keys (secret)</span>
              <span>URL: {data?.stream?.cfUrl}</span>
              <span>Key: {data?.stream?.cfKey}</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
            <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
              {data?.stream?.messages?.map((message) => (
                <Message
                  key={message.id}
                  message={message.message}
                  reversed={message.user.id === user?.id ? true : false}
                />
              ))}
            </div>
            <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
              <form
                onSubmit={handleSubmit(onValid)}
                className="flex relative max-w-md items-center  w-full mx-auto"
              >
                <input
                  {...register("message", { required: true })}
                  type="text"
                  className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
                />
                <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                  <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                    &rarr;
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center my-20">Something error</p>
      )}
    </Layout>
  );
};

export default StreamDetail;
