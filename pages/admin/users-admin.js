import { Button, Dialog, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import UserCard from '../../components/UserCard';
import styles from '../../styles/sass-styles/styles.module.scss';
import { stringAvatar } from '../../utils/functions';
import adminService from '../services/admin.service';

export default function UsersAdmin() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [users, setUsers] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [delUser, setDelUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const getUsers = await adminService.getAllUsers();
        setUsers(getUsers);
      } catch (err) {
        enqueueSnackbar(err.response.data ? err.response.data.message : err, {
          variant: 'error',
        });
      }
    }

    fetchData();
  }, [enqueueSnackbar]);

  return (
    <div className={styles.usersAdmin}>
      <h1 className={styles.usersAdminHeading}>Users</h1>

      <Grid
        container
        spacing={2}
        justifyContent="flex-start"
        sx={{ paddingLeft: '20px', paddingRight: '20px' }}
      >
        {users.length ? (
          users.map((u) => (
            <UserCard
              key={u._id}
              user={u}
              onClickDelete={() => {
                setOpenDelete(true);
                setDelUser(u);
              }}
            />
          ))
        ) : (
          <Grid item xs>
            <div className={styles.noBlogsFound}>
              <p>No users</p>
            </div>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}
      >
        <div className={styles.userCard} style={{ width: '400px' }}>
          <h2>Are you sure you want to delete this user?</h2>
          <br />
          {delUser ? (
            <div>
              <Grid
                container
                spacing={4}
                className={styles.topPart}
                alignItems="stretch"
              >
                <Grid item xs={3}>
                  <div className={styles.profilePhoto}>
                    {stringAvatar(delUser.firstName)}
                  </div>
                </Grid>

                <Grid item xs={9}>
                  <div>
                    <p className={styles.profileFullName}>
                      {delUser.firstName + ' ' + delUser.lastName}
                    </p>
                    <p className={styles.profileEmail}>{delUser.email}</p>
                  </div>
                </Grid>
              </Grid>
              <br />
              <p className={styles.profileRole}>
                <strong>ID: </strong>
                {delUser._id}
              </p>
              <p className={styles.profileRole}>
                <strong>Role: </strong>
                {delUser.role}
              </p>
              <div style={{ textAlign: 'center' }}>
                <Button className={styles.deleteButton}>Delete</Button>
                <Button
                  className={styles.cancelButton}
                  onClick={() => {
                    setOpenDelete(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Dialog>
    </div>
  );
}
