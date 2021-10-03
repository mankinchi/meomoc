import React from 'react';

import { config } from '@fortawesome/fontawesome-svg-core';
import '../node_modules/@fortawesome/fontawesome-svg-core/styles.css';
import type { AppProps } from 'next/app';

import '../styles/styles.scss';
import { Layout } from '../components/layout';

config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Layout>
			{/* eslint-disable-next-line */}
			<Component {...pageProps} />
		</Layout>
	);
}
export default MyApp;
