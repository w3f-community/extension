import { createGlobalStyle } from 'styled-components';
import NunitoregularWoff2 from '../assets/fonts/Nunitoregular.woff2';
import NunitoregularWoff from '../assets/fonts/Nunitoregular.woff';
import NunitosemiboldWoff2 from '../assets/fonts/Nunitosemibold.woff2';
import NunitosemiboldWoff from '../assets/fonts/Nunitosemibold.woff';
import NunitoboldWoff2 from '../assets/fonts/Nunitobold.woff2';
import NunitoboldWoff from '../assets/fonts/Nunitobold.woff';

export default createGlobalStyle`
  @font-face {
       font-family: 'Nunito';
       src: url(${NunitoregularWoff2}) format('woff2'),
        url(${NunitoregularWoff}) format('woff');
       font-weight: normal;
       font-style: normal;
  }
  @font-face {
       font-family: 'Nunito';
       src: url(${NunitosemiboldWoff2}) format('woff2'),
        url(${NunitosemiboldWoff}) format('woff');
       font-weight: 600;
       font-style: normal;
  }
  @font-face {
       font-family: 'Nunito';
       src: url(${NunitoboldWoff2}) format('woff2'),
        url(${NunitoboldWoff}) format('woff');
       font-weight: 800;
       font-style: normal;
  }
`;