import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import {Routes, Route} from 'react-router-dom'
import App from '../modules/app'
import IndexMain from '../modules/index/index'
import StyleContext from 'isomorphic-style-loader/StyleContext'

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss())
  console.log(removeCss[0],'你好呀', styles)
  removeCss.forEach(dispose => dispose())
  return ;
}

ReactDOM.hydrate(
  <StyleContext.Provider value={{ insertCss }}>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path='/test' element={<IndexMain />}></Route>
        </Routes>
      </BrowserRouter>
  </StyleContext.Provider>
      ,
    document.getElementById('app')
)