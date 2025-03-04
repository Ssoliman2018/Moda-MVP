import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteImageFromCategory,
  fetchImagesByCategory,
  uploadImageToCategory,
  uploadMultipleImagesToCategory,
} from "../../services/garmentsService";

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

// Thunk: Upload multiple images to Firebase
export const uploadMultipleImages = createAsyncThunk(
  "garments/uploadMultipleImages",
  async ({ localUris, category }, { rejectWithValue }) => {
    try {
      const uploadedUrls = await uploadMultipleImagesToCategory(
        localUris,
        category,
        (index, progress) => {
          console.log(`Image ${index + 1}: ${progress}% uploaded`);
        }
      );
      return { category, uploadedUrls };
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGarmentImages = createAsyncThunk(
  "garments/fetchImagesByCategory",
  async (category, { rejectWithValue }) => {
    try {
      // console.log('11111 ???')
      const urls = await fetchImagesByCategory(category); // Waits for all URLs
      // console.log(">> Fetch URLs", urls);
      return { category, urls }; // Returns the category and its URLs
    } catch (error) {
      console.error("Error fetching category:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const deleteGarmentImg = createAsyncThunk(
  "garments/deleteImage",
  async ({ imageUrl, category }, { rejectWithValue }) => {
    try {
      console.log("deleteGarmentImage - start >>", imageUrl, category);
      await deleteImageFromCategory(imageUrl, category);
      return { imageUrl, category };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
