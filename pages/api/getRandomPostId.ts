import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../utils/db';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<{
		id: string,
	}>,
) {
	try {
		await prisma.$connect();

		const randomPost = await prisma.post.findFirst();
		if (randomPost) {
			res.json({
				id: randomPost.id,
			});
		}
	} catch (e) {
		console.error(e);
	} finally {
		prisma.$disconnect();
	}

	res.end();
}
