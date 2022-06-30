import Head from "next/head";

interface ISeoProps {
	title?: string;
	description?: string;
	image?: string;
}

const Seo = ( { title, description, image }:ISeoProps ) => {
	const siteName = "CloneMarket";
	return (
    <>
      <Head>
        <title>
          {title ? `${title} |` : null} {siteName}
        </title>
        {description ? <meta name="description" content={description} /> : null}
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://example.com/page.html" />
        {title ? <meta property="og:title" content={title} /> : null}
        {description ? (
          <meta property="og:description" content={description} />
        ) : null}
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="ko_KR" />
        {image ? (
          <>
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
          </>
        ) : null}
        <link rel="icon" href="/favicon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#FFC61B" />
      </Head>
    </>
  );
}

export default Seo;