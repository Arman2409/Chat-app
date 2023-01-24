import type { AppProps } from 'next/app'
import { Provider } from "react-redux"
import { useEffect } from 'react'

import '../styles/globals.scss'
import AppHeader from '../components/Custom/Header/Header'
import OpenMessages from '../components/Custom/OpenMessages/OpenMessages'
import Footer from '../components/Custom/Footer/Footer'
import store from '../store/store'
import {io} from "socket.io-client";

let socket: any;
function App({ Component, pageProps }: AppProps) {

    useEffect(() => {
        socket = io("ws://localhost:4000");

        return ()  => {
            socket.disconnect();
        }
    }, [])

  return <>
    <Provider store={store}>
      <AppHeader />
      <OpenMessages />
      <div style={{
        height: "calc(100vh - 160px)"
      }}>
          <Component {...pageProps} />
      </div>
      <Footer />
     </Provider>
 </>
}

export  { socket };
export default  App;
