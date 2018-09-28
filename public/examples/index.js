import React from 'react'
import ReactDOM from 'react-dom'
import RenderForcer from './app'

const render = (Component) => {
  ReactDOM.render(
    <Component/>,
    document.getElementById('app')
  )
}

render(RenderForcer)

