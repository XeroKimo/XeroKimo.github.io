import {  JSX  } from 'react'
import SiteHeader from '@common/SiteHeader.tsx'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import React from 'react'

import Page from './Page'

function BlogEntry(props : { children : string, title : string, publishedDate : string, modifiedDate: string }) : JSX.Element {

  var header : string = `# `
  header += props.title
  header += `
  Published Date:
  `
  header += props.publishedDate
  header += `
  
  Last Updated:
  `
  header += props.modifiedDate

  return (
    <>
    <Page>
    <ReactMarkdown remarkPlugins={[remarkGfm]}  components={{
          code({ className, children}) {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                PreTag="div"
              />
            ) : (
              <code className={className} >
                {children}
              </code>
            )
          }
        }}>
      {header + props.children}
    </ReactMarkdown>
    </Page>
    </>
  )
}

export default BlogEntry
