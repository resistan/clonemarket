import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { mutate, useSWRConfig } from "swr";
import Link from "next/link";
import { Chat, Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cfimg, cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import client from "@libs/server/prismaClient";

interface IProductWithUser extends Product {
  user: User;
}
interface IDetailResponse {
  ok: boolean;
  product: IProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

interface ICreatedResponse {
  ok: boolean;
  chat: Chat[];
}

const ItemDetail: NextPage<IDetailResponse> = ({
  product,
  relatedProducts,
  isLiked,
}) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<IDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleLike] = useMutation(`/api/products/${router.query.id}/like`);
  const onLikeClick = () => {
    toggleLike({});
    if (!data) return;
    boundMutate({ ...data, isLiked: !data.isLiked }, false); // mutate( value, revalidation )
    // mutate("/api/users/me", (prev:any) => ({ ok: !prev.ok }), false); // mutate(key, value, revalidation)
    // mutate(key) -- refetch
  };
  const [createChat, { data: chatData, loading }] =
    useMutation<ICreatedResponse>("/api/chat/");
  const onOpenChat = () => {
    createChat({ product: data?.product });
    if (loading) return;
    // console.log(chatData);
    if (chatData && chatData.ok) {
      router.push(`/chats/${chatData?.chat[0].id}`);
    }
  };
  if (router.isFallback) {
    return (
      <Layout title="Loading Product information...">
        <span>Loading page...</span>
      </Layout>
    );
  }
  return (
    <Layout canGoBack title="상품 정보">
      <div className="px-4  py-4">
        <div className="mb-8">
          {data?.product?.imageUrl ? (
            <div className="relative pb-[80%]">
              <Image
                src={cfimg(product?.imageUrl)}
                alt={data.product.name}
                layout="fill"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-96 bg-slate-300" />
          )}
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            {product?.user?.avatar ? (
              <Image
                src={cfimg(product?.user?.avatar, "avatar")}
                alt=""
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-300" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {product?.user?.name}
              </p>
              <p className="text-xs font-medium text-gray-500">
                <Link href={`/users/profile/${product?.user?.id}`}>
                  <a>View profile &rarr;</a>
                </Link>
              </p>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <span className="text-2xl block mt-3 text-gray-900">
              ${product?.price}
              {product.status === 1 && (
                <span className="inline-block bg-orange-400 text-white text-sm p-1 ml-2 rounded-md">
                  예약 중
                </span>
              )}
            </span>
            <p className=" my-6 text-gray-700">{product?.description}</p>
            <div className="flex items-center justify-between space-x-2">
              {product?.user?.id !== user?.id ? (
                <>
                  <Button
                    onClick={onOpenChat}
                    large
                    loading={loading}
                    text="Talk to seller"
                  />
                  <button
                    onClick={onLikeClick}
                    className={cls(
                      "p-3 rounded-md flex items-center justify-center",
                      isLiked
                        ? "text-red-400 hover:bg-red-100 hover:text-red-500"
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    )}
                  >
                    {isLiked ? (
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <title>관심 목록에서 삭제</title>
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <title>관심 목록에 추가</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          {relatedProducts.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900">
                Similar items
              </h2>
              <div className=" mt-6 grid grid-cols-2 gap-4">
                {data?.relatedProducts?.map((product) => (
                  <div key={product.id}>
                    <Link href={`/products/${product.id}`}>
                      <a>
                        <div className="h-56 w-full mb-4 bg-slate-300" />
                        <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                        <span className="text-sm font-medium text-gray-900">
                          ${product.price}
                        </span>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};
/* fallback
false: do not generate -> 404
true: genarate page with something
"blocking": user waits - can't see anything before complete
*/

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }

  const product = await client.product.findUnique({
    where: { id: +ctx.params.id.toString() },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  // console.log(product)
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  // console.log(terms)
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isLiked = false;
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isLiked,
    },
  };
};

export default ItemDetail;
