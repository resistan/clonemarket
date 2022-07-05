import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";

interface IPost {
  title: string;
  date: string;
  category: string;
}

const Blog: NextPage<{ posts: IPost[] }> = ({ posts }) => {
  return (
    <Layout hasTabBar title="Blog">
      <h2 className="font-semibold text-lg text-center mt-5 mb-3">
        Latest Posts
      </h2>
      {posts.map((post, index) => (
        <div key={index}>
          <span className="text-lg text-orange-400">{post.title}</span>
          <div>
            <span>{post.date}</span>
            <span>{post.category}</span>
          </div>
        </div>
      ))}
    </Layout>
  );
};

export async function getStaticProps() {
  const files = readdirSync("./posts"); // not ../ or use root path
  // console.log(files);
  const blogPosts = files.map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    // console.log(matter(content));
    // const {data} = matter(content);
    return matter(content).data;
  });
  return {
    props: {
      posts: blogPosts,
    },
  };
}

export default Blog;
