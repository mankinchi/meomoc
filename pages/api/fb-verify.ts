import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const query = req.query;
	const mode = query['hub.mode'];
	const challenge = query['hub.challenge'];
	const token = query['hub.verify_token'];

	console.log(mode, challenge, token);

	if (mode === 'subscribe' && token === process.env.FB_VERIFY_TOKEN) {
		return res.status(200).send(challenge);
	}

	res.json(process.env);

	// res.json({
	// 	error: 'wrong token'
	// });
}
