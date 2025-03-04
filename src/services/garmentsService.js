import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../firebaseConfig";
import * as Device from "expo-device";

import * as ImagePicker from "expo-image-picker";

export const uploadImageToCategory = async (localUri, category) => {
  const userId = Device.osBuildId || "defaultUser";
  const fileName = `${Date.now()}.jpg`;
  const storageRef = ref(storage, `${userId}/Garments/${category}/${fileName}`);
  const response = await fetch(localUri);
  const blob = await response.blob();
  await uploadBytesResumable(storageRef, blob);
  return getDownloadURL(storageRef);
};

export const fetchImagesByCategory = async (category) => {
  try {
    const userId = Device.osBuildId || "defaultUser";
    console.log('device id ..', userId)
    const categoryRef = ref(storage, `${userId}/Garments/${category}`);
    const result = await listAll(categoryRef); // Fetches all items in the category
    const urls = await Promise.all(
      result.items.map((item) => getDownloadURL(item)) // Resolves URLs asynchronously
    );
    // console.log("Fetched URLs:", urls);
    return urls; // Returns the array of URLs
  } catch (error) {
    console.error("Error fetching images by category:", error);
    throw error; // Propagates error to Redux
  }
};

//  Service: Upload multiple images to Firebase
export const uploadMultipleImagesToCategory = async (
  localUris,
  category,
  onProgress
) => {
  const userId = Device.osBuildId || "defaultUser";
  const uploadedUrls = [];

  for (let i = 0; i < localUris.length; i++) {
    try {
 const localUri = localUris[i];
    const fileName = `${Date.now()}-${i}.jpg`; // Unique filename
    const storageRef = ref(
      storage,
      `${userId}/Garments/${category}/${fileName}`
    );

    const response = await fetch(localUri);
    const blob = await response.blob();

    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Monitor progress
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(i, progress.toFixed(0)); // Call progress callback
    });

    // Wait for upload to complete
    await new Promise((resolve, reject) => {
      uploadTask.on("state_changed", null, reject, resolve);
    });

    const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
    uploadedUrls.push(downloadUrl);
    } catch {
      console.error(`Error uploading image ${i}:`, error.message);
      onProgress(i, "failed");
    }
   
  }

  return uploadedUrls; // Return array of uploaded URLs
};

export const deleteImageFromCategory = async (imageUrl, category) => {
  console.log("Deleting image from category:", category, imageUrl); // Debugging
  const userId = Device.osBuildId || "defaultUser";
  const decodedUrl = decodeURIComponent(imageUrl);
  const fileName = decodedUrl.split("/").pop().split("?")[0];
  const storageRef = ref(storage, `${userId}/Garments/${category}/${fileName}`);
  await deleteObject(storageRef); // Ensure this does not throw an error
  console.log("Image deleted successfully");
};