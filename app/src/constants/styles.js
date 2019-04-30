import { createGlobalStyle } from 'styled-components'
import {
  BG_PRIMARY, BG_SECONDARY, TEXT_WHITE,
} from './colors'

const SCROLLBAR_WIDTH = 8

export const FONT_FAMILY = '"Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif'

export const GlobalStyle = createGlobalStyle`
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
    user-select: none;
  }

  body {
    color: ${TEXT_WHITE};
    font-family: ${FONT_FAMILY};
    background: ${BG_SECONDARY};
    display: flex;
    flex-direction: column;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }

  button,
  input {
    overflow: visible;
  }

  button,
  select {
    text-transform: none;
  }

  button,
  [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: none;
    border: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  button:hover, a:hover {
    cursor: pointer;
  }

  button,
  button:hover,
  button:active {
    outline: none;
  }

  .ReactModal__Overlay {
    opacity: 0;
    transition: opacity 300ms ease-in-out;
  }

  .ReactModal__Overlay--after-open{
      opacity: 1;
  }

  .ReactModal__Overlay--before-close{
      opacity: 0;
  }

  /* Turn on custom 8x wide scrollbar */
  ::-webkit-scrollbar {
    position: fixed;
    width: ${SCROLLBAR_WIDTH}px;
    height: ${SCROLLBAR_WIDTH}px;
    opacity: 0;
    background-color: rgba(255,255,255,0);
    border-radius: ${SCROLLBAR_WIDTH}px;
  }
  /* hover effect for both scrollbar area, and scrollbar 'thumb' */
  ::-webkit-scrollbar:hover {
    background-color: rgba(255,255,255,0.1);
  }
  /* The scrollbar 'thumb' ...that marque oval shape in a scrollbar */
  ::-webkit-scrollbar-thumb:vertical,
  ::-webkit-scrollbar-thumb:horizontal {
    background: rgba(170, 185, 194, 0.3);
    border-radius: ${SCROLLBAR_WIDTH}px;
  }
  ::-webkit-scrollbar-thumb:vertical:hover,
  ::-webkit-scrollbar-thumb:horizontal:hover {
    width: ${SCROLLBAR_WIDTH}px;
    background: rgba(170, 185, 194, 0.4);
  }
  
  ::-webkit-scrollbar-thumb:vertical:active,
  ::-webkit-scrollbar-thumb:horizontal:active {
    background: rgba(170, 185, 194, 0.5);
  }
  ::-webkit-scrollbar-corner {
    background-color: ${BG_PRIMARY};
  }
`
