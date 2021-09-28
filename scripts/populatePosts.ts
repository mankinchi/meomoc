// This script is meant to populate old posts before webhooks are installed
// Should only need to run once
/* eslint-disable-next-line */
import 'dotenv/config';
import { prisma } from '../utils/db';
import { requestFBGraphAPI } from '../utils/integration/fb';

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
	try {
		await prisma.$connect();

		const {
			posts: {
				data,
			},
		} = await requestFBGraphAPI<FacebookAPIGetPagePosts>(`${process.env.PAGE_ID}?fields=posts`);

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
