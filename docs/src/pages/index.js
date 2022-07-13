import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import HomepageFeatures from '@site/src/components/HomepageFeatures'

import styles from './index.module.css'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">
          <img src="img/dynamodb-toolbox-white.svg" alt="DynamoDB Toolbox" />
          {/* {siteConfig.title} */}
        </h1>

        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.indexCtas}>
          <Link className="button button--secondary button--lg" to="/docs/">
            View the Documentation
          </Link>

          <span className={styles.indexCtasGitHubButtonWrapper}>
            <iframe
              className={styles.indexCtasGitHubButton}
              src="https://ghbtns.com/github-btn.html?user=jeremydaly&amp;repo=dynamodb-toolbox&amp;type=star&amp;count=true&amp;size=large"
              width={160}
              height={30}
              title="GitHub Stars"
            />
          </span>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Single Table Designs have never been this easy!"
    >
      <HomepageHeader />
      <main>
        {/* <div className={styles.content}>
          <div>Build test</div>
        </div> */}
        <HomepageFeatures />

        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/#features">
            Plus a whole lot more!
          </Link>
        </div>
      </main>
    </Layout>
  )
}
