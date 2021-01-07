import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

ReactDOM.render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>,
  document.getElementById('root')
)
