import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import axios from 'axios';

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/dist/client/router';

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

const getRandomPost = async (): Promise<PostData> => {
	const { data } = await axios.get<PostData>('/api/getRandomPost');

	return data;
};

const getPostById = async (id: string): Promise<PostData> => {
	const { data } = await axios.get<PostData>(`/api/getPost?id=${id}`);

	return data;
};

const Home: NextPage = () => {
	const router = useRouter();

	const [post, setPost] = useState<PostData>();
	useEffect(() => {
		const getData = async () => {
			let aPost: PostData;
			if (!router.query.postId) {
				aPost = await getRandomPost();
			} else {
				aPost = await getPostById(router.query.postId as string);
			}

			if (aPost) {
				setPost(aPost);
				router.push(`/?postId=${aPost.postId}`, undefined, { shallow: true });
			}
		};

		if (router.isReady) {
			getData();
		}
	}, [router.query.postId]);

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
