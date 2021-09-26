import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
	// eslint-disable-next-line
	return <Component {...pageProps} />;
}
export default MyApp;
