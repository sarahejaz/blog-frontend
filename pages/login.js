import React, { useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/sass-styles/styles.module.scss';
import Image from 'next/image';
import { Button, Grid, TextField, Link } from '@mui/material';
import FileUploader from '../components/FileUploader';
import { Controller, useForm } from 'react-hook-form';
import NextLink from 'next/link';
import url from '../utils/apiUrl';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import authService from './services/auth.service';

export default function Login() {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const { redirect } = router.query;

  const handleFile = (file) => {
    console.log(file);
  };

  const onSubmit = async ({ email, password }) => {
    closeSnackbar();
    try {
      const data = await authService.login(email, password);

      enqueueSnackbar('Login successful', {
        variant: 'success',
      });

      setTimeout(function () {
        closeSnackbar();
        dispatch({ type: 'USER_LOGIN', payload: data });
        Cookies.set('userInfo', JSON.stringify(data));
        router.push(redirect || '/');
      }, 2000);
    } catch (err) {
      if (err.response?.data?.message)
        enqueueSnackbar(err.response?.data?.message, { variant: 'error' });
      else
        enqueueSnackbar('Internal server error. Please try again later', {
          variant: 'error',
        });
    }
  };

  return (
    <Layout title="Login">
      <div className={styles.login}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className={styles.signupHeading}>Login</h1>
          <h2 className={styles.signupLabels}>Email</h2>
          <br />
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: 'Email required',
              pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  id="outlined-login-email-input"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  className={styles.textField}
                />
                <p className={styles.errorMessage}>
                  {error
                    ? error.type === 'pattern'
                      ? 'Email is not valid'
                      : error.message
                    : null}
                </p>
              </>
            )}
          />

          <h2 className={styles.signupLabels}>Password</h2>
          <br />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: 'Password required', minLength: 6 }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  id="outlined-login-password-input"
                  type={'password'}
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  className={styles.textField}
                />
                <p className={styles.errorMessage}>
                  {error
                    ? error.type === 'minLength'
                      ? 'Password length should be longer than 6 characters'
                      : error.message
                    : null}
                </p>
              </>
            )}
          />

          <Button className={styles.saveButton} size="large" type="submit">
            Login
          </Button>
        </form>

        <p className={styles.textRedirect}>
          Don&apos;t have an account? &nbsp;
          <NextLink href={`/signup`} passHref>
            <Link className={styles.link}>Sign up now!</Link>
          </NextLink>
        </p>
      </div>
    </Layout>
  );
}
