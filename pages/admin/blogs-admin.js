import { Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import PostCard from '../../components/PostCard';
import UserCard from '../../components/UserCard';
import styles from '../../styles/sass-styles/styles.module.scss';
import blogService from '../services/blog.service';

export default function BlogsAdmin({ admin }) {
  const [blogs, setBlogs] = useState([]);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    async function fetchData() {
      try {
        const getBlogs = await blogService.getAllBlogs();
        setBlogs(getBlogs);
      } catch (err) {
        enqueueSnackbar(err.response.data ? err.response.data.message : err, {
          variant: 'error',
        });
      }
    }

    fetchData();
  }, [enqueueSnackbar]);

  return (
    <div className={styles.blogsAdmin}>
      <h1 className={styles.usersAdminHeading}>Blogs</h1>

      <Grid
        container
        spacing={2}
        justifyContent="flex-start"
        sx={{ paddingLeft: '20px', paddingRight: '40px' }}
      >
        {blogs.length ? (
          blogs.map((blog) => (
            <PostCard key={blog._id} post={blog} userEdit={admin} />
          ))
        ) : (
          <Grid item xs>
            <div className={styles.noBlogsFound}>
              <p>No blogs</p>
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
