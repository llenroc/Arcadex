import React from 'react'
import styled from 'styled-components'

import { isHandheld } from '@/utils'
import { SpriteSlots } from '@/constants/slots'
import Sprite from '@/assets/arcadex-slotsheet.png'

const Viewport = styled.div`
  overflow: hidden;
  position: relative;
`
const Item = styled.div`
  text-align: center;
  color: transparent;
`

const Wrapper = styled.div`
  position: relative;
  background: url(/${Sprite});
  background-repeat: repeat-y;
  background-size: ${isHandheld() ? 100 : 200}px;
`

const Shadow = styled.div`
  position: absolute;
  background: #d8d8d8;
  width: ${isHandheld() ? 94 : 194}px;
  height: ${isHandheld() ? 97 : 186}px;
  bottom: ${isHandheld() ? 3 : 14}px;
  left: 3px;
`

const SpinState = {
  Starting: 'starting',
  Stopping: 'stopping',
  Stopped: 'stopped',
}

let width = isHandheld() ? 100 : 200
let height = isHandheld() ? 100 : 200

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
const EasingFunctions = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

let startEaseFn = EasingFunctions.linear
let stopEaseFn = EasingFunctions.easeOutQuad
let spinV = 3
let startS = 2
let stopS = 2

/*
 * events:
 *   onSpinStart
 *   onSpinStop
 *
 */
class SpinTap extends React.Component {
  constructor(...args) {
    super(...args)

    this.height = height * SpriteSlots.length
    this.startV = spinV * this.height
    this.moveOneTick = this.moveOneTick.bind(this)

    this.state = {
      x: this.correctTargetOffset(0)
    }

    this.clear()
  }
  correctTargetOffset(x) {
    return this.correctOffset(x - height / 2)
  }
  correctOffset(x) {
    return x % this.height + this.height
  }
  isStopped() {
    return this.spinState === SpinState.Stopped
  }
  isStarting() {
    return this.spinState === SpinState.Starting
  }
  start() {
    if (this.spinState !== SpinState.Stopped) {
      return
    }
    this.spinState = SpinState.Starting
    window.requestAnimationFrame(this.moveOneTick)
    if (this.props.onSpinStart) {
      this.props.onSpinStart(this)
    }
  }
  moveOneTick(t) {
    if (this.spinState === SpinState.Stopped) {
      return
    }
    let end = false
    if (!this.startT) {
      this.startT = t
      this.lastT = t
    }
    if (this.spinState === SpinState.Stopping) {
      if (!this.stopS) {
        this.stopS = Math.min(stopS, (t - this.startT) / 1000)
        this.stopT = t
        this.startStopX = this.state.x
        let unit = Math.ceil((this.stopS * this.startV - this.height) / this.height)
        this.stopDiffX = Math.max(unit, 1) * this.height + (this.stopX - this.startStopX)
      }
      let elapse = (t - this.stopT) / 1000
      let unit = stopEaseFn(Math.min(this.stopS, elapse) / this.stopS)
      let diff = unit * this.stopDiffX
      this.setState({ x: this.correctOffset(diff + this.startStopX) })
      if (unit === 1) {
        end = true
      }
    } else {
      let elapse = (t - this.startT) / 1000
      let unit = startEaseFn(Math.min(startS, elapse) / startS)
      let v = unit * this.startV
      let diff = ((t - this.lastT) / 1000) * v
      this.setState({ x: this.correctOffset(diff + this.state.x) })
    }
    this.lastT = t
    if (end) {
      this.clear()
      if (this.props.onSpinStop) {
        this.props.onSpinStop(this)
      }
      return
    }
    window.requestAnimationFrame(this.moveOneTick)
  }
  stop(target) {
    if (this.spinState !== SpinState.Starting) {
      return
    }
    let idx = SpriteSlots.indexOf(target)
    if (idx === -1) {
      return
    }
    this.stopX = this.correctTargetOffset(height * idx)
    this.spinState = SpinState.Stopping
  }
  clear() {
    this.spinState = SpinState.Stopped
    this.startT = null
    this.lastT = null
    this.stopT = null
    this.stopS = null
    this.stopX = null
    this.startStopX = null
    this.stopDiffX = null
  }
  render() {
    const { style } = this.props
    const { x } = this.state
    let viewportStyle = {
      ...style,
      width,
      height: height * 2
    }
    let itemStyle = {
      width,
      height,
      lineHeight: `${height}px`
    }
    let wrapperStyle = {
      top: -x
    }
    let items = []
    for (let i = 0; i < 3; ++i) {
      items = items.concat(SpriteSlots.map((target, idx) => (
        <Item key={i * SpriteSlots.length + idx} style={itemStyle}>
          {target}
        </Item>
      )))
    }
    return (
      <Viewport style={viewportStyle}>
        <Shadow className="spintap-shadow" />
        <Wrapper style={wrapperStyle}>
          { items }
        </Wrapper>
      </Viewport>
    )
  }
}

export default SpinTap
