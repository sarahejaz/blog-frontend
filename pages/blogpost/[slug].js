import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/sass-styles/styles.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import blogService from '../services/blog.service';
import { CircularProgress } from '@mui/material';
import { getFormattedDate } from '../../utils/functions';
import parse from 'html-react-parser';
import apiUrl from '../../utils/apiUrl';
import { useSnackbar } from 'notistack';
import BlogPostDisplay from '../../components/BlogPostDisplay';

export default function BlogPostPage() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      async function fetchData() {
        try {
          const _blog = await blogService.getBlogPostBySlug(slug);
          console.log(_blog);
          setBlog(_blog);
        } catch (err) {
          enqueueSnackbar(err.response.data ? err.response.data.message : err, {
            variant: 'error',
          });
        }
      }

      fetchData();
    }
  }, [enqueueSnackbar, router.isReady, slug]);

  return (
    <div>
      <Layout title="Blog Post">
        {blog ? (
          <BlogPostDisplay blog={blog} />
        ) : (
          <div className={styles.blogPostNotFound}>
            {/* Blog post not found */}
            <CircularProgress />
          </div>
        )}
      </Layout>
    </div>
  );
}
