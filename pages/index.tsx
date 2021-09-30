import React, { useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import absoluteUrl from 'next-absolute-url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'; // <-- import styles to be used

import { GetPostAPI } from './api/getPost';
import { Post } from '../types/api/post';

interface PageProps {
	post?: Post;
	previousPostId?: string;
	nextPostId?: string;
}

interface RandomPostId {
	id: string;
}

const Home: NextPage<PageProps> = (props: PageProps) => {
	const router = useRouter();
	const {
		post,
		previousPostId,
		nextPostId,
	} = props;

	useEffect(() => {
		if (post) {
			router.push(`/?postId=${post.postId}`, undefined, { shallow: true });
		}
	}, [post]);

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<FontAwesomeIcon icon={solid('user-secret')} />
			{
				previousPostId && (
					<Link href={`/?postId=${previousPostId}`}>Previous post</Link>
				)
			}
			{
				nextPostId && (
					<Link href={`/?postId=${nextPostId}`}>Next post</Link>
				)
			}
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

export const getServerSideProps: GetServerSideProps<GetPostAPI> = async (ctx) => {
	const {
		req,
		query,
	} = ctx;

	const { origin } = absoluteUrl(req);

	// reroute to random post
	if (!query.postId) {
		const { data } = await axios.get<RandomPostId>(`${origin}/api/getRandomPostId`);
		return {
			redirect: {
				destination: `/?postId=${data.id}`,
				permanent: false,
			},
		};
	}

	// get actual post
	const { data } = await axios.get<GetPostAPI>(`${origin}/api/getPost?postId=${query.postId}`);
	return {
		props: data,
	};
};

export default Home;
