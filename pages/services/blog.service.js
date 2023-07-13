import url from '../../utils/apiUrl';
import axios from 'axios';
import authHeader from './auth.header';

const blogUrl = url + 'blog/';

const headerData = {
  authorization: `Bearer ` + authHeader(),
};

class BlogService {
  addBlogPost = async (blog) => {
    try {
      if (authHeader()) {
        const { data } = await axios.post(blogUrl + 'add', blog, {
          headers: headerData,
        });
        return data;
      } else {
        throw 'Please login to add blog posts';
      }
    } catch (err) {
      throw err;
    }
  };

  editBlogPost = async (id, blog) => {
    try {
      if (authHeader()) {
        const { data } = await axios.put(blogUrl + `edit/${id}`, blog, {
          headers: headerData,
        });
        return data;
      } else {
        throw 'Please login to edit blog posts';
      }
    } catch (err) {
      throw err;
    }
  };

  getBlogPostBySlug = async (blogSlug) => {
    try {
      const { data } = await axios.get(blogUrl + 'slug/' + blogSlug);

      if (!data) return null;

      return data;
    } catch (err) {
      throw err;
    }
  };

  getBlogPostById = async (blogId) => {
    try {
      const { data } = await axios.get(blogUrl + 'id/' + blogId);

      if (!data) return null;

      return data;
    } catch (err) {
      throw err;
    }
  };

  getAllBlogs = async () => {
    try {
      const { data } = await axios.get(blogUrl + 'allblogs');

      if (!data) return null;

      return data;
    } catch (err) {
      throw err;
    }
  };

  getUserBlogs = async (userId) => {
    try {
      const { data } = await axios.get(blogUrl + 'user/' + userId);

      if (!data) return null;

      return data;
    } catch (err) {
      throw err;
    }
  };

  getImage = async (image) => {
    try {
      const { data } = await axios.get(blogUrl + 'image/' + image);

      if (!data) return null;

      return data;
    } catch (err) {
      throw err;
    }
  };

  searchBlogs = async (searchObj) => {
    try {
      const { data } = await axios.get(blogUrl + 'searchBlogs', {
        params: {
          searchQueryText: searchObj.searchQuery,
          sortBy: searchObj.sortType,
          tags: searchObj.tags,
        },
      });

      if (!data) return null;

      return data;
    } catch (err) {
      throw err;
    }
  };

  deleteBlog = async (id) => {
    try {
      if (authHeader()) {
        const { data } = await axios.delete(blogUrl + `delete/${id}`, {
          headers: headerData,
        });
        return data;
      } else {
        throw 'Please login to delete blog posts';
      }
    } catch (err) {
      throw err;
    }
  };
}

export default new BlogService();
