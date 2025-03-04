import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../../firebaseConfig";
import * as Device from "expo-device";
import { createAsyncThunk } from "@reduxjs/toolkit";


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
