import axios from 'axios';
import { Post } from '../../types/api/post';
import { FacebookAPIGetPostDetails } from '../../types/fb/api/getPostDetails';
import { FacebookPostType } from '../../types/fb/postType';

const graphAPIVersion = 'v12.0';
const pageToken = process.env.PAGE_ACCESS_TOKEN;

export const requestFBGraphAPI = async <T>(path: string): Promise<T> => {
	const url = `https://graph.facebook.com/${graphAPIVersion}/${path}&access_token=${pageToken}`;
	const { data } = await axios.get<T>(url);

	return data;
};

export const getPostDetailFromFB = async (id: string, postId: string): Promise<Post> => {
	const fbPost = await requestFBGraphAPI<FacebookAPIGetPostDetails>(`/${postId}?fields=attachments,message`);

	return transformFacebookPost(id, fbPost);
};

const transformFacebookPost = (postId: string, post: FacebookAPIGetPostDetails): Post => {
	const {
		attachments: {
			data: [data],
		},
		message,
	} = post;

	return {
		postId,
		caption: message,
		link: data.url,
		images: data.type === FacebookPostType.PHOTO
			? [data.media.image]
			: data.subattachments!.data.map((subattachment) => subattachment.media.image),
	};
};
