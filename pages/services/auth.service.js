import url from '../../utils/apiUrl';
import axios from 'axios';

class AuthService {
  signup = async (body) => {
    try {
      const { data } = await axios.post(url + 'user/signup', body);
      return data;
    } catch (err) {
      throw err;
    }
  };

  login = async (email, password) => {
    try {
      const { data } = await axios.post(url + 'auth/login', {
        email,
        password,
      });

      return data;
    } catch (err) {
      throw err;
    }
  };
}

export default new AuthService();
