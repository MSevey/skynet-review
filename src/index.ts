import { SkynetClient, genKeyPairFromSeed } from "skynet-js";

const client = new SkynetClient("https://siasky.net");

interface Review {
  avatarLink?: string;
  date?: string;
  id: string;
  name?: string;
  skapp?: string;
  stars?: string;
  text?: string;
}

export const PostReview = async (
  review: Review,
  dataKey: string,
  seed: string
) => {
  const { publicKey, privateKey } = genKeyPairFromSeed(seed);

  // Define json
  let json: any = [];

  // Try and load current reviews from skyDB
  try {
    const data = await viewReviews(publicKey, dataKey);
    if (data) {
      json.push(...data);
    }
  } catch (error) {
    console.log(error);
    return error;
  }

  // Add new review to json
  json.push(review);
  console.log("json", json);

  // Save reviews to SkyDB
  try {
    await client.db.setJSON(privateKey, dataKey, json);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const ViewReviews = async (dataKey: string, seed: string) => {
  const { publicKey } = genKeyPairFromSeed(seed);
  try {
    const data = await viewReviews(publicKey, dataKey);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const viewReviews = async (publicKey: string, dataKey: string) => {
  try {
    const { data } = await client.db.getJSON(publicKey, dataKey);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
