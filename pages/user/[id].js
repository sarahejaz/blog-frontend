import { Button, CircularProgress, Fab, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import PostCard from '../../components/PostCard';
import styles from '../../styles/sass-styles/styles.module.scss';
import { stringAvatar } from '../../utils/functions';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import blogService from '../services/blog.service';
import { Store } from '../../utils/Store';
import { useSnackbar } from 'notistack';
import userService from '../services/user.service';

export default function UserProfile() {
  const router = useRouter();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [userBlogs, setUserBlogs] = useState([]);

  const { state } = useContext(Store);
  const [userData, setUserData] = useState(null);

  const { id } = router.query;

  useEffect(() => {
    if (router.isReady) {
      async function fetchData() {
        try {
          const user = await userService.profileById(id);
          setUserData(user);
          console.log(user);

          const blogs = await blogService.getUserBlogs(id);
          setUserBlogs(blogs);
        } catch (err) {
          enqueueSnackbar(err.response.data ? err.response.data.message : err, {
            variant: 'error',
          });
        }
      }

      fetchData();
    }
  }, [enqueueSnackbar, id, router.isReady]);

  return (
    <Layout title="User Profile">
      {userData ? (
        <div className={styles.myProfileMain}>
          <div className={styles.myProfileHeader}>
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item xs>
                {userData && userData.role === 'admin' && (
                  <h3 className={styles.adminHeading}>ADMIN</h3>
                )}
                <div className={styles.myProfilePhoto}>
                  {stringAvatar(userData.firstName)}
                </div>
                <h1 className={styles.myProfileName}>
                  {userData.firstName + ' ' + userData.lastName}
                </h1>
                <p className={styles.myProfileEmail}>{userData.email}</p>
              </Grid>
              <Grid item xs={9}>
                <div className={styles.myProfilePosts}>
                  <Grid container justifyContent="center" alignItems="center">
                    <Grid item xs>
                      <h2 className={styles.myPostsHeading}>
                        {userData.firstName}&apos;s Blog Posts
                      </h2>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={4}
                    justifyContent="flex-start"
                    className={styles.gridDisplay}
                  >
                    {userBlogs.map((blogpost) => (
                      <Grid item key={blogpost.id} xs>
                        <PostCard post={blogpost} />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </div>
          {/* <Fab
          variant="extended"
          color="primary"
          aria-label="add"
          className={styles.fab}
          onClick={addPostPage}
        >
          <AddIcon />
          &nbsp;&nbsp;Create post
        </Fab> */}
          {/* <div className={styles.myProfilePosts}>
          <h2 className={styles.myPostsHeading}>My Posts</h2>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            className={styles.gridDisplay}
          >
            {blogposts.map((blogpost) => (
              <Grid item key={blogpost.id}>
                <PostCard post={blogpost} />
              </Grid>
            ))}
            {blogposts.map((blogpost) => (
              <Grid item key={blogpost.id}>
                <PostCard post={blogpost} />
              </Grid>
            ))}
          </Grid>
        </div> */}
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress />
        </div>
      )}
    </Layout>
  );
}
