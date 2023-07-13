import url from '../../utils/apiUrl';
import axios from 'axios';

const tagUrl = url + 'admin/';
const commonUrl = url + 'common/';

class MiscService {
  getAllTags = async () => {
    try {
      let { data } = await axios.get(tagUrl + 'tag/all');

      if (!data) return null;

      data = data.concat({ tagName: 'Other' });

      return data;
    } catch (err) {
      throw err;
    }
  };

  verifyToken = async (token) => {
    try {
      const { data } = await axios.get(commonUrl + 'verifyToken/' + token);

      if (!data) return null;

      return data;
    } catch (err) {
      throw err;
    }
  };
}

export default new MiscService();
