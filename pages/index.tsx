import React from 'react';
import type { NextPage } from 'next';
import axios from 'axios';

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/dist/client/router';
import useSWR from 'swr';

interface PostData {
	postId: string;
	caption: string;
	link: string;
	images: {
		src: string;
		width: number;
		height: number;
	}[];
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Home: NextPage = () => {
	const router = useRouter();

	let url: string | null = null;
	if (router.isReady) {
		url = !router.query.postId ? '/api/getRandomPost' : `/api/getPost?id=${router.query.postId}`;
	}
	const { data: post } = useSWR<PostData>(url, fetcher);

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{
				post && (
					<>
						<div><a href={post.link} target="_blank" rel="noreferrer">{ post.caption }</a></div>
						{
							post.images.map(({ src, width, height }) => (
								<Image
									key={src}
									src={src}
									width={width}
									height={height}
								/>
							))
						}
					</>
				)
			}
		</>
	);
};

export default Home;
