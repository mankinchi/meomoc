import { Direction } from '../../../../../enum/direction';

export interface Props {
	hidden: boolean;
	direction: Direction;
	onClick: () => void;
}
