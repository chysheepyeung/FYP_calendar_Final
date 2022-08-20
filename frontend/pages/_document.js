import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta content="#000000" name="theme-color" />
          <link href="/img/brand/favicon.ico" rel="shortcut icon" />
          <link
            href="/img/brand/apple-icon.png"
            rel="apple-touch-icon"
            sizes="76x76"
          />
        </Head>
        <body className="text-blueGray-700 antialiased">
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
