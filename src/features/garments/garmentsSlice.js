import { createSlice } from "@reduxjs/toolkit";
import {
  deleteGarmentImg,
  fetchGarmentImages,
  uploadImageToGarmentCategory,
  uploadMultipleImages,
} from "./garmentsThunks";

const garmentsSlice = createSlice({
  name: "garments",
  initialState: {
    garments: {}, // Category-wise images
    progress: [], // Upload progress for multiple images
    garmentsLoading: false,
    garmentsError: null,
    deleteSuccess: null, // Track delete success
    deleteError: null, // Track delete error
    selectedGarment: null,
  },
  reducers: {
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
    resetDeleteState: (state) => {
      state.deleteSuccess = null;
      state.deleteError = null;
    },
    selectGarment: (state, action) => {
      state.selectedGarment = action.payload; // Set selected garment
    },
    clearSelectedGarment: (state) => {
      state.selectedGarment = null; // Clear selected garment
    },
  },
  extraReducers: (builder) => {
    builder
      // upload images
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
      // upload multible images
      .addCase(uploadMultipleImages.pending, (state) => {
        state.garmentsLoading = true;
        state.garmentsError = null;
      })
      .addCase(uploadMultipleImages.fulfilled, (state, action) => {
        state.garmentsLoading = false;
        const { category, uploadedUrls } = action.payload;
        if (!state.garments[category]) {
          state.garments[category] = [];
        }
        state.garments[category].push(...uploadedUrls);
      })
      .addCase(uploadMultipleImages.rejected, (state, action) => {
        state.garmentsLoading = false;
        state.garmentsError = action.payload;
      })
      // fetch garment images >>>
      .addCase(fetchGarmentImages.pending, (state) => {
        // console.log("action payload >>", state);

        state.garmentsLoading = true;
      })
      .addCase(fetchGarmentImages.fulfilled, (state, action) => {
        state.garmentsLoading = false;
        // console.log("action payload >>", action.payload);
        const { category, urls } = action.payload;
        state.garments[category] = urls; // Update the specific category
      })
      .addCase(fetchGarmentImages.rejected, (state, action) => {
        // console.log("action payload >>", state);

        state.garmentsLoading = false;
        state.garmentsError = action.payload;
      })

      // delete garment images >>
      .addCase(deleteGarmentImg.pending, (state) => {
        console.log("delete img reducer >> PENDING");
        state.garmentsLoading = true;
        state.deleteSuccess = null;
        state.deleteError = null;
      })
      .addCase(deleteGarmentImg.fulfilled, (state, action) => {
        console.log("delete img reducer >> fulfilled");

        state.garmentsLoading = false;
        const { imageUrl, category } = action.payload;
        if (state.garments[category]) {
          // Remove the deleted image from the category
          state.garments[category] = state.garments[category].filter(
            (url) => url !== imageUrl
          );
        }
        state.deleteSuccess = "Image deleted successfully!"; // Set success message
      })
      .addCase(deleteGarmentImg.rejected, (state, action) => {
        console.log("delete img reducer >> rejected");

        state.garmentsLoading = false;
        state.deleteError = action.payload; // Set error message
      });
  },
});

export const {
  updateProgressr,
  resetDeleteState,
  selectGarment,
  clearSelectedGarment,
} = garmentsSlice.actions;
export default garmentsSlice.reducer;
