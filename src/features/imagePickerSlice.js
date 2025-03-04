import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imageUri: null, // To store the selected image URI
};

const imagePickerSlice = createSlice({
  name: "imagePicker",
  initialState,
  reducers: {
    setImageUri: (state, action) => {
      state.imageUri = action.payload; // Update the state with the image URI
    },
    clearImageUri: (state) => {
      state.imageUri = null; // Clear the image URI
    },
  },
});

export const { setImageUri, clearImageUri } = imagePickerSlice.actions;
export default imagePickerSlice.reducer;
