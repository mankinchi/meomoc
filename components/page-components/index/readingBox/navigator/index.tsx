import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import styles from './styles.module.scss';
import { Props } from './types';
import { Direction } from '../../../../../enum/direction';

export const Navigator = (props: Props): React.ReactElement => {
	const {
		direction,
		hidden,
		onClick,
	} = props;

	const icon = direction === Direction.FORWARD ? solid('arrow-right') : solid('arrow-left');

	return (
		<FontAwesomeIcon
			icon={icon}
			className={
				classNames(
					styles.icon,
					{
						[styles.hidden]: hidden,
					},
				)
			}
			onClick={onClick}
		/>
	);
};
