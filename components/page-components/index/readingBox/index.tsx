import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';

import classNames from 'classnames';
import styles from './styles.module.scss';
import { Props } from './types';
import { IndicatorDots } from './indicatorDots';
import { Navigator } from './navigator';
import { Direction } from '../../../../enum/direction';

export const ReadingBox = (props: Props): React.ReactElement => {
	const {
		post,
		previousPostId,
		nextPostId,
	} = props;

	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	useEffect(() => {
		setCurrentImageIndex(0);
	}, [post]);

	const handleNavigationButtonClick = (direction: Direction) => {
		const delta = direction === Direction.FORWARD ? 1 : -1;
		return () => {
			setCurrentImageIndex((currentValue) => currentValue + delta);
		};
	};

	return (
		<div className={styles.container}>
			<div className={styles.imagesSliderContainer}>
				{
					post && (
						<>
							<div className={styles.topSection}>
								<div>
									<Navigator
										direction={Direction.PREVIOUS}
										hidden={post.images.length === 1 || currentImageIndex === 0}
										onClick={handleNavigationButtonClick(Direction.PREVIOUS)}
									/>
								</div>
								<div className={styles.imagesSlider}>
									{
										post && (
											<div className={styles.imageContainer}>
												<Image
													key={post.images[currentImageIndex].src}
													src={post.images[currentImageIndex].src}
													width={post.images[currentImageIndex].width}
													height={post.images[currentImageIndex].height}
												/>
											</div>
										)
									}
								</div>
								<div>
									<Navigator
										direction={Direction.FORWARD}
										hidden={
											post.images.length === 1 || currentImageIndex === post.images.length - 1
										}
										onClick={handleNavigationButtonClick(Direction.FORWARD)}
									/>
								</div>
							</div>
							<div>
								{
									post && (
										<IndicatorDots
											numberOfDots={post.images.length}
											activeIndex={currentImageIndex}
											hidden={post.images.length === 1}
										/>
									)
								}
							</div>
						</>
					)
				}
			</div>
			<div className={styles.postDetails}>
				<div className={styles.controlContainer}>
					<div>
						<Link href={`/?postId=${previousPostId}`}>
							<div
								className={
									classNames(
										styles.control,
										{
											[styles.hidden]: previousPostId === undefined,
										},
									)
								}
							>
								<FontAwesomeIcon icon={regular('left')} />
								<div>Older</div>
							</div>
						</Link>
					</div>
					<div>
						<Link href="/?postId">
							<div className={styles.control}>
								<FontAwesomeIcon icon={regular('shuffle')} />
								<div>Random</div>
							</div>
						</Link>
					</div>
					<div>
						<Link href={`/?postId=${nextPostId}`}>
							<div
								className={
									classNames(
										styles.control,
										{
											[styles.hidden]: nextPostId === undefined,
										},
									)
								}
							>
								<FontAwesomeIcon icon={regular('right')} />
								<div>Newer</div>
							</div>
						</Link>
					</div>
				</div>
				{
					post && (
						<>
							<div className={styles.goToFBControl}>
								<a href={post.link} target="_blank" rel="noreferrer">
									<FontAwesomeIcon icon={regular('up-right-from-square')} />
								</a>
							</div>
							<div className={styles.captionContainer}>{ post.caption }</div>
						</>
					)
				}
			</div>
		</div>
	);
};
