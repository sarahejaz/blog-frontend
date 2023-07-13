import { Button, Grid, Link } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import styles from '../styles/sass-styles/styles.module.scss';
import NextLink from 'next/link';
import { getDescriptionOfContent, getFormattedDate } from '../utils/functions';
import parse from 'html-react-parser';
import apiUrl from '../utils/apiUrl';

export default function FeaturedPost({ post }) {
  const description = getDescriptionOfContent(
    post.plainText ? post.plainText : post.content,
    30
  );

  return (
    <div className={styles.featuredPost}>
      <Grid
        container
        spacing={6}
        alignItems="stretch"
        sx={{ flexWrap: 'wrap' }}
      >
        <Grid item>
          <Image
            width={620}
            height={380}
            src={
              post.image
                ? `${apiUrl}blog/image/${post.image.filename}`
                : '/sampleimage.jpg'
            }
            alt="Blog sample image"
            style={{ borderRadius: '10px' }}
            objectFit="cover"
          />
        </Grid>

        <Grid item xs>
          <p className={styles.featuredHeading}>FEATURED</p>
          <h1 className={styles.featuredPostTitleHeading}>{post.title}</h1>
          <p className={styles.featuredPostAuthor}>
            By{' '}
            {post.author ? (
              <NextLink href={`/user/${post.userId}`} passHref>
                <Link className={styles.featuredPostSelectAuthor}>
                  {post.author}
                </Link>
              </NextLink>
            ) : (
              'Unknown'
            )}{' '}
            | Published {getFormattedDate(post.date)}
          </p>
          <div className={styles.featuredPostDescription}>
            {parse(description)}
          </div>
          <br />
          <NextLink href={`/blogpost/${post.slug}`} passHref>
            <Link className={styles.readMore}>READ MORE</Link>
          </NextLink>
        </Grid>
      </Grid>
    </div>
  );
}
