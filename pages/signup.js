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
import authService from './services/auth.service';

export default function SignUp() {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const { redirect } = router.query; // login ? redirect='/shipping'

  // useEffect(() => {
  //   if (userInfo) {
  //     router.push('/');
  //   }
  // }, [userInfo]);

  const handleFile = (file) => {
    console.log(file);
  };

  const onSubmit = async (data) => {
    closeSnackbar();

    if (data.password !== data.confirmPassword) {
      enqueueSnackbar(`Passwords don't match`, { variant: 'error' });
      return;
    }

    const body = {
      email: data.email,
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    try {
      await authService.signup(body);
      enqueueSnackbar('You have successfully signed up! Please wait...', {
        variant: 'success',
      });
      setTimeout(function () {
        closeSnackbar();
        router.push('/login');
      }, 2500);
    } catch (err) {
      enqueueSnackbar(err.response.data.message, { variant: 'error' });
    }
  };

  return (
    <Layout title="Sign Up">
      <div className={styles.signup}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className={styles.signupHeading}>Sign Up</h1>
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
                  id="outlined-signup-email-input"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  className={styles.textField}
                />
                <p className={styles.errorMessage}>
                  {error
                    ? error.type === 'pattern'
                      ? 'Invalid email'
                      : error.message
                    : null}
                </p>
              </>
            )}
          />

          <h2 className={styles.signupLabels}>Username</h2>
          <br />
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: 'Username required', minLength: 3 }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  id="outlined-signup-username-input"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  className={styles.textField}
                />
                <p className={styles.errorMessage}>
                  {error
                    ? error.type === 'minLength'
                      ? 'Username should be longer than 3 characters'
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
                  id="outlined-signup-password-input"
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
                      ? 'Password should be longer than 6 characters'
                      : error.message
                    : null}
                </p>
              </>
            )}
          />

          <h2 className={styles.signupLabels}>Confirm Password</h2>
          <br />
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{ required: 'Confirm password required', minLength: 6 }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  id="outlined-signup-confirm-password-input"
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
                      ? 'Password should be longer than 6 characters'
                      : error.message
                    : null}
                </p>
              </>
            )}
          />

          <h2 className={styles.signupLabels}>First Name</h2>
          <br />
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            rules={{ required: 'First name required', minLength: 3 }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  id="outlined-signup-first-name-input"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  className={styles.textField}
                />
                <p className={styles.errorMessage}>
                  {error
                    ? error.type === 'minLength'
                      ? 'First name should be longer than 3 characters'
                      : error.message
                    : null}
                </p>
              </>
            )}
          />

          <h2 className={styles.signupLabels}>Last Name</h2>
          <br />
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            rules={{ required: 'Last name required', minLength: 3 }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  id="outlined-signup-last-name-input"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  className={styles.textField}
                />
                <p className={styles.errorMessage}>
                  {error
                    ? error.type === 'minLength'
                      ? 'Last name should be longer than 3 characters'
                      : error.message
                    : null}
                </p>
              </>
            )}
          />

          <Button className={styles.saveButton} size="large" type="submit">
            Sign Up
          </Button>
        </form>

        <p className={styles.textRedirect}>
          Already have an account? &nbsp;
          <NextLink href={`/login`} passHref>
            <Link className={styles.link}>Login!</Link>
          </NextLink>
        </p>
      </div>
    </Layout>
  );
}
