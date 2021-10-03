import React from 'react';
import classnames from 'classnames';

import { Props } from './types';

import styles from './styles.module.scss';

export const IndicatorDots = (props: Props): React.ReactElement => {
	const {
		numberOfDots,
		activeIndex,
		hidden,
	} = props;

	return (
		<div className={styles.container}>
			{
				Array(numberOfDots).fill(0).map((_, i) => (
					<div
						key={i}
						className={classnames(
							styles.dot,
							{
								[styles.active]: i === activeIndex,
								[styles.hidden]: hidden,
							},
						)}
					/>
				))
			}
		</div>
	);
};
