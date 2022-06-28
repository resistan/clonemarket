import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useUser from "@libs/client/useUser";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Post } from "@prisma/client";
import useCoords from "@libs/client/useCoords";

interface IWriteForm {
  question: string;
}
interface IResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { latitude, longitude } = useCoords();
  const { register, handleSubmit } = useForm<IWriteForm>();
  const [post, { loading, data }] = useMutation<IResponse>("/api/posts");
  const onValid = (data: IWriteForm) => {
    if (loading) return;
    post({ ...data, latitude, longitude });
  };
  useEffect(() => {
    if (data && data.ok) router.push(`/community/${data.post.id}`);
  }, [data]);
  return (
    <Layout canGoBack title="Write Post">
      <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
        <TextArea
          register={register("question", { required: true, minLength: 10 })}
          required
          placeholder="Ask a question!"
        />
        <Button text={loading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
