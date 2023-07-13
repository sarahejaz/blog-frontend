import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import styles from '../styles/sass-styles/styles.module.scss';
import Typography from '@mui/material/Typography';
import FeaturedPost from '../components/FeaturedPost';
import PostCard from '../components/PostCard';
import { Box, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import blogService from './services/blog.service';
import { getDescriptionOfContent, getFormattedDate } from '../utils/functions';
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

export default function Home() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const allBlogs = await blogService.getAllBlogs();
        setBlogs(allBlogs);
      } catch (err) {
        enqueueSnackbar(err.response.data ? err.response.data.message : err, {
          variant: 'error',
        });
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <Head>
        <title>Blog</title>
        <meta name="description" content="Blog posts" />
      </Head>
      <Layout title="Blog">
        <div className={styles.home}>
          <br /> <br /> <br />
          {blogs.length ? <FeaturedPost post={blogs[0]} /> : null}
          <br /> <br /> <br /> <br /> <br />
          <Grid
            container
            spacing={4}
            justifyContent="center"
            className={styles.gridDisplay}
          >
            {blogs.map((blogpost) => (
              <Grid item key={blogpost._id}>
                <PostCard post={blogpost} />
              </Grid>
            ))}
          </Grid>
        </div>
      </Layout>
    </div>
  );
}
