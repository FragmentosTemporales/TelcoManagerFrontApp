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
