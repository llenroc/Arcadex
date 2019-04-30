import React from 'react'
import styled from 'styled-components'
import InlineSVG from 'react-inlinesvg'

export const StyledSVG = styled(InlineSVG)`
  display: flex;
  align-items: center;
`

const SVG = ({ src, ...props }) => (src ? (
  <StyledSVG
    cacheGetRequests
    src={src}
    {...props}
  />
) : null)

export default SVG
