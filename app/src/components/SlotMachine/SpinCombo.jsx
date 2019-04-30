import React from 'react'
import styled from 'styled-components'

import Sprite from '@/assets/sprite5.png'

const width = 37
const height = 47
const items = [...Array(10).keys()]

const Viewport = styled.div`
  overflow: hidden;
`
const Item = styled.div`
  text-align: center;
  color: transparent;
`

const Wrapper = styled.div`
  position: relative;
  background: url(/${Sprite});
  background-repeat: repeat-y;
  background-size: 37px 423px;
`

class SpinCombo extends React.Component {
  constructor(...args) {
    super(...args)
  }
  render() {
    const { item, style } = this.props
    let viewportStyle = {
      ...style,
      width,
      height
    }
    let itemStyle = {
      width,
      height,
      lineHeight: `${height}px`
    }
    let wrapperStyle = {
      top: -item * height,
    }
    return (
      <Viewport style={viewportStyle}>
        <Wrapper style={wrapperStyle}>
          {items.map((item, idx) => (
            <Item key={idx} style={itemStyle}>
              {item}
            </Item>
          ))}
        </Wrapper>
      </Viewport>
    )
  }
}

export default SpinCombo
