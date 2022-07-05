import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";

interface IPost {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: IPost[] }> = ({ posts }) => {
  return (
    <Layout hasTabBar title="Blog">
      <h1 className="font-semibold text-lg text-center mt-5 mb-3">
        Latest Posts
      </h1>
      {posts.map((post, index) => (
        <div key={index}>
          <Link href={`/blog/${post.slug}`}>
            <a>
              <span className="text-lg text-orange-400">{post.title}</span>
              <div>
                <span>{post.date}</span>
                <span>{post.category}</span>
              </div>
            </a>
          </Link>
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
    const [slug, _] = file.split(".");
    console.log(slug);
    return { ...matter(content).data, slug };
  });
  return {
    props: {
      posts: blogPosts.reverse(),
    },
  };
}

export default Blog;
