const apolloApiKey = process.env.APOLLO_API_KEY;
const url = 'https://api.apollo.io/v1/people/match';

if (!apolloApiKey) {
  throw new Error('apolloApiKey key not found');
}

export const fetchPersonData = (firstName, lastName, email) => {
  const data = {
    api_key: apolloApiKey,
    first_name: firstName,
    last_name: lastName,
    email: email
  };

  return fetch(url, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log('Success:', data);
      return data;
    })
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });
};

const apollo = {
  fetchPersonData
};

export default apollo;
