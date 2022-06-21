import tw from "tailwind-styled-components";
import { NextPage } from "next"
import Head from "next/head";

const Wrapper = tw.div`bg-slate-400 py-20 px-10 grid gap-10 min-h-screen`;
const Box = tw.div`bg-white p-6 rounded-2xl shadow-xl`;
const BoxTitle = tw.h4`font-semibold text-2xl`;
const Pricing = tw.li`flex justify-between mb-2`;
const Item = tw.span`text-gray-500`;
const Price = tw.span`font-semibold`;
const Checkout = tw.button`block mt-5 w-2/4 mx-auto bg-blue-500 text-white p-3 text-center rounded-xl`;
const ProfileTop =tw.div`bg-blue-500 text-white p-6 pb-14`;
const ProfilePhoto = tw.div`rounded-full w-24 h-24 bg-gray-200`;
const ProfileBottom = tw.div`rounded-3xl p-6 relative -top-5 bg-white`;
const ProfileInfo = tw.div`relative -top-16 flex justify-between items-end`;
const ProfilePrice = tw.div`flex flex-col items-center text-sm`;
const ProfileUser = tw.div`realtive flex flex-col items-center -top-16 -mt-10 -mb-5`;

const Home: NextPage = () => {
  return (
    <Wrapper className="md:grid-cols-2 lg:grid-cols-3 lg:place-content-center">
      <Head><title>Tailwind test</title></Head>
      <Box className="sm:bg-red-100 md:bg-blue-100">
        <BoxTitle>Select Item</BoxTitle>
        <ul>
          <Pricing>
            <Item>Gray Chair</Item>
            <Price>$19</Price>
          </Pricing>
          <Pricing>
            <Item>Gray Chair</Item>
            <Price>$19</Price>
          </Pricing>
          <Pricing className="mt-2 mb-0 pt-2 border-t-2 border-dashed">
            <Item>Total</Item>
            <Price>$29</Price>
          </Pricing>
        </ul>
        <Checkout className="hover:bg-gray-200 hover:text-black active:bg-yellow-500 focus:bg-red-500">Checkout</Checkout>
      </Box>
      <Box className="p-0 overflow-hidden rounded-3xl group">
        <ProfileTop>
          <BoxTitle>Profile</BoxTitle>
        </ProfileTop>
        <ProfileBottom>
          <ProfileInfo>
            <ProfilePrice>
              <Item>Orders</Item>
              <Price>340</Price>
            </ProfilePrice>
            <ProfilePhoto className="group-hover:bg-red-300 transition-colors" />
            <ProfilePrice>
              <Item>Spent</Item>
              <Price>$2310</Price>
            </ProfilePrice>
          </ProfileInfo>
          <ProfileUser>
            <span className="font-medium text-lg">Tony Molloy</span>
            <span className="text-sm text-gray-500">New York, USA</span>
          </ProfileUser>
        </ProfileBottom>
      </Box>
      <Box className="md:col-span-2 lg:col-span-1">
        <div className="flex justify-between items-center mb-5">
          <span>←</span>
          <div className="space-x-3">
            <span>★ 4.9</span>
            <span className="shadow-xl p-2 rounded-md">♡</span>
          </div>
        </div>
        <div className="bg-zinc-400 h-72 mb-5" />
        <div className="flex flex-col">
          <span className="font-medium text-xl">Swoon lounge</span>
          <span className="text-xs text-gray-500">Chair</span>
          <div className="mt-3 mb-5 flex justify-between items-center">
            <div className="space-x-2">
              <input type="radio" className="w-5 h-5 rounded-full bg-yellow-500 ring-2 ring-offset-2" />
              <input type="radio" />
              <input type="radio" />
              <button className="w-5 h-5 rounded-full bg-yellow-500 focus:ring-2 ring-offset-2 focus:ring-yellow-500 ring-opacity-10 transition"></button>
              <button className="w-5 h-5 rounded-full bg-indigo-500"></button>
              <button className="w-5 h-5 rounded-full bg-teal-500"></button>
            </div>
            <div className="flex items-center space-x-5">
              <button className="p-1.5 rounded-lg bg-blue-200 flex justify-center items-center aspect-square w-8 font-medium text-xl text-gray-500">-</button>
              <span>1</span>
              <button className="p-1.5 rounded-lg bg-blue-200 flex justify-center items-center aspect-square w-8 font-medium text-xl text-gray-500">+</button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-2xl">$450</span>
            <button className="bg-blue-500 text-center text-white rounded-xl px-8 py-2 text-xs">Add to Cart</button>
          </div>
        </div>
      </Box>
    </Wrapper>
  )
}

export default Home
