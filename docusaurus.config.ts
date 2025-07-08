import type {Config} from '@docusaurus/types';
import { darkTheme, lightTheme } from './src/theme';

const config: Config = {
  title: 'Mantle by Alley',
  tagline: 'Mantle is a Larvel-inspired framework for building large, robust websites and applications with WordPress',
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
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'true',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap',
      },
    },
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: ({ docPath, version }) => {
            if ('current' === version) {
              return `https://github.com/alleyinteractive/mantle-docs/edit/main/docs/${docPath}`;
            }

            return `https://github.com/alleyinteractive/mantle-docs/edit/main/versioned_docs/version-${version}/${docPath}`;
          },
          lastVersion: 'current',
          versions: {
            current: {
              label: '1.x',
            },
          },
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: [
            '/tags/**',
            '/docs/0.12.x/**',
            '/next/**',
          ],
          filename: 'sitemap.xml',
        },
        googleAnalytics: {
          trackingID: 'G-G4HGJSHN3S',
          anonymizeIP: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
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
          docId: 'getting-started/index',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/alleyinteractive/mantle',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://github.com/alleyinteractive/mantle-framework',
          label: 'Framework Monorepo',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright &copy; ${new Date().getFullYear()} <a href="https://alley.com/">Alley</a>. Built with Docusaurus.`,
    },
    prism: {
      additionalLanguages: ['bash', 'json', 'php'],
      theme: lightTheme,
      darkTheme: darkTheme,
    },
  },
};

module.exports = config;
