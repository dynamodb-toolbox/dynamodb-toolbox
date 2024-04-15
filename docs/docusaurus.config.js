// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/vsLight')
const darkCodeTheme = require('prism-react-renderer/themes/vsDark')

// @ts-expect-error bad typing
lightCodeTheme.plain.backgroundColor = '#f8f8f8'
// @ts-expect-error bad typing
darkCodeTheme.plain.backgroundColor = '#242424'

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DynamoDB Toolbox',
  tagline: 'DynamoDB Toolbox made easy!',
  url: 'https://www.dynamodbtoolbox.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'jeremydaly', // Usually your GitHub org/user name.
  projectName: 'dynamodb-toolbox', // Usually your repo name.
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // routeBasePath: '/', // Serve the docs at the site's root
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/jeremydaly/dynamodb-toolbox/tree/main/docs'
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        },

        gtag: {
          trackingID: 'G-08NETQF4FS',
          anonymizeIP: true
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/dynamodb-toolbox-card.png',
      navbar: {
        hideOnScroll: true,
        style: 'dark',
        title: 'DynamoDB Toolbox',
        logo: {
          alt: 'DynamoDB Toolbox',
          src: 'img/dynamodb-toolbox-icon.svg'
        },
        items: [
          {
            href: 'https://github.com/jeremydaly/dynamodb-toolbox',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'What is DynamoDB Toolbox?',
                to: '/docs/getting-started/overview'
              },
              {
                label: 'Quick Start',
                to: '/docs/quick-start'
              },
              {
                label: 'Contributing',
                to: '/docs/contributing/'
              }
            ]
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/jeremydaly/dynamodb-toolbox/discussions'
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/jeremy_daly'
              }
            ]
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/jeremydaly/dynamodb-toolbox'
              },
              {
                label: 'Issues',
                href: 'https://github.com/jeremydaly/dynamodb-toolbox/issues'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} - Jeremy Daly`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: false
        }
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'XS94BW9P52',

        // Public API key: it is safe to commit it
        apiKey: 'c95bd6f22598598ec831d3ba7aa5ac7c',

        indexName: 'dynamodbtoolbox',

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Algolia search parameters
        // searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search'
      }
    })
}

module.exports = config
