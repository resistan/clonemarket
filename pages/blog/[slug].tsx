import Layout from "@components/layout";
import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse/lib";
import { unified } from "unified";

interface IPostData {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Post: NextPage<{ data: IPostData; post: string }> = ({ data, post }) => {
  console.log(post);

  return (
    <Layout canGoBack title={data.title}>
      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: post }}
      ></div>
    </Layout>
  );
};

export function getStaticPaths() {
  const files = readdirSync("./posts").map((file) => {
    const [name, extention] = file.split(".");
    return { params: { slug: name } };
  });
  return {
    paths: files,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  console.log(ctx.params);
  const { data, content } = matter.read(`./posts/${ctx.params?.slug}.md`);
  // console.log(data, content);
  const { value } = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);
  return {
    props: {
      data: data,
      post: value,
    },
  };
};

export default Post;
