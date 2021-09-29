export interface Post {
	postId: string;
	link: string;
	caption: string;
	images: {
		src: string;
		width: number;
		height: number;
	}[];
}
