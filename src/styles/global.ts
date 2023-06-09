import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }
  html {
    font-size: 62.5%;
  }
  body {
    -webkit-font-smoothing: antialiased;
  }
  body, input, button {
    font-family: 'Roboto', sans-serif;
    font-size: clamp(16px, 1.6rem, 2vw);
  }
  button {
    cursor: pointer;
  }
`;
