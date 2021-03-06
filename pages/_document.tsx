import Document, { Head, Html, Main, NextScript } from "next/document";

/* nextjs supports google fonts  */
const CustomDocument = () => {
  console.log("Document is running");
  return (
    <Html lang="ko">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&amp;display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};
// class CustomDocument extends Document {
//   render(): JSX.Element {
//     return (
//       <Html lang="ko">
//         <Head>
//           <link
//             href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&amp;display=swap"
//             rel="stylesheet"
//           />
//         </Head>
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }

export default CustomDocument;
