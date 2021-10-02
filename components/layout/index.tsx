import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { brands, regular } from '@fortawesome/fontawesome-svg-core/import.macro';

import styles from './styles.module.scss';
import logo from '../../public/images/logo.png';
import { Props } from './types';

export const Layout = (props: Props): React.ReactElement => {
	const { children } = props;
	return (
		<div className={styles.container}>
			<div className={styles.sideBar}>
				<div>
					<Image src={logo} className={styles.logo} />
				</div>
				<div className={styles.externalLinksContainer}>
					<a href="mailto:info.meomoc@gmail.com">
						<FontAwesomeIcon
							icon={regular('paper-plane')}
							style={{
								fontSize: '1.3rem',
							}}
						/>
					</a>
					<a href="https://sg.linkedin.com/in/meo-moc" target="_blank" rel="noreferrer">
						<FontAwesomeIcon icon={brands('linkedin')} size="xl" />
					</a>
					<a href="https://www.facebook.com/meomoc.vn" target="_blank" rel="noreferrer">
						<FontAwesomeIcon icon={brands('facebook-square')} size="xl" />
					</a>
				</div>
			</div>
			<div className={styles.mainContent}>
				{ children }
			</div>
		</div>
	);
};
