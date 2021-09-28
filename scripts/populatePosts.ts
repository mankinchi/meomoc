// This script is meant to populate old posts before webhooks are installed
// Should only need to run once
import axios from 'axios';
/* eslint-disable-next-line */
import { PrismaClient } from '.prisma/client/index.js';
import 'dotenv/config';

interface FacebookAPIGetPagePosts {
	posts: {
		data: {
			created_time: string;
			message: string;
			id: string;
		}[];
	};
}

const main = async (): Promise<void> => {
	const prisma = new PrismaClient({
		log: ['query', 'info', 'warn', 'error'],
	});

	try {
		await prisma.$connect();

		const url = `https://graph.facebook.com/v12.0/${process.env.PAGE_ID}?fields=posts&access_token=${process.env.PAGE_ACCESS_TOKEN}`;
		const {
			data: {
				posts: {
					data,
				},
			},
		} = await axios.get<FacebookAPIGetPagePosts>(url);

		const existingPosts = await prisma.post.findMany();
		const existingPostsIds = existingPosts.map(({ postId }) => postId);

		const postsNotInDB = data.filter(({ id }) => !existingPostsIds.includes(id));
		if (postsNotInDB.length !== 0) {
			await prisma.post.createMany({
				data: postsNotInDB.map((post) => ({
					postId: post.id,
					dateTime: new Date(post.created_time),
				})),
			});
		}

		console.info('added everything');
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
};

main();
