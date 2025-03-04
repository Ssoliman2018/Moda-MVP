import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadUserImage } from "../../services/ImageLoader";
// import {
//   uploadUserImage,
//   fetchTryOnResultApi,
//   fetchTryOnFashionAI,
// } from "../../services/tryOnService";

export const uploadImageToFirebase = createAsyncThunk(
  "tryOn/uploadImageToFirebase",
  async (localUri, { rejectWithValue }) => {
    try {
      const uploadedUrl = await uploadUserImage(localUri);
      console.log('img result after upload ..', uploadedUrl)
      return uploadedUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const fetchTryOnResult = createAsyncThunk(
//   "tryOn/fetchTryOnResult",
//   async ({ userImageUrl, clothingImage }, { rejectWithValue }) => {
//     try {
//       return await fetchTryOnResultApi(userImageUrl, clothingImage);
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const fetchFashionAIResult = createAsyncThunk(
//   "tryOn/fetchFashionAIResult",
//   async ({ userImageUrl, clothingImage, category }, { rejectWithValue }) => {
//     try {
//       return await fetchTryOnFashionAI(userImageUrl, clothingImage, category);
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
export const tryOnFashionAI = createAsyncThunk(
  "tryOn/fashionAI",
  async ({ userImage, clothingImage, category }, { rejectWithValue }) => {
    console.log('###### try on #1', {
      userImage: userImage,
      clothingImage: clothingImage,
      category: category,
    })
    try {
      const response = await fetch(
        "https://moda-api-830887657960.us-central1.run.app/api/fashion-ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userImage,
            clothingImage,
            category,
            nsfw_filter: true,
            cover_feet: false,
            adjust_hands: true,
            restore_background: true,
            restore_clothes: false,
            garment_photo_type: "auto",
            long_top: false,
            mode: "quality",
            seed: 42,
            num_samples: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch the try-on result");
      }

      return data.result.output; // Returning the output array
    } catch (error) {
      console.error("Error during Try-On-FashionAI API call:", error);
      return rejectWithValue(error.message);
    }
  }
);

