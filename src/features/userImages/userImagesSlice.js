import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserImagesFromFirebase } from "../../services/firebaseService";
import { fetchUserImages } from "./userImagesThunks";

const userImagesSlice = createSlice({
  name: "userImages",
  initialState: {
    images: [],
    loadingImages: false,
    errorImages: null,
    selectedImage: null,
    selectedImageHistory: [],
  },
  reducers: {
    selectImage: (state, action) => {
      if (state.selectedImage) {
        state.selectedImageHistory.push(state.selectedImage);
      }
      // Set the new selected image
      state.selectedImage = action.payload;
    },
    undoLastTryOn: (state) => {
      if (state.selectedImageHistory.length > 0) {
        // Restore last image
        state.selectedImage = state.selectedImageHistory.pop();
      }
    },
    clearSelectedImage: (state) => {
      // Clear the selected image
      state.selectedImage = null;
      state.selectedImageHistory = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserImages.pending, (state) => {
        state.loadingImages = true;
        state.errorImages = null;
      })
      .addCase(fetchUserImages.fulfilled, (state, action) => {
        state.loadingImages = false;
        state.images = action.payload;
      })
      .addCase(fetchUserImages.rejected, (state, action) => {
        state.loadingImages = false;
        state.errorImages = action.payload;
      });
  },
});
export const { selectImage, undoLastTryOn, clearSelectedImage } =
  userImagesSlice.actions;

export default userImagesSlice.reducer;
