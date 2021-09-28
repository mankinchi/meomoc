import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/db';

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
						photo_id: string,
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
	/* eslint-disable */
	if (req.method === 'POST') {
		const {
			entry: [
				{
					changes: [
						{
							value: {
								post_id: postId,
								created_time: createdTime,
							},
						},
					],
				},
			],
		} = req.body as FacebookWebhookAPI;

		try {
			await prisma.$connect();
			await prisma.post.create({
				data: {
					postId,
					dateTime: new Date(createdTime),
				},
			});
			console.log('Add new post');
		} catch (e) {
			console.error(e);
		} finally {
			await prisma.$disconnect();
		}

		return res.status(200).end();
	}

	return res.status(500).end();
}
