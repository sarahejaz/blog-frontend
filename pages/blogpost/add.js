import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/sass-styles/styles.module.scss';
import Image from 'next/image';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import FileUploader from '../../components/FileUploader';
import { Controller, useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import blogService from '../services/blog.service';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { Store } from '../../utils/Store';
import miscService from '../services/misc.service';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

export default function AddPost() {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [selectedFile, setSelectedFile] = useState();
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    setUser(userInfo);

    if (!userInfo) {
      router.push('/');
      return;
    }

    async function fetchData() {
      try {
        const allTags = await miscService.getAllTags();
        setTags(allTags);
      } catch (err) {
        enqueueSnackbar(err.response.data ? err.response.data.message : err, {
          variant: 'error',
        });
      }
    }

    fetchData();
  }, [enqueueSnackbar, router, userInfo]);

  const handleFile = (file) => {
    setSelectedFile(file);
  };

  const onSubmit = async (data) => {
    closeSnackbar();
    //console.log(data);
    if (userInfo) {
      const user = userInfo;
      if (user && user.userId) {
        const blog = {
          title: data.postTitle,
          content: data.postContent,
          image: selectedFile,
          date: Date.now() / 1000,
          userId: user.userId,
        };
        let formData = new FormData();
        formData.append('title', data.postTitle);
        formData.append('content', data.postContent);
        if (selectedFile)
          formData.append('photo', selectedFile, selectedFile.name);
        formData.append('date', Date.now() / 1000);
        formData.append('userId', user.userId);
        //formData.set('tags', data.postTags);

        for (let i = 0; i < data.postTags.length; i++) {
          formData.append('tags[]', data.postTags[i]);
        }

        try {
          await blogService.addBlogPost(formData);

          enqueueSnackbar('Blog post successfully created', {
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
        enqueueSnackbar('Please login to add blog posts', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Please login to add blog posts', { variant: 'error' });
    }
  };

  return (
    <Layout title="Add Blog Post">
      {user ? (
        <div className={styles.addPost}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={11} sx={{ height: '100px' }}>
                <h2 className={styles.mainHeading}>Add a Post</h2>
              </Grid>
              <Grid item xs={4}>
                <div className={styles.uploadPostImage}>
                  <h2 className={styles.addPostLabels}>Post Cover Image</h2>
                  <br />
                  <Controller
                    name="postImage"
                    control={control}
                    defaultValue=""
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => <FileUploader handleFile={handleFile} />}
                  />

                  {/* {selectedFile && (
                  <Image
                    src={selectedFile}
                    alt="preview"
                    width="400"
                    height="220"
                    objectFit="cover"
                  />
                )} */}
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
                <div>
                  <h2 className={styles.addPostLabels}>Post Tags</h2>
                  <br />
                  {tags ? (
                    <Controller
                      name="postTags"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Post tags required' }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={[...value]}
                            onChange={(e) => {
                              onChange(e.target.value);
                              console.log('e.target.value = ', e.target.value);
                            }}
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                className={styles.textField}
                                fullWidth
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip
                                    key={value}
                                    label={value}
                                    className={styles.tagChip}
                                  />
                                ))}
                              </Box>
                            )}
                          >
                            {tags.map((tag) => (
                              <MenuItem
                                key={tag._id}
                                value={tag.tagName}
                                className={styles.tagsDropdownMenu}
                              >
                                <p className={styles.nameMenu}>{tag.tagName}</p>
                              </MenuItem>
                            ))}
                          </Select>
                          <p className={styles.errorMessage}>
                            {error ? error.message : null}
                          </p>
                        </>
                      )}
                    />
                  ) : null}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Button
                    className={styles.saveButton}
                    size="large"
                    sx={{ width: '160px', height: '50px' }}
                    type="submit"
                  >
                    Publish
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
