import { LoadingOutlined, setTwoToneColor } from '@ant-design/icons';
import { ApolloProvider } from '@apollo/client';
import { Spin } from 'antd';
import BrochureLayout from 'app/components/layout';
import UserContextProvider from 'app/contexts/user.context';
import { useApollo } from 'app/helpers/with-apollo';
import Head from 'next/head';
import NextNprogress from 'nextjs-progressbar';
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import '../assets/antd.less';
import '../assets/global.less';

setTwoToneColor('#1eaa0d');

Spin.setDefaultIndicator(<LoadingOutlined style={{ fontSize: 24 }} spin />);

// loadStripe.setLoadParameters({ advancedFraudSignals: process.env.IS_PROD });
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

const App = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="google-site-verification"
          content="jJEM2HJi1AU5A39kYqPtHVPzsyeRIJUhYNGFNFk1jeQ"
        />
        <meta name="robots" content="none" />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://js.stripe.com/v3/" />
      </Head>
      <NextNprogress
        options={{ trickleSpeed: 100 }}
        showAfterMs={500}
        spinner={false}
        color="#0c5669"
      />
      <style jsx global>{`
        #nprogress .spinner {
          display: none;
        }
        .nprogress-custom-parent #nprogress .spinner {
          position: absolute;
        }
      `}</style>
      <ApolloProvider client={apolloClient}>
        <UserContextProvider>
          <BrochureLayout>
            <Elements stripe={stripePromise}>
              <Component {...pageProps} />
            </Elements>
          </BrochureLayout>
        </UserContextProvider>
      </ApolloProvider>
    </>
  );
};

export default App;
