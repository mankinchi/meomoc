import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<{
		id: string,
	}>,
) {
	try {
		const client = new MongoClient(process.env.DATABASE_URL!);
		await client.connect();
		const db = client.db(process.env.DATABASE_NAME);

		const aggregation = db.collection('Post').aggregate([
			{ $sample: { size: 1 } },
			{ $project: { _id: { $toString: '$_id' } } },
		]);

		let postId: string | undefined;
		await aggregation.forEach((document) => {
			/* eslint-disable-next-line */
			postId = document._id;
		});

		if (postId) {
			res.json({
				id: postId,
			});
		}
	} catch (e) {
		console.error(e);
	}

	res.end();
}
