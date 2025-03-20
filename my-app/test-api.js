import axios from 'axios';

const API_KEY = "2d252b84482c405593f16c6c03c1e7f1c34a0e50";

const resourceIds = {
  codeforces: 1,
  atcoder: 93,
  leetcode: 102,
};

async function fetchContests() {
  try {
    const response = await axios.get(
      `https://clist.by/api/v4/contest/?upcoming=true&format=json&limit=20&resource_id__in=${resourceIds.codeforces},${resourceIds.atcoder},${resourceIds.leetcode}`,
      {
        headers: {
          Authorization: `ApiKey sanjeet:${API_KEY}`,
        },
      }
    );

    console.log("Response data:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("API responded with status:", error.response.status);
      console.error("Response body:", error.response.data);
    } else {
      console.error("Network or Axios error:", error.message);
    }
  }
}

fetchContests();
