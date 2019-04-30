import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { TEXT_WHITE, TEXT_DARK_GRAY } from '@/constants/colors'

const activeStyle = css`
  color: ${TEXT_WHITE};
  svg {
    g, path {
      fill: ${TEXT_WHITE};
    }
  }
`

export const DropdownSwitch = styled.div`
  height: 100%;
  color: ${TEXT_DARK_GRAY};
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  svg {
    g, path {
      fill: ${TEXT_DARK_GRAY};
    }
  }
  &:hover {
    ${activeStyle}
  }
  ${props => props.isActive && activeStyle}
`

const DropdownToggle = ({
  isActive,
  children,
  className,
  toggleDropdown,
}) => (
  <DropdownSwitch
    isActive={isActive}
    className={className}
    onClick={toggleDropdown}
  >
    {children}
  </DropdownSwitch>
)

DropdownToggle.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
  toggleDropdown: PropTypes.func,
}

export default DropdownToggle
