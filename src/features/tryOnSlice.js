import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTryOnFashionAI, fetchTryOnResultApi, fetchUserImagesFromFirebase, uploadImageToCloudinary, uploadUserImage } from "../services/ImageLoader";
import { setImageUri } from "./imagePickerSlice";

const initialState = {
  imageUri: null,
  uploadError: null,
  loading: false,
  uploadedImageUrl: null,
  resultImageUrl: null,
  error: null,
};

export const uploadImageToFirebase = createAsyncThunk(
  "tryOn/uploadImageToFirebase",
  async (localUri, { rejectWithValue }) => {
    try {
      const uploadedUrl = await uploadUserImage(localUri);
      return uploadedUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadImage = createAsyncThunk(
  "tryOn/uploadImage",
  async (localUri, { rejectWithValue }) => {
    try {
      const uploadedUrlToCloud = await uploadImageToCloudinary(localUri);
      return uploadedUrlToCloud;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTryOnResult = createAsyncThunk(
  "tryOn/fetchTryOnResult",
  async (
    {
      userImageUrl,
      clothingImage,
    },
    { rejectWithValue }
  ) => {
    try {
      const resultImageUrl = await fetchTryOnResultApi(
        userImageUrl,
        clothingImage
      );
      return resultImageUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFashionAIResult = createAsyncThunk(
  "tryOn/fetchFashionAIResult",
  async ({ userImageUrl, clothingImage, category }, { rejectWithValue }) => {
    try {
      const resultImageUrl = await fetchTryOnFashionAI(
        userImageUrl,
        clothingImage,
        category
      );
      return resultImageUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const tryOnSlice = createSlice({
  name: "tryOn",
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Upload Image To Firebase
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

      // Upload Image
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedImageUrl = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Try-On Result
      .addCase(fetchTryOnResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTryOnResult.fulfilled, (state, action) => {
        state.loading = false;
        state.resultImageUrl = action.payload;
      })
      .addCase(fetchTryOnResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Fashion-AI Result
      .addCase(fetchFashionAIResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFashionAIResult.fulfilled, (state, action) => {
        state.loading = false;
        state.resultImageUrl = action.payload.output[0];
      })
      .addCase(fetchFashionAIResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = tryOnSlice.actions;
export default tryOnSlice.reducer;
