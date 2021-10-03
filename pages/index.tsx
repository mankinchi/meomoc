import React, { useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import absoluteUrl from 'next-absolute-url';

import { GetPostAPI } from './api/getPost';
import { Post } from '../types/api/post';
import { ReadingBox } from '../components/page-components/index/readingBox';
import styles from '../styles/main.module.scss';

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
		<div className={styles.readingBoxContainer}>
			<div>
				<ReadingBox
					post={post}
					nextPostId={nextPostId}
					previousPostId={previousPostId}
				/>
			</div>
		</div>
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
