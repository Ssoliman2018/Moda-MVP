import { configureStore } from "@reduxjs/toolkit";
import imagePickerReducer from "../features/imagePickerSlice";
import tryOnReducer from "../features/tryOn/tryOnSlice";
import userImagesReducer from "../features/userImages/userImagesSlice";
import garmentsReducer from "../features/garments/garmentsSlice";



export const store = configureStore({
  reducer: {
    imagePicker: imagePickerReducer,
    tryOn: tryOnReducer,
    userImages: userImagesReducer,
    garments: garmentsReducer,
  },
});
