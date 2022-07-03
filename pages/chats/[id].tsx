import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useRouter } from "next/router";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import useMutation from "@libs/client/useMutation";
import { Chat, Product, User } from "@prisma/client";
import Image from "next/image";
import { cfimg } from "@libs/client/utils";
import Link from "next/link";

interface IProductInChat {
  id: number;
  name: string;
  imageUrl: string;
}
interface IUserInChat {
  id: number;
  name: string;
  avatar?: string;
}
interface IChatWithMsg extends Chat {
  message: string;
  id: number;
  user: IUserInChat;
}
interface IChatWithMsgs {
  sellerId: number;
  buyerId: number;
  productId: number;
  buyer: User;
  seller: User;
  product: Product;
  status: string;
  chatMessages: IChatWithMsg[];
}
interface IChatResponse {
  ok: boolean;
  chat: IChatWithMsgs;
}
interface IMsgForm {
  message: string;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<IMsgForm>();
  const { data, mutate } = useSWR<IChatResponse>(
    router.query.id ? `/api/chat/${router.query.id}` : null,
    {
      refreshInterval: 1000,
    }
  );
  // 대화 상대 찾기 필요
  const isSeller = data?.chat.buyerId === user?.id ? true : false;
  const chatTitle = isSeller ? data?.chat.seller.name : data?.chat.buyer.name;
  // console.log(data);
  const [sendMessage, { loading, data: msgData }] = useMutation(
    `/api/chat/${router.query.id}/messages`
  );
  const onValid = (form: IMsgForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          chat: {
            ...prev.chat,
            chatMessages: [
              ...prev.chat.chatMessages,
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
  const [reserve, { loading: reserveLoading, data: reserveData }] = useMutation(
    `/api/chat/${router.query.id}/reserve`
  );
  const onReserve = () => {
    if (reserveLoading) return;
    reserve({});
    // if (reserveData && reserveData.ok) {
    //   console.log(reserveData);
    // }
  };
  return (
    <Layout canGoBack title={`${chatTitle}`}>
      <div className="flex items-center justify-between p-4 w-full my-4 bg-gray-200 rounded-md">
        <Link href={`/products/${data?.chat.product.id}`}>
          <a className="block flex space-x-2 items-center">
            <Image
              src={cfimg(data?.chat.product.imageUrl, "avatar")}
              width={48}
              height={48}
              alt="상품이미지"
            />
            <span className="inline-block ml-4">
              <span className="text-orange-400">
                [{data?.chat.status === "reserved" ? "예약 중" : "거래 중"}]
              </span>{" "}
              {data?.chat.product.name}
            </span>
          </a>
        </Link>
        {isSeller && (
          <span>
            <button
              onClick={onReserve}
              className="ml-4 p-2 bg-orange-400 text-white rounded-md"
            >
              {data?.chat.status === "reserved" ? "예약 취소" : "거래 예약"}
            </button>
            <button className="ml-4 p-2 bg-orange-400 text-white rounded-md">
              거래 완료
            </button>
          </span>
        )}
      </div>
      <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
        {data?.chat?.chatMessages?.map((message) => (
          <Message
            key={message.id}
            message={message.message}
            avatarUrl={message.user.avatar}
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
    </Layout>
  );
};

export default ChatDetail;
