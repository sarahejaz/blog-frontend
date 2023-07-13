import url from '../../utils/apiUrl';
import axios from 'axios';

class AdminService {
  getAllUsers = async () => {
    try {
      const { data } = await axios.get(url + `admin/user/all`);
      return data;
    } catch (err) {
      throw err;
    }
  };

  addTag = async () => {
    try {
      let { data } = await axios.post(url + 'admin/tag/add');

      if (!data) return null;

      return data;
    } catch (err) {
      throw err;
    }
  };

  getTagById = async (id) => {
    try {
      let { data } = await axios.get(url + `admin/tag/id/${id}`);

      if (!data) return null;

      return data;
    } catch (err) {
      throw err;
    }
  };

  editTag = async (id, newTagName) => {
    try {
      let { data } = await axios.put(url + `admin/tag/edit/${id}`, {
        newTagName: newTagName,
      });
      if (!data) return null;
      return data;
    } catch (err) {
      throw err;
    }
  };

  deleteTag = async (id) => {
    try {
      let { data } = await axios.put(url + `admin/tag/delete/${id}`);
      if (!data) return null;
      return data;
    } catch (err) {
      throw err;
    }
  };
}

export default new AdminService();
