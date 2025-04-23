import {  JSX  } from 'react'
import SiteHeader from '@common/SiteHeader.tsx'

function Page(props : { children : JSX.Element | JSX.Element[] | null,}) : JSX.Element {

  return (
    <>
    <SiteHeader/>
    { props.children }
    </>
  )
}

export default Page
