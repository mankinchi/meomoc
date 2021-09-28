import { NextApiRequest, NextApiResponse } from 'next';
import { requestFBGraphAPI } from '../../utils/integration/fb';
import { prisma } from '../../utils/db';

interface FacebookImageDetails {
	height: number;
	src: string;
	width: number;
}

enum FacebookPostType {
	PHOTO = 'photo',
	ALBUM = 'album',
}

interface FacebookAPIGetPostDetails {
	attachments: {
		data: [
			{
				media: {
					image: FacebookImageDetails;
				},
				subattachments?: {
					data: [
						{
							media: {
								image: FacebookImageDetails;
							},
							type: FacebookPostType;
						},
					]
				},
				description?:string;
				title?: string;
				type: FacebookPostType;
				url: string;
			},
		]
	}
}

export interface GetRandomPostResponse {
	link: string;
	caption: string;
	images: string[];
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GetRandomPostResponse>,
) {
	try {
		await prisma.$connect();

		const randomPost = await prisma.post.findFirst();
		if (randomPost) {
			const { postId } = randomPost;

			const {
				attachments: {
					data: [data],
				},
			} = await requestFBGraphAPI<FacebookAPIGetPostDetails>(`/${postId}?fields=attachments`);

			const post: GetRandomPostResponse = {
				caption: data.title || data.description || '',
				link: data.url,
				images: data.type === FacebookPostType.PHOTO
					? [data.media.image.src]
					: data.subattachments!.data.map((subattachment) => subattachment.media.image.src),
			};

			res.json(post);
		}
	} catch (e) {
		console.error(e);
	} finally {
		prisma.$disconnect();
	}

	res.end();
}
