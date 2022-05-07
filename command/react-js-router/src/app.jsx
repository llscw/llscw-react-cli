import React from 'react';
import { Routes, Route, Link, HashRouter, BrowserRouter } from "react-router-dom"
import IndexMain from './pages/index/index'
import NotFound from './pages/404.jsx'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<IndexMain />}></Route>
        <Route path="/home" element={<IndexMain />}></Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
