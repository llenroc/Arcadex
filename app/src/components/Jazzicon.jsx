import React, { Component } from 'react'
import DexonJazzicon from '@dexon-foundation/jazzicon'

class Jazzicon extends Component {
  constructor(...args) {
    super(...args)
    this.rootRef = React.createRef()
  }
  componentDidMount() {
    let el = DexonJazzicon(this.props.diameter, this.props.seed)
    this.rootRef.current.appendChild(el)
  }
  componentDidUpdate(prevProp) {
    if (
      prevProp.diameter !== this.props.diameter ||
      prevProp.seed !== this.props.seed) {
      let el = DexonJazzicon(this.props.diameter, this.props.seed)
      this.rootRef.current.innerHTML = ''
      this.rootRef.current.appendChild(el)
    }
  }
  render() {
    return <div ref={this.rootRef} />
  }
}

export default Jazzicon
