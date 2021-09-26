import type { NextApiRequest, NextApiResponse } from 'next'
import util from 'util'

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const query = req.query;
	const mode = query['hub.mode'];
	const challenge = query['hub.challenge'];
	const token = query['hub.verify_token'];

	if (req.method === 'POST') {
		console.log(util.inspect(req.body, false, null, true))
		return res.status(200).end();
	}

	if (mode === 'subscribe' && token === process.env.FB_VERIFY_TOKEN) {
		return res.status(200).send(challenge);
	}

	res.json({
		error: 'wrong token'
	});
}
