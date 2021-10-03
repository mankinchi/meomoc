import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/db';
import { requestFBGraphAPI } from '../../../utils/integration/fb';

interface FacebookWebhookAPI {
	object: string,
	entry: [
		{
			id: string,
			time: number,
			changes: [
				{
					value: {
						link: string,
						message: string,
						post_id: string,
						created_time: number,
						item: string,
						photos?: string[],
						published: number,
						verb: string,
					},
					field: string,
				},
			]
		},
	]
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { query } = req;
	const mode = query['hub.mode'];
	const challenge = query['hub.challenge'];
	const token = query['hub.verify_token'];

	// To verify subscription
	if (mode === 'subscribe' && token === process.env.FB_VERIFY_TOKEN) {
		return res.status(200).send(challenge);
	}

	// To handle webhook
	if (req.method === 'POST') {
		const {
			entry: [
				{
					changes: [
						{
							value: {
								post_id: postId,
								created_time: createdTime,
								photos,
								verb,
								item,
							},
						},
					],
				},
			],
		} = req.body as FacebookWebhookAPI;

		let newPostId: string | undefined;
		const dateTime = new Date(createdTime);

		// if add photo or multiple photos (fb treats multiple photos as status post)
		if (
			verb === 'add'
			&& (
				(
					item === 'photo'
				)
				|| (
					item === 'status' && photos !== undefined
				)
			)
		) {
			console.info('changes: add one or many photos');
			newPostId = postId;
		}

		// if share a post with images
		if (verb === 'add' && item === 'share') {
			const fbPost = await requestFBGraphAPI<{
				data: any[],
			}>(`/${postId}/attachments?fields=subattachments`);

			// If share a post without images, the data array here will be empty
			if (fbPost.data.length !== 0) {
				console.info('changes: share a post with images');
				newPostId = postId;
			}
		}

		if (newPostId) {
			try {
				await prisma.$connect();
				await prisma.post.create({
					data: {
						postId: newPostId,
						dateTime,
					},
				});
				console.info('Add new post');
			} catch (e) {
				console.error(e);
			} finally {
				await prisma.$disconnect();
			}
		} else {
			console.info('changes occurs but nothing is added');
		}

		return res.status(200).end();
	}

	return res.status(500).end();
}
