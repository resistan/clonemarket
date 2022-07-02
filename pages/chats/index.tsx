import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import useSWR from "swr";
import { Chat } from "@prisma/client";
import Image from "next/image";
import { cfimg } from "@libs/client/utils";

interface IChatProps extends Chat {
  id: number;
  buyer: {
    name: string;
    avatar: string;
  };
  seller: {
    name: string;
    avatar: string;
  };
}
interface IChatListProps {
  ok: boolean;
  chats: IChatProps[];
}

const Chats: NextPage = () => {
  const { user } = useUser();
  const { data } = useSWR<IChatListProps>("/api/chat");
  console.log(data);
  return (
    <Layout hasTabBar title="채팅">
      <div className="divide-y-[1px] ">
        {data?.chats.map((chat) => (
          <Link href={`/chats/${chat.id}`} key={chat.id}>
            <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
              {user?.id === chat.sellerId ? (
                chat.buyer.avatar ? (
                  <Image
                    src={cfimg(chat.buyer.avatar, "avatar")}
                    alt=""
                    width={48}
                    height={38}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-300" />
                )
              ) : chat.seller.avatar ? (
                <Image
                  src={cfimg(chat.seller.avatar, "avatar")}
                  alt=""
                  width={48}
                  height={38}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-300" />
              )}
              <div>
                <p className="text-gray-700">
                  {user?.id === chat.sellerId
                    ? chat.buyer.name
                    : chat.seller.name}
                </p>
                <p className="text-sm  text-gray-500">
                  See you tomorrow in the corner at 2pm!
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
