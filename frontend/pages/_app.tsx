import type { AppProps } from 'next/app'
import {Provider} from "react-redux"
import { useMediaQuery } from 'react-responsive'

import '../styles/globals.scss'
import AppHeader from '../components/Parts/Header/Header'
import OpenMessages from '../components/Custom/OpenMessages/OpenMessages'
import Footer from '../components/Parts/Footer/Footer'
import store from '../store/store'
import MessageAlert from "../components/Tools/MessageAlert/MessageAlert";
import NotReady from '../components/Custom/NotReady/NotReady'

function App({ Component, pageProps }: AppProps) {

  const isBig = useMediaQuery({query: '(min-width: 700px)'});  

  return <>
    <Provider store={store}>
      {isBig ?
      <>
      <AppHeader />
      <OpenMessages />
      <div className="main_cont">
          <MessageAlert/>
          <Component {...pageProps} />
      </div>
      <Footer />
      </> : <NotReady /> }
     </Provider>
 </>
}

export default  App;
