import { Button, Dialog, Grid, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import PostCard from '../../components/PostCard';
import UserCard from '../../components/UserCard';
import styles from '../../styles/sass-styles/styles.module.scss';
import blogService from '../services/blog.service';
import miscService from '../services/misc.service';
import adminService from '../services/admin.service';
import { Controller, useForm } from 'react-hook-form';

export default function TagsAdmin({ admin }) {
  const [tags, setTags] = useState([]);
  const [focusTag, setFocusTag] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const handleCloseEdit = () => {
    setFocusTag('');
    setOpenEdit(false);
  };
  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };
  const [openDelete, setOpenDelete] = useState(false);
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setFocusTag('');
  };
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const {
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const updateAllTags = async () => {
    try {
      const getTags = await miscService.getAllTags();
      setTags(getTags);
    } catch (err) {
      enqueueSnackbar(err.response.data ? err.response.data.message : err, {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    setValue('tagName', focusTag.tagName);
    async function fetchData() {
      try {
        const getTags = await miscService.getAllTags();
        setTags(getTags);
      } catch (err) {
        enqueueSnackbar(err.response.data ? err.response.data.message : err, {
          variant: 'error',
        });
      }
    }

    fetchData();
  }, [enqueueSnackbar, focusTag, setValue]);

  const onSubmitEdit = async (data) => {
    setFocusTag('');
    if (data.tagName) {
      if (data.tagName.toLowerCase() !== focusTag.tagName.toLowerCase()) {
        try {
          await adminService.editTag(focusTag._id, data.tagName);
          handleCloseEdit();
          updateAllTags();
        } catch (err) {
          enqueueSnackbar(err.response.data ? err.response.data.message : err, {
            variant: 'error',
          });
        }
      } else {
        handleCloseEdit();
      }
    } else {
      handleCloseEdit();
      updateAllTags();
    }
  };

  const onSubmitDelete = async (data) => {
    try {
      await adminService.deleteTag(focusTag._id);
      handleCloseEdit();
      updateAllTags();
    } catch (err) {
      enqueueSnackbar(err.response.data ? err.response.data.message : err, {
        variant: 'error',
      });
    }
  };

  return (
    <div className={styles.tagsAdmin}>
      <div className={styles.tagHeadingAndAddButton}>
        <h1 className={styles.tagHeading}>Tags</h1>
        <Button className={styles.addTag}>Add Tag</Button>
      </div>
      <Grid
        container
        spacing={2}
        justifyContent="flex-start"
        sx={{ paddingLeft: '20px', paddingRight: '20px' }}
      >
        {/* {tags.length ? (
          <Grid
            container
            spacing={2}
            justifyContent="flex-start"
            sx={{ paddingLeft: '20px', paddingRight: '40px' }}
          >
            <Grid item xs>
              {tags.map((tag) => (
                <p key={tag._id}>{tag.tagName}</p>
              ))}
            </Grid>

            <Grid item xs>
              Add Tag
            </Grid>
          </Grid>
        ) : (
          <Grid item xs>
            <div className={styles.noBlogsFound}>
              <p>No tags</p>
            </div>
          </Grid>
        )} */}

        {tags.length ? (
          <Grid item xs>
            <div className={styles.main}>
              {tags.map((tag) => (
                <div key={tag._id} className={styles.tagDisplay}>
                  <div className={styles.tagName}>
                    <div className={styles.text}>{tag.tagName}</div>
                  </div>
                  <div className={styles.buttons}>
                    <Button
                      className={styles.editButton}
                      onClick={() => {
                        setFocusTag(tag);
                        handleClickOpenEdit();
                      }}
                      /*href={`/admin/tags/edit?tagid=${tag._id}`}*/
                    >
                      Edit
                    </Button>
                    <Button className={styles.deleteButton}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </Grid>
        ) : (
          <Grid item xs>
            <div className={styles.noBlogsFound}>
              <p>No tags</p>
            </div>
          </Grid>
        )}
      </Grid>

      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <div className={styles.dialogContent}>
          <h2>Edit tag</h2>
          {focusTag ? (
            <form onSubmit={handleSubmit(onSubmitEdit)}>
              <Controller
                name="tagName"
                control={control}
                rules={{
                  required: 'Tag name required',
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <TextField
                      id="outlined-tag-name-input"
                      className={styles.textField}
                      //defaultValue={focusTag.tagName}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                    <p className={styles.errorMessage}>
                      {error ? error.message : null}
                    </p>
                  </>
                )}
              />
              <div className={styles.buttonRow}>
                <Button className={styles.saveButton} type="submit">
                  Save
                </Button>
                <Button
                  className={styles.cancelButtonEdit}
                  onClick={() => {
                    setOpenEdit(false);
                    setFocusTag('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <></>
          )}
        </div>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <div className={styles.dialogContent}>
          <h2>Edit tag</h2>
          {focusTag ? (
            <form onSubmit={handleSubmit(onSubmitEdit)}>
              <Controller
                name="tagName"
                control={control}
                defaultValue={focusTag.tagName}
                rules={{
                  required: 'Tag name required',
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <TextField
                      id="outlined-tag-name-input"
                      className={styles.textField}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                    <p className={styles.errorMessage}>
                      {error ? error.message : null}
                    </p>
                  </>
                )}
              />
              <div className={styles.buttonRow}>
                <Button className={styles.editButton} type="submit">
                  Save
                </Button>
                <Button
                  className={styles.cancelButton}
                  onClick={() => {
                    setOpenEdit(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <></>
          )}
        </div>
      </Dialog>
    </div>
  );
}
