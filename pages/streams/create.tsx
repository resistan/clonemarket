import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";

interface ILiveCreate {
  name: string;
  price: string;
  desciption: string;
}
interface ICreatedResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ILiveCreate>();
  const [createStream, { data, loading }] =
    useMutation<ICreatedResponse>(`/api/streams/`);
  const onValid = (form: ILiveCreate) => {
    if (loading) return;
    createStream(form);
  };
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Go Live">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true, valueAsNumber: true })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
        />
        <Button loading={loading} text="Go live" />
      </form>
    </Layout>
  );
};

export default Create;
