import './App.css'
import {  JSX  } from 'react'
import Page from '@common/Page_Templates/Page'

function App() : JSX.Element {

  return (
    <>
      <Page>
          <div className='left_aligned_div'>
            <p><h3>2023</h3></p>
            <p><a href="Blogs/How_to_reason_about_exceptions.html">How To Reason About Exceptions</a></p>
          </div>
      </Page>
    </>
  )
}

export default App
