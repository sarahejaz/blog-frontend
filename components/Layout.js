import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  AppBar,
  Avatar,
  Button,
  Divider,
  Drawer,
  Fab,
  Grid,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
} from '@mui/material';
import styles from '../styles/sass-styles/styles.module.scss';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import miscService from '../pages/services/misc.service';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);

  const [user, setUser] = useState(null);
  const [addPostPageState, setAddPostPageState] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [anchorElMobile, setAnchorElMobile] = useState(null);
  const openMobile = Boolean(anchorElMobile);

  const [openSideBar, setOpenSideBar] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickMobile = (e) => {
    setAnchorElMobile(e.currentTarget);
  };

  const handleCloseMobile = () => {
    setAnchorElMobile(null);
  };

  const logout = (e) => {
    enqueueSnackbar('Logging out...', {
      variant: 'default',
    });
    setTimeout(function () {
      closeSnackbar();
      setAnchorEl(null);
      dispatch({ type: 'USER_LOGOUT' });
      Cookies.remove('userInfo');
      router.push('/');
    }, 2000);
  };

  const goToMyProfile = () => {
    router.push('/myprofile');
  };

  const goToAdminDashboard = () => {
    router.push('/admin');
  };

  const addPostPage = () => {
    router.push('/blogpost/add');
  };

  useEffect(() => {
    closeSnackbar();
    const { userInfo } = state;
    setUser(userInfo);

    async function fetchData() {
      if (userInfo) {
        try {
          await miscService.verifyToken(userInfo.accessToken);
        } catch (err) {
          closeSnackbar();

          if (err.response.data?.message === 'Invalid token') {
            enqueueSnackbar('Session timed out. Logging out...', {
              variant: 'default',
            });
            setTimeout(function () {
              closeSnackbar();
              setAnchorEl(null);
              dispatch({ type: 'USER_LOGOUT' });
              Cookies.remove('userInfo');
              router.push('/');
            }, 2000);
          } else {
            enqueueSnackbar(
              err.response.data ? err.response.data.message : err,
              {
                variant: 'error',
              }
            );
          }
        }
      }
    }

    fetchData();
  }, [closeSnackbar, dispatch, enqueueSnackbar, router, state]);

  function stringAvatar(name) {
    if (/\s/.test(name))
      return `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
    else return name[0];
  }

  return (
    <div>
      <Head>
        <title>
          {title ? `${title} - Blog Post Website` : 'Blog Post Website'}
        </title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <nav className={styles.navbar}>
        <Toolbar variant="dense">
          <NextLink href="/" passHref>
            <Link className={styles.navMainHeading1}>Blog Posts Website</Link>
          </NextLink>
          <div className={styles.grow}></div>
          <div className={styles.rightSide}>
            <Grid
              container
              spacing={8}
              alignItems="center"
              justifyContent="center"
              className={styles.navbarRightItems}
            >
              <Grid item>
                <NextLink href="/" passHref>
                  <Link className={styles.navHeading1}>Home</Link>
                </NextLink>
              </Grid>

              <Grid item>
                <NextLink href="/explore" passHref>
                  <Link className={styles.navHeading1}>Explore</Link>
                </NextLink>
              </Grid>

              <Grid item>
                {user ? (
                  <>
                    <Button
                      className={styles.navHeading1LoggedInUser}
                      onClick={handleClick}
                      endIcon={<ExpandMoreIcon />}
                    >
                      {user.firstName}
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem onClick={goToMyProfile}>
                        <p className={styles.nameMenu}>Profile</p>
                      </MenuItem>
                      {user && user.role === 'admin' && (
                        <MenuItem onClick={goToAdminDashboard}>
                          <p className={styles.nameMenu}>Admin Dashboard</p>
                        </MenuItem>
                      )}
                      <Divider />
                      <MenuItem onClick={logout}>
                        <p className={styles.nameMenu}>Logout</p>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <NextLink href="/login" passHref>
                    <Link className={styles.navHeading1}>Login</Link>
                  </NextLink>
                )}
              </Grid>
            </Grid>
            <Button className={styles.hamburger} onClick={handleClickMobile}>
              <MenuIcon sx={{ color: 'white' }} fontSize="large" />
              {/* <Drawer
                anchor={'right'}
                open={openSideBar}
                onRequestClose={(ev, reason) => setOpenSideBar(false)}
                onBackdropClick={() => setOpenSideBar(false)}
                className={styles.navSidebar}
              >
                <List>
                  {[
                    { title: 'Profile', onClickFtn: goToMyProfile },
                    { title: 'Logout', onClickFtn: logout },
                  ].map((text, index) => (
                    <ListItem key={text} disablePadding>
                      <ListItemButton>
                        <ListItemText primary={text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>

                <List>
                  {[
                    { title: 'Home', route: '/' },
                    { title: 'Explore', route: '/explore' },
                    { title: 'Login', route: '/login' },
                  ].map((item, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton>
                        <NextLink href={item.route} passHref>
                          <Link className={styles.navHeading1}>
                            {item.title}
                          </Link>
                        </NextLink>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer> */}
            </Button>
            <Menu
              id="basic-menu-mobile"
              anchorEl={anchorElMobile}
              open={openMobile}
              onClose={handleCloseMobile}
              MenuListProps={{
                'aria-labelledby': 'basic-button-mobile',
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              className={styles.menuMobile}
            >
              {user ? (
                <Button className={styles.loggedInUserMobile} disabled>
                  {user.firstName}
                </Button>
              ) : (
                <div></div>
              )}
              <MenuItem className={styles.menuItemMobile}>
                <NextLink href="/" passHref>
                  <Link className={styles.menuItemMobileText}>Home</Link>
                </NextLink>
              </MenuItem>
              <MenuItem className={styles.menuItemMobile}>
                <NextLink href="/explore" passHref>
                  <Link className={styles.menuItemMobileText}>Explore</Link>
                </NextLink>
              </MenuItem>

              {user ? (
                <div>
                  <MenuItem className={styles.menuItemMobile}>
                    <NextLink href="/myprofile" passHref>
                      <Link className={styles.menuItemMobileText}>Profile</Link>
                    </NextLink>
                  </MenuItem>
                  {user && user.role === 'admin' && (
                    <MenuItem
                      className={styles.menuItemMobile}
                      onClick={goToAdminDashboard}
                    >
                      <p className={styles.menuItemMobileText}>
                        Admin Dashboard
                      </p>
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem className={styles.menuItemMobile} onClick={logout}>
                    <p className={styles.menuItemMobileText}>Logout</p>
                  </MenuItem>
                </div>
              ) : (
                <div>
                  <MenuItem className={styles.menuItemMobile}>
                    <NextLink href="/login" passHref>
                      <Link className={styles.menuItemMobileText}>Login</Link>
                    </NextLink>
                  </MenuItem>
                </div>
              )}
            </Menu>
          </div>
        </Toolbar>
      </nav>

      <div>{children}</div>
      <footer className={styles.footer} style={{ textAlign: 'center' }}>
        <hr />
        <p className={styles.footerText}>All Rights Reserved</p>
      </footer>
    </div>
  );
}
