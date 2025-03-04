import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

// Async Thunk for uploading image to Firebase Storage
export const uploadImage = createAsyncThunk(
  "imageUpload/uploadImage",
  async (localUri, { rejectWithValue }) => {
    try {
      // Convert image URI to Blob
      const response = await fetch(localUri);
      const blob = await response.blob();

      // Generate a unique file name
      const fileName = localUri.substring(localUri.lastIndexOf("/") + 1);
      const storageRef = ref(storage, `images/${fileName}`);

      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, blob);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL; // Return the image URL
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Image Upload Slice
const imageUploadSlice = createSlice({
  name: "imageUpload",
  initialState: {
    isUploading: false,
    imageUrl: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.isUploading = false;
        state.imageUrl = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
      });
  },
});

export default imageUploadSlice.reducer;
