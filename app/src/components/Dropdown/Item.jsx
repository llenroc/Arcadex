import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Item = styled.div`
  width: 100%;
  padding: 5px 20px;
  cursor: pointer;
`

const NavItem = ({
  children,
  className,
  onClick,
}) => (
  <Item
    className={className}
    onClick={onClick}
  >
    {children}
  </Item>
)

NavItem.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
}

export default NavItem
