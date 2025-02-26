import axios from "axios";

const token = import.meta.env.VITE_TOKEN

export const createPB_Token = async (groupId, reportId) => {
  try {
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`;
    const response = await axios.post(url, {
      body: {
        "accessLevel": "View"
      }
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("ERROR : ", error)
    throw new Error(error);
  }
};
export const createAccessToken = async () => {
  try {
    const url = 'https://login.microsoftonline.com/72afa023-cc92-4c6a-b8c8-58de77b39916/oauth2/v2.0/token'
    const response = await axios.post(
      url,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "a22bf932-de75-4ae1-b234-14924de94485",
        client_secret: "72d39cb8-73e6-4852-ad6a-27171283ff66",
        resource: "https://analysis.windows.net/powerbi/api"
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log("ERROR: ", error);
    throw new Error(error);
  }
}