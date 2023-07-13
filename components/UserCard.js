import { Card, CardContent, CardMedia, Grid, Link } from '@mui/material';
import React from 'react';
import styles from '../styles/sass-styles/styles.module.scss';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  getDescriptionOfContent,
  getFormattedDate,
  stringAvatar,
} from '../utils/functions';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UserCard({ user, onClickDelete }) {
  return (
    <div className={styles.userCard}>
      {user && (
        <>
          <div style={{ maxWidth: '400px' }}>
            <Grid
              container
              spacing={4}
              className={styles.topPart}
              alignItems="stretch"
            >
              <Grid item xs={3}>
                <div className={styles.profilePhoto}>
                  {stringAvatar(user.firstName)}
                </div>
              </Grid>

              <Grid item xs={9}>
                <div>
                  <p className={styles.profileFullName}>
                    {user.firstName + ' ' + user.lastName}
                  </p>
                  <p className={styles.profileEmail}>{user.email}</p>
                </div>
              </Grid>
            </Grid>

            <br />

            <Grid container alignItems="center">
              <Grid item>
                <NextLink href={`/user/${user._id}`} passHref>
                  <Link className={styles.postCardViewPost}>VIEW USER</Link>
                </NextLink>
              </Grid>

              <Grid item xs sx={{ textAlign: 'right' }}>
                {/* <NextLink href={`/`} passHref>
                  <Link className={styles.postCardDeletePost}> */}
                <DeleteIcon
                  width="2rem"
                  height="2rem"
                  onClick={() => {
                    onClickDelete();
                  }}
                  sx={{
                    cursor: 'pointer',
                  }}
                />
                {/* </Link>
                </NextLink> */}
              </Grid>
            </Grid>
          </div>
        </>
      )}
    </div>
  );
}
