import { createSlice } from "@reduxjs/toolkit";

const imagePickerSlice = createSlice({
  name: "imagePicker",
  initialState: {
    imageUri: null,
  },
  reducers: {
    setImageUri: (state, action) => {
      state.imageUri = action.payload;
    },
    clearImageUri: (state) => {
      state.imageUri = null;
    },
  },
});

export const { setImageUri, clearImageUri } = imagePickerSlice.actions;
export default imagePickerSlice.reducer;
