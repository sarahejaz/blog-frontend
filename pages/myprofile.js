import { Button, CircularProgress, Fab, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import styles from '../styles/sass-styles/styles.module.scss';
import { stringAvatar } from '../utils/functions';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import blogService from './services/blog.service';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';

const blogposts = [
  {
    id: 1,
    title: 'Blog Post Title 1',
    author: 'John Doe',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    date: '01-05-2022',
  },
  {
    id: 2,
    title: 'Blog Post Title 2',
    author: 'John Doe',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    date: '06-12-2022',
  },
  {
    id: 3,
    title: 'Blog Post Title 3',
    author: 'John Doe',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    date: '01-01-2022',
  },
  {
    id: 4,
    title: 'Blog Post Title 4',
    author: 'John Doe',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    date: '04-22-2022',
  },
];

export default function MyProfile() {
  const router = useRouter();

  const addPostPage = () => {
    router.push('/blogpost/add');
  };

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [userBlogs, setUserBlogs] = useState([]);

  const { state } = useContext(Store);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const { userInfo } = state;
    setUserData(userInfo);

    async function fetchData() {
      try {
        const user = userInfo;
        if (user && user.userId) {
          const blog = await blogService.getUserBlogs(user.userId);
          setUserBlogs(blog);
        }
      } catch (err) {
        enqueueSnackbar(err.response.data ? err.response.data.message : err, {
          variant: 'error',
        });
      }
    }

    fetchData();
  }, []);

  return (
    <Layout title="My Profile">
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
                  <Button className={styles.createPost} onClick={addPostPage}>
                    <AddIcon />
                    &nbsp;&nbsp;Create post
                  </Button>

                  <Grid container justifyContent="center" alignItems="center">
                    <Grid item xs>
                      <h2 className={styles.myPostsHeading}>My Blog Posts</h2>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={4}
                    justifyContent="flex-start"
                    className={styles.gridDisplay}
                  >
                    {userBlogs.length ? (
                      userBlogs.map((blogpost) => (
                        <Grid item key={blogpost.id} xs>
                          <PostCard post={blogpost} userEdit={true} />
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs>
                        <p style={{ marginLeft: '10px' }}>No blog posts yet</p>
                      </Grid>
                    )}
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
