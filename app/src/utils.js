import bowser from 'bowser'
import intl from 'react-intl-universal'
import ReactGA from 'react-ga'

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const browser = bowser.getParser(window.navigator.userAgent)
export const isHandheld = () => browser.getPlatformType() === 'mobile' || browser.getPlatformType() === 'tablet'

export const isProd = () => process.env.NODE_ENV === 'production'

export const getLocale = () => {
  const locale = intl.determineLocale({
    urlLocaleKey: 'lang',
    cookieLocaleKey: 'lang',
  })

  if (locale.startsWith('zh-CN')) {
    return 'zh-CN'
  }
  if (locale.startsWith('zh')) {
    return 'zh-TW'
  }
  return 'en-US'
}

export const mapLanguageCodeToLocalName = lang => ({
  'en-US': 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
})[lang] || 'English'

export const sendPageView = () => {
  ReactGA.pageview(window.location.pathname + window.location.search)
}
