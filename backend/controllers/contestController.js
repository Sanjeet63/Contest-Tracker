import axios from "axios";

export const getPastContests = async (req, res) => {
  try {
    const endDate = new Date().toISOString().slice(0, 19);
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19);
    const url = `https://clist.by/api/v4/contest/?start__gte=${startDate}&start__lte=${endDate}&resource_id__in=1,2,93,102&order_by=-start`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `ApiKey sanjeet:${process.env.API_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching contests from Clist:", error.message);
    res.status(500).json({ error: "Failed to fetch contests" });
  }
};

export const getUpcomingContests = async (req, res) => {
  try {
    const url =
      "https://clist.by/api/v4/contest/?upcoming=true&format=json&order_by=start&limit=50&resource_id__in=1,2,93,102";
    const response = await axios.get(url, {
      headers: {
        Authorization: `ApiKey sanjeet:${process.env.API_KEY}`,
      },
    });

    res.json(response.data.objects);
  } catch (error) {
    console.error("❌ Error fetching upcoming contests:", error.message);
    res.status(500).json({ error: "Failed to fetch upcoming contests" });
  }
};

export const fetchPastContests = async () => {
  try {
    const endDate = new Date().toISOString().slice(0, 19);
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19);
    const url = `https://clist.by/api/v4/contest/?start__gte=${startDate}&start__lte=${endDate}&resource_id__in=1,2,93,102&order_by=-start`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `ApiKey sanjeet:${process.env.API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching contests from Clist:", error.message);
    throw error;
  }
};

export const fetchUpcomingContests = async () => {
  try {
    const url =
      "https://clist.by/api/v4/contest/?upcoming=true&format=json&order_by=start&limit=50&resource_id__in=1,2,93,102";
    const response = await axios.get(url, {
      headers: {
        Authorization: `ApiKey sanjeet:${process.env.API_KEY}`,
      },
    });

    return response.data.objects;
  } catch (error) {
    console.error("❌ Error fetching upcoming contests:", error.message);
    throw error;
  }
};
