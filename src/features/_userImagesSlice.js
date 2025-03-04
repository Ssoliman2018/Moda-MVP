import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as Device from "expo-device";
import firebase from "firebase/app";
import "firebase/storage";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../firebaseConfig";
// Thunk to fetch user images from Firebase
export const fetchUserImages = createAsyncThunk(
  "userImages/fetchUserImages",
  async (_, { rejectWithValue }) => {
    try {
      const userId = Device.osBuildId || "defaultUser";
      const storageRef = ref(storage, `${userId}/userImages`); // Use the modular SDK syntax
      const result = await listAll(storageRef); // List all files in the user's folder
      const urls = await Promise.all(
        result.items.map((itemRef) => getDownloadURL(itemRef)) // Get download URLs for each file
      );
      return urls; // Return the array of URLs
    } catch (error) {
      console.error("Error fetching user images from Firebase:", error);
      return rejectWithValue(error.message); // Return the error message
    }
  }
);
// Slice to manage the state of user images
const userImagesSlice = createSlice({
  name: "userImages",
  initialState: {
    images: [], // List of user images
    loadingImages: false, // Loading state
    errorImages: null, // Error state
  },
  reducers: {}, // Add any synchronous reducers if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserImages.pending, (state) => {
        state.loadingImages = true;
        state.errorImages = null;
      })
      .addCase(fetchUserImages.fulfilled, (state, action) => {
        state.loadingImages = false;
        state.images = action.payload; // Populate the state with fetched images
      })
      .addCase(fetchUserImages.rejected, (state, action) => {
        state.loadingImages = false;
        state.errorImages = action.payload; // Store the error message in case of failure
      });
  },
});

export default userImagesSlice.reducer;
