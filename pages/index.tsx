import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import useSWR, { SWRConfig } from "swr";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageNav from "@components/paginav";
import client from "@libs/server/prismaClient";

export interface IProductList extends Product {
  _count: {
    likes: number;
  };
}
interface IProductResponse {
  ok: boolean;
  products: IProductList[];
  maxPage: number;
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { page: callPage } = router.query;
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (callPage) setPage(callPage ? +callPage : 1);
  }, [callPage]);
  const { data } = useSWR<IProductResponse>(`/api/products?page=${page}`);
  // console.log(data);
  return (
    <Layout title="홈" hasTabBar>
      <div className="flex flex-col space-y-5 divide-y">
        {data ? (
          <>
            {data?.products?.map((product) => (
              <Item
                id={product.id}
                key={product.id}
                title={product.name}
                photo={product.imageUrl}
                price={product.price}
                comments={1}
                hearts={product._count.likes}
              />
            ))}
            <PageNav maxData={data?.maxPage} currentPage={page} />
          </>
        ) : (
          <p>Loading...</p>
        )}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <title>상품 등록하기</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};;

const Page: NextPage<{ products: IProductList[] }> = ({ products }) => {
  return (
    <SWRConfig
      // set initialized cache
      value={{
        fallback: {
          "/api/products": {
            ok: true,
            products,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  const products = await client.product.findMany({});
  // console.log(products);
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}

export default Page;
