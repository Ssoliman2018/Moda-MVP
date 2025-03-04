import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  uploadImageToCategory,
  fetchImagesByCategory,
} from "../services/ImageLoader";
// import { deleteObject } from "firebase/storage";
import * as Device from "expo-device";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../firebaseConfig";

// Thunk to Upload Image to a Category
export const uploadImageToGarmentCategory = createAsyncThunk(
  "garments/uploadImageToCategory",
  async ({ localUri, category }, { rejectWithValue }) => {
    try {
      const url = await uploadImageToCategory(localUri, category);
      return { url, category };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to Upload Multiple Images
export const uploadMultipleImages = createAsyncThunk(
  "garments/uploadMultipleImages",
  async ({ localUris, category }, { dispatch, rejectWithValue }) => {
    try {
      const progress = Array(localUris.length).fill(0);
      const onProgress = (index, percentage) => {
        progress[index] = percentage;
        dispatch(updateProgress([...progress])); // Update Redux state
      };
      const uploadedUrls = await uploadImagesWithProgress(
        localUris,
        category,
        onProgress
      );
      return { uploadedUrls, category };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to Fetch Images by Category
export const fetchGarmentImages = createAsyncThunk(
  "garments/fetchImagesByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const urls = await fetchImagesByCategory(category);
      return { category, urls };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to delete an image from Firebase Storage
export const deleteImage = createAsyncThunk(
  "garments/deleteImage",
  async ({ imageUrl, category }, { rejectWithValue }) => {
    try {
      // Extract file name from the URL
      const decodedUrl = decodeURIComponent(imageUrl);
      const segments = decodedUrl.split("/");
      const fileName = segments[segments.length - 1].split("?")[0]; // Extract file name
      const userId = Device.osBuildId || "defaultUser"; // Get user ID
      const storageRef = ref(
        storage,
        `${userId}/Garments/${category}/${fileName}`
      ); // Construct the reference

      await deleteObject(storageRef); // Delete the object from Firebase Storage
      return { imageUrl, category }; // Return imageUrl and category
    } catch (error) {
      console.error("Error deleting image:", error);
      return rejectWithValue(error.message);
    }
  }
);

const garmentsSlice = createSlice({
  name: "garments",
  initialState: {
    garments: {}, // { Tops: [], Bottoms: [], OnePiece: [] }
    progress: [],
    garmentsLoading: false,
    garmentsError: null,
  },
  reducers: {
    updateProgress: (state, action) => {
      state.progress = action.payload; // Update progress state
    },
  }, // Add any synchronous reducers if needed
  extraReducers: (builder) => {
    builder
      .addCase(uploadImageToGarmentCategory.pending, (state) => {
        state.garmentsLoading = true;
        state.garmentsError = null;
      })
      .addCase(uploadImageToGarmentCategory.fulfilled, (state, action) => {
        state.garmentsLoading = false;
        const { category, url } = action.payload;
        if (!state.garments[category]) {
          state.garments[category] = [];
        }
        state.garments[category].push(url);
      })
      .addCase(uploadImageToGarmentCategory.rejected, (state, action) => {
        state.garmentsLoading = false;
        state.garmentsError = action.payload;
      })
      .addCase(fetchGarmentImages.pending, (state) => {
        state.garmentsLoading = true;
        state.garmentsError = null;
      })
      .addCase(fetchGarmentImages.fulfilled, (state, action) => {
        state.garmentsLoading = false;
        const { category, urls } = action.payload;
        state.garments[category] = urls;
      })
      .addCase(fetchGarmentImages.rejected, (state, action) => {
        state.garmentsLoading = false;
        state.garmentsError = action.payload;
      })
      .addCase(uploadMultipleImages.pending, (state) => {
        state.garmentsLoading = true;
        state.garmentsError = null;
      })
      .addCase(uploadMultipleImages.fulfilled, (state, action) => {
        state.garmentsLoading = false;
        const { category, urls } = action.payload;
        if (!state.garments[category]) {
          state.garments[category] = [];
        }
        state.garments[category].push(...urls);
      })
      .addCase(uploadMultipleImages.rejected, (state, action) => {
        state.garmentsLoading = false;
        state.garmentsError = action.payload;
      })
      // Handle delete image
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        const { category, imageUrl } = action.payload;
        if (state.garments[category]) {
          state.garments[category] = state.garments[category].filter(
            (url) => url !== imageUrl
          );
        }
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { updateProgress } = garmentsSlice.actions;
export default garmentsSlice.reducer;
