import * as ImagePicker from "expo-image-picker";
import { uploadImageToGarmentCategory } from "../features/garments/garmentsThunks";
// import { uploadImageToGarmentCategory } from "../features/_garmentsSlice";
// import { uploadImageToCategory } from "../services/ImageService";

export const handleMultipleImagePick = async (category) => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    alert("Permission to access the camera roll is required!");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    allowsMultipleSelection: true, // Enable multiple image selection
    quality: 1,
  });

  if (!result.canceled) {
    const selectedUris = result.assets.map((asset) => asset.uri); // Get URIs of selected images
    // console.log("Selected Images:", selectedUris);

    // Upload images to Firebase
    const uploadPromises = selectedUris.map((uri) =>
      uploadImageToGarmentCategory(uri, category)
    );

    const uploadedUrls = await Promise.all(uploadPromises); // Wait for all uploads to finish
    // console.log("Uploaded Images:", uploadedUrls);

    return uploadedUrls; // Return array of uploaded image URLs
  }
};

