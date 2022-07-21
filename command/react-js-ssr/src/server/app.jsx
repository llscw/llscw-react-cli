import React from 'react';
import { StaticRouter } from 'react-router-dom/server'
import {Routes, Route} from 'react-router-dom'
import App from '../modules/app'
import IndexMain from '../modules/index/index'

function SSR(props) {
  console.log(props,'=????')
  return (
      <StaticRouter location={props.url}>
        <Routes location={props.url}>
          {/* <Route index element={<App />}></Route> */}
          <Route path="/" element={<App />}></Route>
          <Route path='/test' element={<IndexMain />}></Route>
        </Routes>
      </StaticRouter>
  )
}

export default SSR