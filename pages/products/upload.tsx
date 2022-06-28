import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { Product } from "@prisma/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface IUploadForm {
  name: string;
  price: number;
  description: string;
}
interface IProductMutation {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const { register, handleSubmit } = useForm<IUploadForm>();
  const [ uploadProduct, {loading, data} ] = useMutation<IProductMutation>("/api/products");
  const router = useRouter();
  const onValid = (data:IUploadForm) => {
    if(loading) return;
    uploadProduct(data);
  }
  useEffect(() => {
    if(data?.ok) {
      router.push(`/products/${data?.product.id}`)
    }
  }, [data])

  return (
    <Layout canGoBack title="Upload Product">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div>
          <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <title>사진 등록</title>
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input className="hidden" type="file" />
          </label>
        </div>
        <Input register={register("name", { required: true })} required label="Name" name="name" type="text" />
        <Input
          register={register("price", { required: true })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea register={register("description", { required: true })} name="description" label="Description" />
        <Button text={loading? "Loading" : "Upload item"} />
      </form>
    </Layout>
  );
};

export default Upload;