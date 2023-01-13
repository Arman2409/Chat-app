import type { AppProps } from 'next/app'
import { ConfigProvider } from 'antd'
import { Provider } from "react-redux"
import { useEffect } from 'react'

import '../styles/globals.scss'
import theme from '../styles/theme'
import AppHeader from '../components/Custom/Header/Header'
import OpenMessages from '../components/Custom/OpenMessages/OpenMessages'
import Footer from '../components/Custom/Footer/Footer'
import store from '../store/store'

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
     
  }, [])

  return <>
  <ConfigProvider theme={theme}>
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
   </ConfigProvider>
 </>
}
