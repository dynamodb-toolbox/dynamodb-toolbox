import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

const FeatureList = [
  {
    title: 'Table Schemas and DynamoDB Typings',
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Define your Table and Entity data models using a
        simple JavaScript object structure, assign DynamoDB
        data types, and optionally set defaults. Then acess
        and update items from your DynamoDB tables using a
        simple API.
      </>
    )
  },
  {
    title: 'Magic UpdateExpressions',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Writing complex <code>UpdateExpression</code>{' '}
        strings is a major pain, especially if the input
        data changes the underlying clauses or requires
        dynamic (or nested) attributes. This library handles
        everything from simple SET clauses, to complex list
        and set manipulations, to defaulting values.
      </>
    )
  },
  {
    title: 'Powerful Query Builder',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Specify a partitionKey, and then easily configure
        your sortKey conditions, filters, and attribute
        projections to query your primary or secondary
        indexes. This library can even handle pagination
        with a simple <code>.next()</code> method.
      </>
    )
  }
]

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/* <Svg className={styles.featureSvg} role="img" /> */}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
