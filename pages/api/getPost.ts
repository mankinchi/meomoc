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

		const dbPost = await prisma.post.findFirst({
			where: {
				id: req.query.postId as string,
			},
		});
		if (dbPost) {
			const fbPost = await getPostDetailFromFB(dbPost.id, dbPost.postId);

			res.json(fbPost);
		}
	} catch (e) {
		console.error(e);
	} finally {
		prisma.$disconnect();
	}

	res.end();
}
