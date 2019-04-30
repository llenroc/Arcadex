import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { timingFunctions } from 'polished'
import { BG_HOVER, TEXT_DARK_GRAY } from '@/constants/colors'

const alignRightStyle = css`
  transform: ${props => (props.isActive ? 'none' : 'translateY(10px)')};
  right: 0;
  &:after {
    left: auto;
    right: 3px;
  }
`

export const ToolTipWrapper = styled.div`
  opacity: ${props => (props.isActive ? 1 : 0)};
  pointer-events: none;
  transition:
    .2s opacity ${timingFunctions('easeInOutQuad')},
    .2s transform ${timingFunctions('easeInOutQuad')}
  ;
  z-index: 3;
  position: absolute;
  top: 100%;
  right: 50%;
  font-size: 12px;
  color: ${TEXT_DARK_GRAY};
  background-color: ${BG_HOVER};
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3px 6px;
  white-space: nowrap;
  border-radius: 2px;
  transform: ${props => (props.isActive ? 'translateX(50%)' : 'translate(50%, 10px)')};
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: 50%;
    bottom: 100%;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid ${BG_HOVER};
    transform: translate(-50%, 0);
  }
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 20px;
    bottom: 100%;
  }
  
  ${props => props.alignRight && alignRightStyle}
`

const ToolTip = ({
  children,
  className,
  isActive,
  alignRight,
}) => (
  <ToolTipWrapper
    isActive={isActive}
    alignRight={alignRight}
    className={className}
  >
    {children}
  </ToolTipWrapper>
)

ToolTip.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
  alignRight: PropTypes.bool,
}

export default ToolTip
