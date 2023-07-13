import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import styles from '../styles/sass-styles/styles.module.scss';
import apiUrl from '../utils/apiUrl';
import { getFormattedDate } from '../utils/functions';
import parse from 'html-react-parser';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import { Link } from '@mui/material';

export default function BlogPostDisplay({ blog }) {
  const [displayAuthor, setDisplayAuthor] = useState(true);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      if (userInfo.userId === blog.userId) {
        setDisplayAuthor(false);
      }
    }
  }, []);

  return (
    <div className={styles.blogPostPageMain}>
      <h1 className={styles.blogPostTitleHeading}>{blog.title}</h1>
      <p className={styles.blogPostAuthorHeading}>
        By{' '}
        {blog.author ? (
          displayAuthor ? (
            <NextLink href={`/user/${blog.userId}`} passHref>
              <Link className={styles.blogPostAuthorLink}>{blog.author}</Link>
            </NextLink>
          ) : (
            <>
              <NextLink href={`/myprofile`} passHref>
                <Link className={styles.blogPostAuthorLink}>{blog.author}</Link>
              </NextLink>{' '}
              (Me)
            </>
          )
        ) : (
          'Unknown'
        )}{' '}
        | Published {getFormattedDate(blog.date)}
      </p>
      <br />

      <Image
        width="900px"
        height="500px"
        src={
          blog.image
            ? `${apiUrl}blog/image/${blog.image.filename}`
            : '/sampleimage.jpg'
        }
        alt="sample image"
        objectFit="cover"
      />

      <div className={styles.blogPostTextDiv}>{parse(blog.content)}</div>

      <br />
      <div className={styles.blogPostTags}>
        <h2>Tags</h2>
        {blog.tags?.length ? (
          blog.tags.map((tag) => (
            <p key={tag} className={styles.tagDisplayChip}>
              {tag}
            </p>
          ))
        ) : (
          <>None</>
        )}
      </div>
    </div>
  );
}
