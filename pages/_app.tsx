import '../styles/globals.scss';
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  RecoilRoot
} from 'recoil';
import type { AppProps } from 'next/app'
import Layout from '../components/Layout';
import { SSRProvider } from 'react-bootstrap';
import React from 'react';

import SetSysConfig from '../components/SetSysConfig';


function MyApp({ Component, pageProps }: AppProps) {

  return <><SSRProvider>
    <RecoilRoot>
      <SetSysConfig />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  </SSRProvider></>
}

export default MyApp;
