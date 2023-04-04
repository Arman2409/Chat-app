import type { AppProps } from 'next/app'
import {Provider} from "react-redux"
import {useEffect} from 'react'
import {io} from "socket.io-client";

import '../styles/globals.scss'
import AppHeader from '../components/Custom/Header/Header'
import OpenMessages from '../components/Custom/OpenMessages/OpenMessages'
import Footer from '../components/Custom/Footer/Footer'
import store from '../store/store'
import MessageAlert from "../components/Custom/MessageAlert/MessageAlert";

function App({ Component, pageProps }: AppProps) {

    useEffect(() => {
        return ()  => {
            // socket.disconnect();
        }
    }, [])

  return <>
    <Provider store={store}>
      <AppHeader />
      <OpenMessages />
      <div style={{
        height: "calc(100vh - 180px)"
      }}>
          <MessageAlert/>
          <Component {...pageProps} />
      </div>
      <Footer />
     </Provider>
 </>
}

export default  App;
