import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyles = createGlobalStyle`
    ${reset}
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        scroll-behavior: smooth;
    }

    html {
        font-size: 62.5%; //1rem = 10px
    }

    body {
        height: 100dvh;
        font-family: "Pretendard", sans-serif;
    }

    h1 {
        font-size: 2.4rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    h2 {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 0.8rem;
    }

    h3 {
        font-size: 1.8rem;
        font-weight: 500;
        margin-bottom: 0.6rem;
    }
`;
