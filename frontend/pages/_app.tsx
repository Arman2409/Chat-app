import type { AppProps } from 'next/app'
import {Provider, useSelector} from "react-redux"
import { useMediaQuery } from 'react-responsive'

import '../styles/globals.scss'
import AppHeader from '../components/Parts/Header/Header'
import OpenMessages from '../components/Custom/OpenMessages/OpenMessages'
import Footer from '../components/Parts/Footer/Footer'
import store, { IRootState } from '../store/store'
import MessageAlert from "../components/Tools/MessageAlert/MessageAlert";
import NotReady from '../components/Custom/NotReady/NotReady'
import React, { useEffect, useState } from 'react'
import Loading from '../components/Custom/Loading/Loading';

function MainApp({ Component, pageProps }: AppProps) {

  return <>
    <Provider store={store}>
      <App Component={Component} pageProps={pageProps}/>
     </Provider>
 </>
}

const App: React.FC<Omit<AppProps, "router">> = ({Component, pageProps}:Omit<AppProps, "router">) => {

  const [loaded, setLoaded] = useState()
  const [showContent, setShowContent] = useState<boolean>(true);
  const storeLoaded = useSelector((state: IRootState) => {
    return state.window.loaded;
   });

  const isBig = useMediaQuery({query: '(min-width: 700px)'});  

  useEffect(() => {
    console.log(storeLoaded);
    
      setShowContent(isBig);
      setLoaded(storeLoaded);
  }, [isBig, storeLoaded]);

  return (
    <>
      {showContent ?
       <>
        {!loaded && <Loading type="box" />} 
        <AppHeader />
        <OpenMessages />
        <div className="main_cont">
            <MessageAlert/>
            <Component {...pageProps} />
        </div>
        <Footer />
        </> : <NotReady /> }
      </>
  )
}

export default  MainApp;
