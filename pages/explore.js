import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import blogService from './services/blog.service';
import styles from '../styles/sass-styles/styles.module.scss';
import SearchIcon from '@mui/icons-material/Search';
import { Controller, useForm } from 'react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import miscService from './services/misc.service';

export default function Explore() {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAsc, setSelectAsc] = useState(false);
  const [selectDesc, setSelectDesc] = useState(false);
  const [searchLoading, setSearchLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const allBlogs = await blogService.getAllBlogs();
        setBlogs(allBlogs);
        const allTags = await miscService.getAllTags();
        setTags(allTags);
        setSearchLoading(false);
      } catch (err) {
        enqueueSnackbar(err.response.data ? err.response.data.message : err, {
          variant: 'error',
        });
      }
    }

    fetchData();
  }, [enqueueSnackbar]);

  const setAllBlogsDefault = async () => {
    if (searchQuery) {
      const searchBlogs = await blogService.searchBlogs({
        searchQuery: searchQuery,
      });
      setBlogs(searchBlogs);
    } else {
      const allBlogs = await blogService.getAllBlogs();
      setBlogs(allBlogs);
    }
    setSearchLoading(false);
  };

  const setAllBlogsDefaultAndReset = async () => {
    setSelectAsc(false);
    setSelectDesc(false);
    setSelectedTags([]);
    setAllBlogsDefault();
  };

  const onSubmit = async (data) => {
    setSearchLoading(true);
    setSelectAsc(false);
    setSelectDesc(false);
    setAllBlogsDefault();
  };

  const onSubmitRefineSearch = async (data) => {
    // const searchBlogs = await blogService.searchBlogs(
    //   data.searchQuery,
    //   'dateascending'
    // );
    // setBlogs(searchBlogs);
    // console.log(data);
    // console.log('selected tags =', selectedTags);

    let tagsString = '';
    for (let i = 0; i < selectedTags.length; i++) {
      tagsString += selectedTags[i] + ',';
    }

    tagsString = tagsString.slice(0, -1);

    let sortType = '';
    if (selectAsc) sortType = 'dateascending';
    if (selectDesc) sortType = 'datedescending';

    const searchBlogs = await blogService.searchBlogs({
      searchQuery: searchQuery,
      sortType: sortType,
      tags: tagsString,
    });
    setBlogs(searchBlogs);
  };

  const sortBySelected = async (sortType) => {
    if (sortType.match('dateascending')) {
      setSelectAsc(true);
      setSelectDesc(false);
    } else if (sortType.match('datedescending')) {
      setSelectAsc(false);
      setSelectDesc(true);
    }

    let obj = {
      sortType: sortType,
    };

    if (searchQuery) obj.searchQuery = searchQuery;

    if (selectedTags.length) {
      let tagsString = '';
      for (let i = 0; i < selectedTags.length; i++) {
        tagsString += selectedTags[i] + ',';
      }

      tagsString = tagsString.slice(0, -1);

      obj.tags = tagsString;
    }

    const searchBlogs = await blogService.searchBlogs(obj);
    setBlogs(searchBlogs);
  };

  const onClickClear = async () => {
    setSearchQuery('');
    const allBlogs = await blogService.getAllBlogs();
    setBlogs(allBlogs);
  };

  return (
    <div>
      <Head>
        <title>Explore</title>
        <meta name="description" content="Explore and search blog posts" />
      </Head>
      <Layout title="Explore">
        <div className={styles.explore}>
          <Grid
            container
            spacing={1}
            justifyContent="center"
            sx={{ margin: '0 auto' }}
          >
            <Grid item xs={11}>
              <h2 className={styles.exploreTitle}>Explore</h2>
              <br />
            </Grid>

            <Grid item xs={11}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={7}>
                    {/* <Controller
                      name="searchQuery"
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            id="search-blog-post-input"
                            label="Search"
                            fullWidth
                            className={styles.searchTextField}
                            onChange={(e) => {
                              onChange(e);
                              console.log('e -> ', e);
                              setSearchQuery(e.target.value);
                            }}
                            value={value}
                          ></TextField>
                          <p className={styles.errorMessage}>
                            {error ? error.message : null}
                          </p>
                        </>
                      )}
                    /> */}

                    <Controller
                      name="searchQuery"
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <OutlinedInput
                            id="outlined-adornment-search"
                            className={styles.searchTextField}
                            placeholder="Search"
                            fullWidth
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                              onChange(e);
                              setSearchQuery(e.target.value);
                            }}
                            endAdornment={
                              searchQuery.length ? (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="clear search"
                                    edge="end"
                                    onClick={() => {
                                      onClickClear();
                                    }}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </InputAdornment>
                              ) : (
                                <></>
                              )
                            }
                          />
                          {/* <p className={styles.errorMessage}>
                            {error ? error.message : null}
                          </p> */}
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button className={styles.searchButton} type="submit">
                      {searchLoading ? (
                        <CircularProgress sx={{ color: 'white' }} size="30px" />
                      ) : (
                        <SearchIcon fontSize="large" />
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
              <br />
              <br />
            </Grid>

            <Grid
              container
              spacing={2}
              justifyContent="center"
              sx={{ margin: '0 auto', width: '90%' }}
            >
              <Grid item>
                <div className={styles.refineSearch}>
                  <form onSubmit={handleSubmit(onSubmitRefineSearch)}>
                    <h3>Sort By</h3>

                    <Grid container alignItems="center">
                      <Grid item>
                        {/* <Controller
                        name="sortByDate"
                        control={control}
                        defaultValue={false}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <>
                            <Checkbox
                              label="Date"
                              id="search-blog-date-checkbox"
                              onChange={onChange}
                              value={value}
                            />
                          </>
                        )}
                      /> */}
                        <Button
                          className={styles.sortByButton}
                          style={{ fontWeight: selectAsc ? 'bold' : 'normal' }}
                          onClick={() => sortBySelected('dateascending')}
                        >
                          Date ascending
                        </Button>
                        <br />
                        <Button
                          className={styles.sortByButton}
                          style={{ fontWeight: selectDesc ? 'bold' : 'normal' }}
                          onClick={() => sortBySelected('datedescending')}
                        >
                          Date descending
                        </Button>
                      </Grid>
                    </Grid>

                    <h3>Filter by Tags</h3>
                    <Controller
                      name="postTags"
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            sx={{ width: '300px' }}
                            value={[...selectedTags]}
                            onChange={(e) => {
                              onChange(e.target.value);
                              setSelectedTags(e.target.value);
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
                        </>
                      )}
                    />

                    <div style={{ textAlign: 'center', marginTop: '14px' }}>
                      <Button className={styles.applyButton} type="submit">
                        Apply
                      </Button>
                      <Button
                        className={styles.resetButton}
                        onClick={() => {
                          setAllBlogsDefaultAndReset();
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </div>
              </Grid>

              <Grid item xs>
                <Grid
                  container
                  spacing={4}
                  justifyContent="left"
                  className={styles.gridDisplay}
                >
                  {blogs.length ? (
                    blogs.map((blogpost) => (
                      <Grid item key={blogpost._id}>
                        <PostCard post={blogpost} />
                      </Grid>
                    ))
                  ) : searchLoading === true ? (
                    <Grid item xs sx={{ textAlign: 'center' }}>
                      <CircularProgress />
                    </Grid>
                  ) : (
                    <Grid item xs>
                      <div className={styles.noBlogsFound}>
                        <p>No blogs found</p>
                      </div>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  );
}
