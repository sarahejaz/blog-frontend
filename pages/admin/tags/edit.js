import { Grid, Tab, Tabs, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState, useContext, useEffect } from 'react';
import Layout from '../../../components/Layout';
import styles from '../../../styles/sass-styles/styles.module.scss';
import { Store } from '../../../utils/Store';
import { Controller, useForm } from 'react-hook-form';

const tabValues = {
  users: 0,
  blogposts: 1,
  blogtags: 2,
};

export default function EditTagsAdmin() {
  const {
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm();

  const { state } = useContext(Store);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { tagid } = router.query;

  useEffect(() => {
    const { userInfo } = state;
    setUser(userInfo);

    if (userInfo) {
      if (userInfo.role !== 'admin') {
        router.push('/');
        return;
      }
    }
  }, [router, state]);

  return (
    <Layout title="Edit Tag - Admin Dashboard">
      <div className={styles.editTagPage}>
        <h2>Admin Dashboard</h2>
        <h3>Edit Tag</h3>

        <div>
          <TextField className={styles.textField}></TextField>
        </div>
      </div>
    </Layout>
  );
}
