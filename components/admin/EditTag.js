import { Button, Dialog, TextField } from '@mui/material';
import React from 'react';
import styles from '../styles/sass-styles/styles.module.scss';
import { Controller, useForm } from 'react-hook-form';

export default function EditTag({ props }) {
  const [openEdit, setOpenEdit] = useState(props.open);
  const handleCloseEdit = () => {
    setFocusTag('');
    setOpenEdit(false);
  };
  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };

  return (
    <div>
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
                      defaultValue={focusTag.tagName}
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
    </div>
  );
}
