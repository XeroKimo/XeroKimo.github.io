import {  JSX  } from 'react'
import '@common/index.css'
import './Page.css'
import SiteHeader from '@common/SiteHeader.tsx'

function Page(props : { children? : JSX.Element | JSX.Element[]}) : JSX.Element {

  return (
    <>
    <SiteHeader/>
    { props.children }
    </>
  )
}

export default Page
