const scaleSerpApiKey = process.env.SCALESERP_API_KEY;
const url = 'https://api.scaleserp.com/search';
const axios = require('axios');

if (!scaleSerpApiKey) {
  throw new Error('scaleSerpApiKey key not found');
}

export const fetchNewsData = (data) => {
  const params = {
    api_key: scaleSerpApiKey,
    q: data
  };

  return axios
    .get(url, { params })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const scaleserp = {
  fetchNewsData
};

export default scaleserp;
