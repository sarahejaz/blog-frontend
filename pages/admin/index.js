import { Grid, Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState, useContext, useEffect } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/sass-styles/styles.module.scss';
import { Store } from '../../utils/Store';
import BlogsAdmin from './blogs-admin';
import TagsAdmin from './tags-admin';
import UsersAdmin from './users-admin';

const tabValues = {
  users: 0,
  blogposts: 1,
  blogtags: 2,
};

export default function AdminDashboard() {
  const [value, setValue] = useState(0);

  const { state } = useContext(Store);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { tab } = router.query;

  useEffect(() => {
    const { userInfo } = state;
    setUser(userInfo);

    if (userInfo) {
      if (userInfo.role !== 'admin') {
        router.push('/');
        return;
      }
    }

    if (tab) {
      setValue(tabValues[tab]);
    }
  }, [router, state, tab]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Layout title="Admin Dashboard">
      <div className={styles.adminDashboard}>
        <h2>Admin Dashboard</h2>
        {/* <Grid container spacing={4} alignItems="top">
          <Grid item xs={6} sm={3}>
            <Tabs
              textColor="inherit"
              orientation="vertical"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab label="Users" className={styles.adminTab} />
              <Tab label="Blog Posts" className={styles.adminTab} />
              <Tab label="Blog Tags" className={styles.adminTab} />
            </Tabs>
          </Grid>

          <Grid item xs>
            {value === 0 && <UsersAdmin />}
            {value === 1 && (
              <BlogsAdmin
                admin={user ? (user.role === 'admin' ? true : false) : false}
              />
            )}
            {value === 2 && <TagsAdmin />}
          </Grid>
        </Grid> */}

        <Tabs
          textColor="inherit"
          orientation="horizontal"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Users" className={styles.adminTab} />
          <Tab label="Blog Posts" className={styles.adminTab} />
          <Tab label="Blog Tags" className={styles.adminTab} />
        </Tabs>

        <div className={styles.tabContents}>
          {value === 0 && <UsersAdmin />}
          {value === 1 && (
            <BlogsAdmin
              admin={user ? (user.role === 'admin' ? true : false) : false}
            />
          )}
          {value === 2 && <TagsAdmin />}
        </div>
      </div>
    </Layout>
  );
}
