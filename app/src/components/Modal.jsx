import React from 'react'
import ReactModal from 'react-modal'

const defaultStyle = {
  overlay: {
    background: 'transparent'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'unset',
    bottom: 'unset',
    border: 0,
    borderRadius: 0,
    padding: 0,
    width: 'auto',
    height: 'auto',
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
  }
}

const Modal = ({ style, ...props }) => {
  style = style || {}
  if (style) {
    style.overlay = Object.assign(defaultStyle.overlay, style.overlay)
    style.content = Object.assign(defaultStyle.content, style.content)
  }
  return (
    <ReactModal
      closeTimeoutMS={300}
      style={style}
      {...props}
    />
  )
}

export default Modal
