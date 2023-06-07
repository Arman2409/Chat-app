import React, { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import {Provider, useSelector} from "react-redux"
import { useMediaQuery } from 'react-responsive'

import '../styles/globals.scss'
import AppHeader from '../components/Parts/Header/Header'
import Footer from '../components/Parts/Footer/Footer'
import store, { IRootState } from '../store/store'
import MessageAlert from "../components/Tools/MessageAlert/MessageAlert";
// Not ready for mobile version 
// import NotReady from '../components/Custom/NotReady/NotReady'
import Loading from '../components/Custom/Loading/Loading';
import MobileMenu from "../components/Parts/MobileMenu/MobileMenu";

function MainApp({ Component, pageProps }: AppProps) {

  return (
     <Provider store={store}>
       <App Component={Component} pageProps={pageProps}/>
     </Provider>
  )
}

const App: React.FC<Omit<AppProps, "router">> = ({Component, pageProps}:Omit<AppProps, "router">) => {

  const [loaded, setLoaded] = useState()
  const storeLoaded = useSelector((state: IRootState) => {
    return state.window.loaded;
   });

  const isSmall: boolean = useMediaQuery({ query: "(max-width: 500px)" });
  const isBig = useMediaQuery({query: '(min-width: 700px)'});  

  useEffect(() => {
      setLoaded(storeLoaded);
  }, [isBig, storeLoaded]);

  return (
    <>
        {!loaded && <Loading type="box" />} 
        <AppHeader />
        {isSmall && <MobileMenu />}
        <div className="main_cont">
            <MessageAlert/>
            <Component {...pageProps} />
        </div>
        <Footer />
      </>
  )
}

export default  MainApp;
