import { config } from '@fortawesome/fontawesome-svg-core';
import '../node_modules/@fortawesome/fontawesome-svg-core/styles.css';
import type { AppProps } from 'next/app';

config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
	// eslint-disable-next-line
	return <Component {...pageProps} />;
}
export default MyApp;
