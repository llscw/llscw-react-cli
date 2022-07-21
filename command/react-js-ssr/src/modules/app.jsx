import React from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'
import s from './style.css'

function App() {
  return (
    <div className='root'>
      测试数据
      <h3>暗色佛in的三佛呢</h3>
    </div>
  )
}

export default withStyles(s)(App);