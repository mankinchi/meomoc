import { NextApiRequest, NextApiResponse } from 'next';
import { getPostDetailFromFB } from '../../utils/integration/fb';
import { prisma } from '../../utils/db';
import { Post } from '../../types/api/post';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Post>,
) {
	try {
		await prisma.$connect();

		const randomPost = await prisma.post.findFirst();
		if (randomPost) {
			const { id, postId } = randomPost;
			const fbPost = await getPostDetailFromFB(id, postId);

			res.json(fbPost);
		}
	} catch (e) {
		console.error(e);
	} finally {
		prisma.$disconnect();
	}

	res.end();
}
