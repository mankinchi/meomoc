import axios from 'axios';

const graphAPIVersion = 'v12.0';
const pageToken = process.env.PAGE_ACCESS_TOKEN;

export const requestFBGraphAPI = async <T>(path: string): Promise<T> => {
	const url = `https://graph.facebook.com/${graphAPIVersion}/${path}&access_token=${pageToken}`;
	const { data } = await axios.get<T>(url);

	return data;
};
