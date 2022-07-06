// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DynamoDB Toolbox',
  tagline: 'Single Table Designs have never been this easy!',
  url: 'https://jeremydaly.github.io',
  baseUrl: '/dynamodb-toolbox/',
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
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        // title: 'DynamoDB Toolbox',
        logo: {
          alt: 'DynamoDB Toolbox',
          src: 'img/dynamodb-toolbox-logo.svg',
          srcDark: 'img/dynamodb-toolbox-logo-dark.svg'
        },
        items: [
          {
            type: 'doc',
            docId: 'introduction/what-is-dynamodb-toolbox',
            position: 'right',
            label: 'Documentation'
          },
          // { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/jeremydaly/dynamodb-toolbox',
            label: 'GitHub',
            position: 'right'
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
                to: '/docs'
              },
              {
                label: 'Quick Start',
                to: '/docs/introduction/quick-start'
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
      }
    })
}

module.exports = config
