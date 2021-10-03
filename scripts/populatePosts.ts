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
			full_picture: string;
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
		} = await requestFBGraphAPI<FacebookAPIGetPagePosts>(`${process.env.PAGE_ID}?fields=posts{full_picture,created_time,id}`);

		const existingPosts = await prisma.post.findMany();
		const existingPostsIds = existingPosts.map(({ postId }) => postId);

		const postToAdd = data
			.filter(({ full_picture }) => full_picture !== undefined)
			.filter(({ id }) => !existingPostsIds.includes(id));
		if (postToAdd.length !== 0) {
			await prisma.post.createMany({
				data: postToAdd.map((post) => ({
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
