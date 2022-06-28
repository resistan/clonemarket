import { IProductList } from "pages";
import useSWR from "swr";
import Item from "./item";

interface IProductListProps {
  kind: "likes" | "sales" | "purchases";
}
interface Record {
  id: number;
  product: IProductList;
}
interface IProductListResponse {
  [key: string]: Record[];
}

export default function ProductList({ kind }: IProductListProps) {
  const { data } = useSWR<IProductListResponse>(`/api/users/me/${kind}`);
  return data ? (
    <>
      {data[kind]?.map((record) => (
        <Item
          id={record.product.id}
          key={record.id}
          title={record.product.name}
          price={record.product.price}
          comments={1}
          hearts={record.product._count.likes}
        />
      ))}
    </>
  ) : null;
}
