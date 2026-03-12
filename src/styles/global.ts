import { createGlobalStyle } from 'styled-components';

export const palette = {
  primary: '#07111f',
  secondary: '#ff9f43',
};

export default createGlobalStyle`
  :root {
    --color-bg: #07111f;
    --color-surface: #ffffff;
    --color-surface-muted: #f4f7fb;
    --color-card: #0f1b31;
    --color-card-soft: #14233f;
    --color-text: #0c1729;
    --color-text-soft: #62748d;
    --color-text-inverse: #f8fbff;
    --color-border: rgba(12, 23, 41, 0.08);
    --color-border-strong: rgba(158, 179, 209, 0.24);
    --color-accent: #ff9f43;
    --color-accent-strong: #ff7a18;
    --color-success: #0fa97f;
    --shadow-soft: 0 18px 50px rgba(7, 17, 31, 0.12);
    --shadow-card: 0 20px 60px rgba(7, 17, 31, 0.16);
  }

  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: linear-gradient(180deg, #07111f 0%, #0d1930 100%);
    color: var(--color-text-inverse);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body, input, button, textarea, select {
    font: 16px/1.5 'Avenir Next', 'Segoe UI', 'Trebuchet MS', sans-serif;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 700;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ::selection {
    background: rgba(255, 159, 67, 0.3);
    color: #fff;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(158, 179, 209, 0.35);
    border-radius: 999px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }
`;
