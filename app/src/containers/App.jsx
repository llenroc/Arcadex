import React, { useState, useEffect } from 'react'
import { ToastProvider } from 'react-toast-notifications'
import intl from 'react-intl-universal'
import moment from 'moment'
import LoadingModal from '@/components/LoadingModal'
import InstallDekuSanModal from '@/components/InstallDekuSanModal'
import Donate from '@/components/Donate'
import { GlobalStyle } from '@/constants/styles'
import { isHandheld, isProd, getLocale } from '@/utils'
import locales from '@/locales'
import DesktopLayout from './DesktopLayout'
import MobileLayout from './MobileLayout'

const Layout = isHandheld() ? MobileLayout : DesktopLayout

const App = () => {
  const [localeLoaded, setLocaleLoaded] = useState(false)

  useEffect(() => {
    const currentLocale = getLocale()
    document.cookie = `lang=${currentLocale}`

    moment.locale(currentLocale)
    intl.init({
      currentLocale,
      fallbackLocale: 'en-US',
      locales,
      ...(isProd() ? {
        warningHandler: () => {}
      } : {})
    }).then(() => {
      setLocaleLoaded(true)
    })
  }, [])

  return (
    localeLoaded && <ToastProvider placement={'bottom-center'} >
      <GlobalStyle />
      <Layout />
      <InstallDekuSanModal />
      <LoadingModal />
      <Donate />
    </ToastProvider>
  )
}

export default App
