import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/sass-styles/styles.module.scss';
import Image from 'next/image';
import { Button, CircularProgress, Grid, TextField } from '@mui/material';
import FileUploader from '../../components/FileUploader';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import blogService from '../services/blog.service';
import { useSnackbar } from 'notistack';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { Store } from '../../utils/Store';
import apiUrl from '../../utils/apiUrl';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

export default function EditPost() {
  const {
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm();
  const router = useRouter();
  const { id } = router.query;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [selectedFile, setSelectedFile] = useState();
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

            setValue('postTitle', blog.title);
            setValue('postContent', blog.content);
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
  }, [
    router.isReady,
    closeSnackbar,
    enqueueSnackbar,
    id,
    setValue,
    userInfo,
    router,
  ]);

  const handleFile = (file) => {
    setSelectedFile(file);
  };

  const onSubmit = async (data) => {
    closeSnackbar();
    if (userInfo) {
      const user = userInfo;
      if (user && user.userId) {
        const blog = {
          title: data.postTitle,
          content: data.postContent,
          image: selectedFile,
        };
        let formData = new FormData();
        formData.append('title', data.postTitle);
        formData.append('content', data.postContent);
        formData.append('dateUpdated', Date.now() / 1000);
        if (selectedFile)
          formData.append('photo', selectedFile, selectedFile.name);

        try {
          await blogService.editBlogPost(id, formData);

          enqueueSnackbar('Blog post successfully updated', {
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
      } else {
        enqueueSnackbar('Please login to edit blog posts', {
          variant: 'error',
        });
      }
    } else {
      enqueueSnackbar('Please login to edit blog posts', { variant: 'error' });
    }
  };

  return (
    <Layout title="Edit Blog Post">
      {blogData ? (
        <div className={styles.addPost}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6} justifyContent="center">
              <Grid item xs={11} sx={{ height: '100px' }}>
                <h2 className={styles.mainHeading}>Edit Post</h2>
              </Grid>
              <Grid item xs={4}>
                <div className={styles.uploadPostImage}>
                  <h2 className={styles.addPostLabels}>Post Image</h2>
                  <br />
                  <FileUploader
                    handleFile={handleFile}
                    image={
                      blogData.image
                        ? `${apiUrl}blog/image/${blogData.image.filename}`
                        : null
                    }
                  />
                </div>
              </Grid>

              <Grid item xs={7}>
                <h2 className={styles.addPostLabels}>Post Title</h2>
                <br />

                <Controller
                  name="postTitle"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Post title required' }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        id="outlined-blog-post-title-input"
                        fullWidth
                        label="Title"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        className={styles.textField}
                      />
                      <p className={styles.errorMessage}>
                        {error ? error.message : null}
                      </p>
                    </>
                  )}
                />

                <h2 className={styles.addPostLabels}>Post Content</h2>
                <br />
                <Controller
                  name="postContent"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Post content required',
                    validate: {
                      emptyValue: (v) => v.match('<p><br></p>'),
                    },
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    // <TextField
                    //   id="outlined-blog-post-content-input-multiline"
                    //   label="Content"
                    //   multiline
                    //   rows={20}
                    //   fullWidth
                    //   value={value}
                    //   onChange={onChange}
                    //   error={!!error}
                    //   helperText={error ? error.message : null}
                    //   className={styles.textField}
                    // />
                    <>
                      <SunEditor
                        id="outlined-blog-post-content-input-multiline"
                        label="Content"
                        setDefaultStyle="font-family: Fira Sans; font-size: 16px;"
                        setOptions={{
                          height: '600px',
                          minHeight: '600px',
                          maxHeight: '600px',
                          lineHeights: [
                            { text: 'Single', value: 1 },
                            { text: 'Double', value: 2 },
                          ],
                        }}
                        value={value}
                        onChange={onChange}
                        className={styles.textField}
                        defaultValue={blogData.content}
                      />
                      <p className={styles.errorMessage}>
                        {error
                          ? error.type === 'emptyValue'
                            ? 'Post content required'
                            : error.message
                          : null}
                      </p>
                    </>
                  )}
                />
                <div style={{ textAlign: 'right' }}>
                  <Button
                    className={styles.saveButton}
                    size="large"
                    sx={{ width: '160px', height: '50px' }}
                    type="submit"
                  >
                    Update
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress />
        </div>
      )}
    </Layout>
  );
}
