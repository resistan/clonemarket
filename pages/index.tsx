import tw from "tailwind-styled-components";
import { NextPage } from "next"
import Head from "next/head";

const Wrapper = tw.div`bg-slate-100 py-20 px-10 grid gap-10 min-h-screen`;
const Box = tw.div`bg-white p-6 rounded-2xl shadow-xl`;
const BoxTitle = tw.h4`font-semibold text-2xl`;

const Home: NextPage = () => {
  return (
    <Wrapper>
      <Head><title>Tailwind test</title></Head>
      <div className="flex flex-col space-y-2 p-5">
        <details className="select-none open:text-white open:bg-indigo-500">
          <summary className="cursor-pointer">What is my favorite food?</summary>
          <p className="selection:bg-indigo-500 selection:text-white">김치</p>
        </details>
        <ul className="list-disc marker:text-teal-500">
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
        </ul>
        <input type="file" className="file:border-0 file:rounded-md file:px-5 file:text-white file:bg-purple-500 file:cursor-pointer file:transition-colors file:hover:bg-black" />
        <p className="first-letter:text-5xl first-letter:uppercase">lorem ipsum</p>
      </div>
      <Box>
        <BoxTitle>Select Item</BoxTitle>
      </Box>
    </Wrapper>
  )
}

export default Home
