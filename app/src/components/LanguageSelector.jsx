import React from 'react'
import styled from 'styled-components'

import { ToolTipWrapper } from '@/components/ToolTip'
import {
  Dropdown,
  Item,
} from '@/components/Dropdown'
import { getLocale, mapLanguageCodeToLocalName } from '@/utils'
import locales from '@/locales'
import { BORDER_DIALOG, TEXT_WHITE, TEXT_DARK_GRAY } from '@/constants/colors'
import LanguageToggle from './LanguageToggle'

const Wrapper = styled.div`
  align-self: flex-end;
  margin-bottom: 10px;
  padding-top: 10px;
  ${ToolTipWrapper} {
    top: auto;
    bottom: calc(100% + 10px);
    padding: 5px 0;
    white-space: nowrap;
    &:after {
      top: 100%;
      bottom: auto;
      border-bottom: none;
      border-top: 8px solid ${BORDER_DIALOG};
    }
  }
`

const StyledItem = styled(Item)`
  padding: 6px 10px;
  color: ${props => (props.isActive ? TEXT_WHITE : TEXT_DARK_GRAY)};
`

// eslint-disable-next-line react/display-name
const renderToggle = locale => () => <LanguageToggle locale={locale} />

const LanguageSelector = ({
  className,
}) => (
  <Wrapper className={className}>
    <Dropdown renderToggle={renderToggle(getLocale())}>
      {Object.keys(locales).map(locale => (
        <StyledItem
          key={locale}
          isActive={locale === getLocale()}
          onClick={() => {
            location.search = `?lang=${locale}`
          }}
        >
          {mapLanguageCodeToLocalName(locale)}
        </StyledItem>
      ))}
    </Dropdown>
  </Wrapper>
)

export default LanguageSelector
