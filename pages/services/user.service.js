import url from '../../utils/apiUrl';
import axios from 'axios';

class UserService {
  profileById = async (userId) => {
    try {
      const { data } = await axios.get(url + `user/id/${userId}`);
      return data;
    } catch (err) {
      throw err;
    }
  };
}

export default new UserService();
