/* eslint-disable max-lines */
import Head from '@docusaurus/Head'
import Link from '@docusaurus/Link'
import React from 'react'
import {
  BsBalloonHeartFill,
  BsSpellcheck
} from 'react-icons/bs'
import { FaGithub, FaHeart } from 'react-icons/fa'
import { GiFairyWand, GiFeather } from 'react-icons/gi'
import {
  MdOutlineImportContacts,
  MdRocketLaunch,
  MdShield
} from 'react-icons/md'
import { SlSpeech } from 'react-icons/sl'

type Link = { id: string; label: JSX.Element; to: string }

const headerLinks: Link[] = [
  {
    id: 'docs',
    label: (
      <div className="flex items-center gap-2">
        <MdOutlineImportContacts className="text-lg" /> Docs
      </div>
    ),
    to: './docs/getting-started/overview'
  },
  {
    id: 'github',
    label: (
      <div className="flex items-center gap-2">
        <FaGithub className="text-lg" /> GitHub
      </div>
    ),
    to: 'https://github.com/dynamodb-toolbox/dynamodb-toolbox'
  },
  {
    id: 'sponsor',
    label: (
      <div className="flex items-center gap-2">
        <FaHeart className="text-lg" /> Sponsor
      </div>
    ),
    to: 'https://github.com/sponsors/ThomasAribart'
  },
  {
    id: 'contact',
    label: (
      <div className="flex items-center gap-2">
        <SlSpeech className="text-lg" /> Contact
      </div>
    ),
    to: 'mailto:thomas.aribart@gmail.com'
  }
]

const footerLinks = [
  {
    label: 'Contact',
    to: 'mailto:thomas.aribart@gmail.com'
  },
  {
    label: '@ThomasAribart',
    to: 'https://x.com/aribartt'
  },
  {
    label: '@JeremyDaly',
    to: 'https://x.com/jeremy_daly'
  },
  {
    label: '@TheHecticByte',
    to: 'https://x.com/TheHecticByte'
  },
  {
    label: 'Off-by-none (newsletter)',
    to: 'https://offbynone.io/'
  }
]

const Home = (): JSX.Element => (
  <>
    <Head>
      <title>
        DynamoDB-Toolbox | Lightweight and type-safe query
        builder for DynamoDB and TypeScript
      </title>
      <meta
        name="description"
        content="Lightweight and type-safe query builder for DynamoDB and TypeScript"
      />
    </Head>
    <div className="flex flex-col gap-12 md:gap-16">
      <div className="flex flex-wrap py-2 px-4 items-center justify-center text-sm max-w-screen-xl mx-auto md:text-base md:self-end">
        {headerLinks.map(({ id, label, to }) => {
          const children = (
            <div className="p-2 opacity-90 hover:opacity-100">
              {label}
            </div>
          )

          return (
            <div key={id} className="hover:underline">
              {to.startsWith('http') ||
              to.startsWith('mailto') ? (
                <a href={to} className="strong-blue">
                  {children}
                </a>
              ) : (
                <Link to={to} className="strong-blue">
                  {children}
                </Link>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex flex-col items-center gap-12 text-center px-4">
        <div className="flex gap-2 lg:gap-4 items-center">
          <div className="flex w-[40px] md:w-[60px] lg:w-[100px]">
            <svg
              width="256"
              height="256"
              viewBox="0 0 256 256"
              className="height-auto rounded-full border-thick border-white shadow"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="256"
                height="256"
                fill="#D9D9D9"
              />
              <rect
                width="256"
                height="256"
                fill="url(#paint0_linear_0_1)"
              />
              <path
                d="M120.5 80.3333C151.359 80.3333 176.375 72.0506 176.375 61.8333C176.375 51.6161 151.359 43.3333 120.5 43.3333C89.6411 43.3333 64.625 51.6161 64.625 61.8333C64.625 72.0506 89.6411 80.3333 120.5 80.3333Z"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M64.625 61.8333V148.167C64.5904 151.132 66.7098 154.057 70.8044 156.695C74.8989 159.333 80.8488 161.606 88.1523 163.323C95.4559 165.04 103.899 166.15 112.77 166.56C121.641 166.97 130.68 166.669 139.125 165.68"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M176.375 61.8333V80.3333"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M64.625 105C64.634 107.883 66.678 110.726 70.594 113.301C74.5101 115.876 80.1896 118.112 87.1797 119.832C94.1697 121.551 102.277 122.705 110.854 123.203C119.431 123.701 128.24 123.528 136.58 122.698"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M65.0005 106.811V189.407C64.9619 192.245 67.3231 195.043 71.8848 197.566C76.4465 200.09 83.0752 202.265 91.212 203.907C99.3487 205.55 108.755 206.612 118.638 207.005C128.521 207.397 138.592 207.108 148 206.163"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M94.6129 108.987L89.0503 108.45L82.371 106.548L76.1101 103.644"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M94.8186 148.825L89.2561 148.289L82.5768 146.386L76.3159 143.483"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M94.8186 194.182L89.2561 193.645L82.5768 191.743L76.3159 188.839"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M168.754 126.685L148 156.526H168.754L157.579 204"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M169.351 91L147 125.589H169.351"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M169.351 91H209L193.298 114.059H209"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M208.465 114.738L190.105 141.188H208.465L158.176 203.583"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_0_1"
                  x1="250.394"
                  y1="5.60583"
                  x2="14.4818"
                  y2="248.058"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#064ec2" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="inline-block font-black text-4xl md:text-6xl lg:text-7xl">
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-l bg-color-gradient">
              DynamoDB-Toolbox
            </span>
          </h1>
        </div>
        <h2 className="font-light text-2xl max-w-md md:text-3xl lg:text-5xl lg:max-w-2xl">
          <b className="text-transparent bg-clip-text bg-gradient-to-l bg-color-gradient">
            Lightweight
          </b>{' '}
          and{' '}
          <b className="text-transparent bg-clip-text bg-gradient-to-r bg-color-gradient">
            type-safe
          </b>{' '}
          <span className="text-underlined font-large">
            query builder
          </span>{' '}
          for{' '}
          <b className="text-transparent bg-clip-text bg-gradient-to-r bg-color-gradient">
            DynamoDB
          </b>
        </h2>
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <p className="text text-balance opacity-90 max-w-[500px] lg:text-xl lg:max-w-[600px]">
            For those who love{' '}
            <a href="https://aws.amazon.com/dynamodb/">
              DynamoDB
            </a>{' '}
            but find the Document Client not that comfy 🛋️
          </p>
          <p className="text opacity-90 max-w-[500px] lg:text-xl lg:max-w-[600px]">
            <b>...we've got your back!</b>
          </p>
          <Link
            to="./docs/getting-started/overview"
            className="py-2 px-4 bg-gradient-to-r bg-color-gradient rounded text-white uppercase font-extrabold"
          >
            👉 Get Started
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center text-center">
        <div>
          <p className="text text-balance opacity-90 max-w-[500px] lg:text-xl lg:max-w-[600px]">
            DynamoDB-Toolbox is a light abstraction layer
            over the Document Client that{' '}
            <b>
              turns your DynamoDB journey into a ✨ bliss ✨
            </b>
          </p>
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-3 text-lg gap-12 p-8 max-w-[1200px] mx-auto">
          <div className="flex-1 flex flex-col gap-8 items-center max-w-[400px]">
            <div className="flex bg-gradient-to-bl bg-color-gradient rounded-full border-thick border-white p-2 shadow">
              <BsBalloonHeartFill className="text-white text-6xl" />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h3 className="uppercase text-xl font-black">
                Developer friendly
              </h3>
              <p className="text-sm dark:text-gray-200 leading-6">
                DynamoDB-Toolbox does all the{' '}
                <b>
                  heavy-lifting of crafting those complex
                  DynamoDB
                </b>{' '}
                requests for you. It makes your code{' '}
                <b>clearer</b>, more <b>concise</b> and{' '}
                <b>maintainable</b>.
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-8 items-center max-w-[400px]">
            <div className="flex bg-gradient-to-tr bg-color-gradient rounded-full border-thick border-white p-2 shadow">
              <BsSpellcheck className="text-white text-6xl" />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h3 className="uppercase text-xl font-black">
                Type-safe
              </h3>
              <p className="text-sm dark:text-gray-200 leading-6">
                We absolutely LOVE TypeScript! If you do
                too, you're in the right place: We{' '}
                <b>push type-safety to the limit</b> in
                everything we do 🙂
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-8 items-center max-w-[400px]">
            <div className="flex bg-gradient-to-bl bg-color-gradient rounded-full border-thick border-white p-2 shadow">
              <MdShield className="text-white text-6xl" />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h3 className="uppercase text-center text-xl font-black">
                Securing
              </h3>
              <p className="text-sm dark:text-gray-200 leading-6">
                At each interaction with DynamoDB, pushed
                and fetched items are validated against{' '}
                <b>schemas you define</b>, guaranteeing the{' '}
                <b>consistency</b> of your data and the{' '}
                <b>reliability</b> of your code.
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-8 items-center max-w-[400px]">
            <div className="flex bg-gradient-to-tr bg-color-gradient rounded-full border-thick border-white p-2 shadow">
              <GiFairyWand className="text-white text-6xl" />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h3 className="uppercase text-center text-xl font-black">
                Versatile
              </h3>
              <p className="text-sm dark:text-gray-200 leading-6">
                DynamoDB-Toolbox exposes a rich schema
                syntax that supports a broad range of edge
                cases like <b>defaults</b>,{' '}
                <b>composition</b>, <b>transformations</b>{' '}
                and <b>polymorphism</b>.
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-8 items-center max-w-[400px]">
            <div className="flex bg-gradient-to-bl bg-color-gradient rounded-full border-thick border-white p-2 shadow">
              <GiFeather className="text-white text-6xl" />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h3 className="uppercase text-center text-xl font-black">
                Lightweight
              </h3>
              <p className="text-sm dark:text-gray-200 leading-6">
                DynamoDB-Toolbox was designed with
                Serverless in mind. We believe that{' '}
                <b>bundle sizes matter</b>.
              </p>
              <p className="text-sm dark:text-gray-200 leading-6">
                That's why we made our core features{' '}
                <b>ultra-lightweight</b>, while keeping the
                rest <i>opt-in</i> and <b>tree-shakable</b>{' '}
                so you can <b>ship only what you use</b>.
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-8 items-center max-w-[400px]">
            <div className="flex bg-gradient-to-bl bg-color-gradient-pro rounded-full border-thick border-white p-2 shadow">
              <MdRocketLaunch className="text-white text-6xl" />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h3 className="uppercase text-center text-xl font-black">
                Want more?
              </h3>
              <p className="text-sm dark:text-gray-200 leading-6">
                <a
                  href="https://dynamodb-toolshack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DynamoDB-Toolshack
                </a>{' '}
                connects to DynamoDB-Toolbox to elevate your
                DynamoDB experience with a{' '}
                <b>schema-aware UI</b>, table{' '}
                <b>consitency checks</b> and a{' '}
                <b>migration system</b>.
              </p>
              <p className="text-sm dark:text-gray-200 leading-6">
                <a
                  href="https://aws.amazon.com/marketplace/pp/prodview-rexdp6m3af2hg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join the Beta
                </a>{' '}
                and get started in just a few clicks!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="navbar navbar--dark flex flex-col items-start justify-center py-5 text-sm shadow-xl shadow-black/10">
      <div className="full-width">
        <div className="flex justify-around md:justify-center md:flex-row flex-col gap-3">
          {footerLinks.map(item => (
            <div key={item.to} className="text-center">
              {item.to.startsWith('http') ? (
                <a
                  href={item.to}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
            </div>
          ))}
        </div>
        <div className="text-center opacity-20 mt-2">
          &copy; {new Date().getFullYear()} DynamoDB-Toolbox
        </div>
      </div>
    </div>
  </>
)

export default Home
