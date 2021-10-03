import { NextApiRequest, NextApiResponse } from 'next';
import { getPostDetailFromFB } from '../../utils/integration/fb';
import { prisma } from '../../utils/db';
import { Post } from '../../types/api/post';

export interface GetPostAPI {
	post?: Post;
	previousPostId?: string;
	nextPostId?: string;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GetPostAPI>,
) {
	try {
		await prisma.$connect();

		const postId = req.query.postId as string;

		const dbPost = await prisma.post.findFirst({
			where: {
				id: postId,
			},
		});

		let previousPostId: string | undefined;
		let nextPostId: string | undefined;

		if (dbPost) {
			const getPreviousPostId = prisma.post.findFirst({
				where: {
					dateTime: {
						lt: dbPost.dateTime,
					},
				},
				select: {
					id: true,
				},
				orderBy: {
					dateTime: 'desc',
				},
			});

			const getNextPostId = prisma.post.findFirst({
				where: {
					dateTime: {
						gt: dbPost.dateTime,
					},
				},
				select: {
					id: true,
				},
				orderBy: {
					dateTime: 'asc',
				},
			});

			const [previousPost, nextPost] = await Promise.all([
				getPreviousPostId,
				getNextPostId,
			]);

			if (previousPost) previousPostId = previousPost.id;
			if (nextPost) nextPostId = nextPost.id;
		}

		const fbPost = dbPost ? await getPostDetailFromFB(dbPost.id, dbPost.postId) : undefined;
		if (fbPost) {
			// this is to deal with dynamic subdomain
			// ref: https://github.com/vercel/next.js/discussions/18429
			fbPost.images = fbPost.images.map((image) => ({
				...image,
				src: image.src.replace(/^[^.]*/, 'https://scontent-syd2-1'),
			}));
		}
		res.json({
			post: fbPost,
			previousPostId,
			nextPostId,
		});
	} catch (e) {
		console.error(e);
	} finally {
		prisma.$disconnect();
	}

	res.end();
}
