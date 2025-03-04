import * as ImagePicker from "expo-image-picker";
import { setImageUri } from "../features/imagePickerSlice";
import { ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebaseConfig";
// import { uploadImageToFirebase } from "../features/tryOnSlice";
import * as Device from "expo-device";
import { uploadImageToFirebase } from "../features/tryOn/tryOnThunks";
// import { storage } from "../firebaseConfig"; // Ensure this points to your Firebase configuration

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
      uploadImageToCategory(uri, category)
    );

    const uploadedUrls = await Promise.all(uploadPromises); // Wait for all uploads to finish
    // console.log("Uploaded Images:", uploadedUrls);

    return uploadedUrls; // Return array of uploaded image URLs
  }
};


export const handleImagePick = async (fromCamera, dispatch) => {
  // Request permission to access camera roll
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  // console.log("permissionResult", permissionResult);
  // console.log("handleImagePick", fromCamera);

  if (!permissionResult.granted) {
    alert("Permission to access the camera roll is required!");
    return;
  }

  const result = fromCamera
    ? await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [3, 4],
        quality: 1,
      })
    : await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        aspect: [3, 4],
        quality: 1,
      });


  // Check if the user canceled the operation and extract the URI
  if (!result.canceled && result.assets && result.assets.length > 0) {
    
    const uri = result.assets[0].uri;
  console.log("handleImagePick Result 1", uri);

    dispatch(uploadImageToFirebase(uri))
    // dispatch(setImageUri(uri));

    return uri;
  }
};


export const uploadUserImage = async (localUri) => {
  try {
    // Convert the image file to a Blob
     const userId = Device.osBuildId || "defaultUser"; 
    const response = await fetch(localUri);
    const blob = await response.blob();

    // Generate a unique filename for the uploaded file
    const fileName = localUri.substring(localUri.lastIndexOf("/") + 1);

    // Define a reference to the Firebase Storage path
    const storageRef = ref(storage, `${userId}/userImages/${fileName}`);

    // Upload the file to Firebase Storage
    await uploadBytes(storageRef, blob);

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(storageRef);

    // console.log("Uploaded Image URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);
    throw error;
  }
};

// Upload Image by Category
export const uploadImageToCategory = async (localUri, category, onProgress) => {
  const userId = Device.osBuildId || "defaultUser";
  const fileName = `${Date.now()}.jpg`; // Unique file name
  const storageRef = ref(storage, `${userId}/Garments/${category}/${fileName}`);

  const response = await fetch(localUri);
  const blob = await response.blob(); // Convert URI to Blob
  const uploadTask = uploadBytesResumable(storageRef, blob);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Calculate and send progress percentage
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(i, progress.toFixed(0)); // Update progress for the current image
    },
    (error) => {
      console.error("Error uploading image:", error);
      throw error;
    },
    async () => {
      const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
      uploadedUrls.push(downloadUrl);
    }
  );

  // Wait for the upload to complete
  await new Promise((resolve, reject) => {
    uploadTask.on("state_changed", null, reject, resolve);
  });
  // Upload to Firebase Storage
  return uploadedUrls;
  // await uploadBytes(storageRef, blob);
  // const downloadUrl = await getDownloadURL(storageRef);
  // return downloadUrl; // Return download URL
};

// Fetch Images by Category
export const fetchImagesByCategory = async (category) => {
  const userId = Device.osBuildId || "defaultUser";
  const categoryRef = ref(storage, `${userId}/Garments/${category}`);
  const result = await listAll(categoryRef); // List all files in the category folder
  const urls = await Promise.all(
    result.items.map((itemRef) => getDownloadURL(itemRef)) // Get download URLs
  );
  return urls; // Return list of image URLs
};


export const uploadImageToCloudinary = async (
  localUri
) => {
  const formData = new FormData();
  formData.append("file", {
    uri: localUri,
    name: "image.jpg",
    type: "image/jpeg",
  });
  formData.append("upload_preset", "moda-users");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dnoqco3fs/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();
  // console.log("uploadImageToCloudinary ...", result );
  if (!result.secure_url) {
    throw new Error("Failed to upload image to Cloudinary");
  }
  return result.secure_url;
};

export const fetchTryOnResultApi = async (
  userImageUrl,
  clothingImage
) => {
  // console.log('hellloooo ...')
  const response = await fetch(
    "https://moda-api-830887657960.us-central1.run.app/api/try-on",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userImage: userImageUrl,
        clothingImage: clothingImage,
      }),
    }
  );

    const data = await response.json();
    // console.log('try on Result', data)
  if (!data.result.result_url) {
    throw new Error("Failed to fetch try-on result");
  }
  return data.result.result_url;
};

export const fetchTryOnFashionAI = async (userImageUrl, clothingImage, category) => {
  // console.log("#1 userImageUrl...", userImageUrl);
  // console.log("#2 clothingImage...", clothingImage);
  // console.log("#3 category...", category);

  
  const response = await fetch(
    "https://moda-api-830887657960.us-central1.run.app/api/fashion-ai",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userImage: userImageUrl,
        clothingImage: clothingImage,
        category: category,
      }),
    }
  );

  const data = await response.json();
  // console.log("try on Result...", data);
  if (!data.result.output) {
    throw new Error("Failed to fetch try-on result");
  }
  return data.result;
};