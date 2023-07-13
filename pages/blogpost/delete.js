import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/sass-styles/styles.module.scss';
import Image from 'next/image';
import { Alert, Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Store } from '../../utils/Store';
import blogService from '../services/blog.service';
import { getFormattedDate } from '../../utils/functions';
import parse from 'html-react-parser';
import apiUrl from '../../utils/apiUrl';
import BlogPostDisplay from '../../components/BlogPostDisplay';

export default function DeletePost() {
  const router = useRouter();
  const { id } = router.query;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      router.push('/');
      return;
    } else {
      if (router.isReady) {
        closeSnackbar();
        async function fetchData() {
          try {
            const blog = await blogService.getBlogPostById(id);
            if (userInfo.userId !== blog.userId && userInfo.role !== 'admin') {
              enqueueSnackbar('Forbidden resource', {
                variant: 'error',
              });
              router.push('/');
              return;
            }
            setBlogData(blog);
          } catch (err) {
            enqueueSnackbar(
              err.response.data
                ? err.response.data.message
                : 'Error while getting blog data',
              {
                variant: 'error',
              }
            );
          }
        }

        fetchData();
      }
    }
  }, [closeSnackbar, enqueueSnackbar, id, router, userInfo]);

  const onClickDelete = async () => {
    try {
      await blogService.deleteBlog(id);

      enqueueSnackbar('Blog post successfully deleted', {
        variant: 'success',
      });

      setTimeout(function () {
        closeSnackbar();
        router.push('/myprofile');
      }, 2000);
    } catch (err) {
      enqueueSnackbar(err.response.data ? err.response.data.message : err, {
        variant: 'error',
      });
    }
  };

  return (
    <div>
      <Layout title="Delete Blog Post">
        <div className={styles.deleteBlogPostPage}>
          <div className={styles.deleteAlert}>
            Are you sure you want to delete this post?
            <br />
            <Button
              className={styles.deleteButton}
              onClick={() => {
                onClickDelete();
              }}
            >
              Delete
            </Button>
            <Button
              className={styles.goBackButton}
              onClick={() => {
                router.back();
              }}
            >
              Go Back
            </Button>
          </div>
          {blogData ? (
            <>
              <BlogPostDisplay blog={blogData} />
            </>
          ) : (
            <CircularProgress />
          )}
        </div>
      </Layout>
    </div>
  );
}
