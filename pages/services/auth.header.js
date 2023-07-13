import Cookies from 'js-cookie';

export default function authHeader() {
  if (Cookies.get('userInfo')) {
    const user = JSON.parse(Cookies.get('userInfo'));

    if (user && user.accessToken) {
      // for Node.js Express back-end
      return user.accessToken;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
