import { Card, CardContent, CardMedia, Grid, Link } from '@mui/material';
import React from 'react';
import styles from '../styles/sass-styles/styles.module.scss';
import NextLink from 'next/link';
import Image from 'next/image';
import { getDescriptionOfContent, getFormattedDate } from '../utils/functions';
import parse from 'html-react-parser';
import apiUrl from '../utils/apiUrl';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PostCard({ post, userEdit }) {
  const description = getDescriptionOfContent(
    post.plainText ? post.plainText : post.content,
    30
  );

  return (
    <div className={styles.postCard}>
      {post && (
        <>
          <Card sx={{ width: 400, height: 220 }}>
            <Image
              src={
                post.image
                  ? `${apiUrl}blog/image/${post.image.filename}`
                  : '/sampleimage.jpg'
              }
              alt="sample image"
              width="400"
              height="220"
              objectFit="cover"
            />
          </Card>
          <div style={{ maxWidth: '400px' }}>
            <h2 className={styles.postCardTitle}>{post.title}</h2>
            <div>
              <p className={styles.postCardAuthor}>
                {userEdit ? (
                  <>Published {getFormattedDate(post.date)}</>
                ) : (
                  <>
                    By{' '}
                    {post.author ? (
                      <NextLink href={`/user/${post.userId}`} passHref>
                        <Link className={styles.postCardSelectAuthor}>
                          {post.author}
                        </Link>
                      </NextLink>
                    ) : (
                      'Unknown'
                    )}{' '}
                    | Published {getFormattedDate(post.date)}
                  </>
                )}
              </p>
            </div>

            <div className={styles.postCardDescription}>
              {parse(description)}
            </div>
            {/* <br />

            <div className={styles.postTagsDiv}>
              {post.tags?.length ? (
                post.tags.map((tag) => (
                  <p key={tag} className={styles.postTags}>
                    {tag}
                  </p>
                ))
              ) : (
                <></>
              )}
            </div> */}

            <br />
            {userEdit ? (
              <>
                <Grid container alignItems="center">
                  <Grid item>
                    <NextLink
                      href={`/blogpost/${post.slug || 'blog-post-1'}`}
                      passHref
                    >
                      <Link className={styles.postCardViewPost}>VIEW POST</Link>
                    </NextLink>
                  </Grid>

                  <Grid item>
                    <NextLink href={`/blogpost/edit?id=${post._id}`} passHref>
                      <Link className={styles.postCardEditPost}>EDIT POST</Link>
                    </NextLink>
                  </Grid>

                  <Grid item xs sx={{ textAlign: 'right' }}>
                    <NextLink href={`/blogpost/delete?id=${post._id}`} passHref>
                      <Link className={styles.postCardDeletePost}>
                        <DeleteIcon width="2rem" height="2rem" />
                      </Link>
                    </NextLink>
                  </Grid>
                </Grid>
              </>
            ) : (
              <NextLink
                href={`/blogpost/${post.slug || 'blog-post-1'}`}
                passHref
              >
                <Link className={styles.postCardReadMore}>READ MORE</Link>
              </NextLink>
            )}
          </div>
        </>
      )}
    </div>
  );
}
