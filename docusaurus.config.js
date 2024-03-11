// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Mantle by Alley',
  tagline: 'Mantle is a framework for building large, robust websites and applications with WordPress',
  url: 'https://mantle.alley.com',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'alleyinteractive', // Usually your GitHub org/user name.
  projectName: 'mantle-docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/alleyinteractive/mantle-docs/tree/main/',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        googleAnalytics: {
          trackingID: 'G-G4HGJSHN3S',
          anonymizeIP: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: 'Y3WWPYIIL4',
        apiKey: 'c92c3230a91695a1b01b2d74ed79d959',
        contextualSearch: false,
        indexName: 'mantle',
        searchPagePath: false,
      },
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
      },
      metadata: [
        { name: 'google-site-verification', content: '9j6GWEdJJsL1zqzPRBMYahbaFg0NNj-NVglppOfGyJE' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        { property: 'og:image', content: 'https://repository-images.githubusercontent.com/261240189/e61bc280-2d73-11eb-92d0-249447854ca0' },
      ],
      navbar: {
        title: 'Mantle by Alley',
        logo: {
          alt: 'Mantle by Alley',
          src: 'img/logo-no-text.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'getting-started/installation',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/alleyinteractive/mantle-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright &copy; ${new Date().getFullYear()} <a href="https://alley.com/">Alley</a>. Built with Docusaurus.`,
      },
      prism: {
        additionalLanguages: ['php'],
        theme: lightTheme,
        darkTheme: darkTheme,
      },
    }),
};

module.exports = config;
