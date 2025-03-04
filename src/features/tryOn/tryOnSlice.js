import { createSlice } from "@reduxjs/toolkit";
import {
  uploadImageToFirebase,
  fetchTryOnResult,
  fetchFashionAIResult,
  tryOnFashionAI,
} from "./tryOnThunks";

const tryOnSlice = createSlice({
  name: "tryOn",
  initialState: {
    loading: false,
    resultImageUrls: [], // Array to store output image URLs
    error: null,
  },
  reducers: {
    clearTryOnResult: (state) => {
      state.resultImageUrls = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImageToFirebase.pending, (state) => {
        state.isUploading = true;
        state.uploadError = null;
      })
      .addCase(uploadImageToFirebase.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadedImageUrl = action.payload;
      })
      .addCase(uploadImageToFirebase.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadError = action.payload;
      })
      .addCase(tryOnFashionAI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(tryOnFashionAI.fulfilled, (state, action) => {
        state.loading = false;
        state.resultImageUrls = action.payload; // Save the output image URLs
      })
      .addCase(tryOnFashionAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTryOnResult } = tryOnSlice.actions;
export default tryOnSlice.reducer;
