// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// @ts-expect-error
const lightCodeTheme = require('prism-react-renderer/themes/vsLight')
// @ts-expect-error
const darkCodeTheme = require('prism-react-renderer/themes/vsDark')

lightCodeTheme.plain.backgroundColor = '#f8f8f8'
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
  organizationName: 'dynamodb-toolbox', // Usually your GitHub org/user name.
  projectName: 'dynamodb-toolbox', // Usually your repo name.
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  markdown: {
    mermaid: true
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          lastVersion: 'current',
          versions: {
            current: { label: 'v2', path: '/' }
          }
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
            type: 'docsVersionDropdown',
            position: 'left'
          },
          {
            href: 'https://github.com/dynamodb-toolbox/dynamodb-toolbox',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository'
          }
        ]
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
      mermaid: {
        theme: { light: 'default', dark: 'dark' }
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'C6EU7OCQ7D',
        // Public API key: it is safe to commit it
        apiKey: 'e6c6e967d6c14cbf9e800cab158ba3e1',
        indexName: 'dynamodbtoolbox',
        // Optional: see doc section below
        contextualSearch: true,
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',
        // Optional: Algolia search parameters
        // searchParameters: {},
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search'
      },
      announcementBar: {
        id: 'dynamodb_toolshack_beta',
        content:
          '🙌 Announcing <b>DynamoDB-Toolshack</b>: A comprehensive DynamoDB studio based on DynamoDB-Toolbox 🙌<br/><div><a href="https://dynamodb-toolshack.com/" target="_blank" rel="noopener noreferrer">Learn More</a> • <a href="https://demo.dynamodb-toolshack.com/" target="_blank" rel="noopener noreferrer">Online Demo</a> • <a href="mailto:contact@dynamodb-toolshack.com?subject=Request to Join Beta Test List&body=Dear Thomas,%0D%0A%0D%0AI’m excited about your product and would love the opportunity to join the beta test list. Could we schedule a quick call to discuss the process and any requirements for participation?%0D%0A%0D%0ALooking forward to hearing from you.%0D%0A%0D%0ABest regards,%0D%0A%0D%0A[Your Name]%0D%0A%0D%0A[Your Company]">Join Beta</a></div>',
        isCloseable: true
      }
    })
}

module.exports = config
