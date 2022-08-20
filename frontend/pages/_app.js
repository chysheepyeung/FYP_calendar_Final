import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import App from 'next/app';
import Head from 'next/head';
import PageChange from 'components/PageChange/PageChange.js';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'next/router';

import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/main.css';
import 'styles/tailwind.css';

Router.events.on('routeChangeStart', (url) => {
  document.body.classList.add('body-page-transition');
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById('page-transition')
  );
});

Router.events.on('routeChangeComplete', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
  document.body.classList.remove('body-page-transition');
});

Router.events.on('routeChangeError', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
  document.body.classList.remove('body-page-transition');
});

export default class MyApp extends App {
  static async getInitialProps({ Component, _router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          refetchOnMount: true,
          retry: 2,
          retryDelay: 5 * 1000,
        },
      },
    });

    return (
      <>
        <QueryClientProvider client={queryClient}>
          <React.Fragment>
            <Head>
              <meta
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
                name="viewport"
              />
              <title>Philotes Calendar</title>
            </Head>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </React.Fragment>
          <ToastContainer
            closeOnClick
            draggable
            pauseOnHover
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            pauseOnFocusLoss={false}
            position="top-right"
            rtl={false}
          />
        </QueryClientProvider>
      </>
    );
  }
}
