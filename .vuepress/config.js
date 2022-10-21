import { defaultTheme, defineUserConfig } from 'vuepress';
import { removeHtmlExtensionPlugin } from 'vuepress-plugin-remove-html-extension';
import sidebar from './sidebar';

export default defineUserConfig({
  title: 'Mantle',
  description: 'Mantle is a framework for building large, robust websites and applications with WordPress',
  base: '/',
  head: [
    ['meta', { name: 'google-site-verification', content: '9j6GWEdJJsL1zqzPRBMYahbaFg0NNj-NVglppOfGyJE' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { property: 'og:image', content: 'https://repository-images.githubusercontent.com/261240189/e61bc280-2d73-11eb-92d0-249447854ca0' }],

    ['link', { rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['meta', { name: 'theme-color', content: '#234568' }],
  ],
  theme: defaultTheme({
    colorMode: 'dark',
    colorModeSwitch: false,
    activeHeaderLinks: false,
    contributors: false,
    displayAllHeaders: false,
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Help us improve this page!',
    lastUpdated: false,
    repo: 'alleyinteractive/mantle-docs',
    navbar: [
      { text: 'Home', link: '/', target: '_self', },
      { text: 'Docs', link: '/getting-started/installation/', target: '_self', },
      { text: 'Alley', link: 'https://alley.com/', },
    ],
    sidebar,
    sidebarDepth: 3,
  }),
  markdown: {
    code: {
      lineNumbers: false,
    },
    toc: {
      includeLevel: [1,2,3,4],
    },
  },
  plugins: [
    removeHtmlExtensionPlugin(),
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    [
      '@vuepress/google-analytics',
      {
        id: 'G-G4HGJSHN3S',
      }
    ],
    [
      '@vuepress/docsearch',
      {
        appId: 'Y3WWPYIIL4',
        apiKey: 'c92c3230a91695a1b01b2d74ed79d959',
        indexName: 'mantle',
        locales: {
          '/': {
            placeholder: 'Search Documentation',
          },
        },
      },
    ],
  ]
});