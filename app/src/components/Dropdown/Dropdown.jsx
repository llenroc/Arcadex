import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import onClickOutside from 'react-onclickoutside'
import ToolTip from '@/components/ToolTip'
import Toggle from './Toggle'

const Wrapper = styled.div`
  letter-spacing: initial;
  height: 100%;
  position: relative;
`

const Menu = styled(ToolTip)`
  pointer-events: ${props => (props.isActive ? 'all' : 'none')};
  font-size: 14px;
`

class Dropdown extends PureComponent {
  state = {
    isActive: false,
  };

  handleClickOutside = () => this.setState({ isActive: false });

  toggleDropdown = () => this.setState({ isActive: !this.state.isActive });

  openDropdown = () => this.setState({ isActive: true });

  closeDropdown = () => this.setState({ isActive: false });

  render() {
    const { className, children, renderToggle, autoOpen, autoClose, alignRight } = this.props
    const { isActive } = this.state

    return (
      <Wrapper
        className={className}
        onClick={this.toggleDropdown}
        onMouseEnter={autoOpen && this.openDropdown}
        onMouseLeave={autoClose && this.closeDropdown}
      >
        <Toggle isActive={isActive}>
          {renderToggle()}
        </Toggle>

        <Menu
          alignRight={alignRight}
          isActive={isActive}
        >
          {children}
        </Menu>
      </Wrapper>
    )
  }
}

Dropdown.propTypes = {
  className: PropTypes.string,
  renderToggle: PropTypes.func,
  autoOpen: PropTypes.bool,
  autoClose: PropTypes.bool,
  alignRight: PropTypes.bool,
}

export default onClickOutside(Dropdown)
