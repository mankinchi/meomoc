import { Post } from '../../../../types/api/post';

export interface Props {
	post?: Post;
	previousPostId?: string;
	nextPostId?: string;
}
