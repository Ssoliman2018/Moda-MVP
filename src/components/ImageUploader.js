import React, { useState } from "react";
import { View, Button, Image, StyleSheet, ActionSheetIOS } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { handleImagePick } from "../services/ImageLoader";

export default function ImageUploader({
  onImageSelect,
}) {
  const [image, setImage] = (useState < string) | (null > null);

  const openActionSheet = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Capture Image", "Choose Image"],
        // destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          handleImagePick(true);
        } else if (buttonIndex === 2) {
          handleImagePick(false);
        }
      }
    );
//   const handleImagePick = async (fromCamera) => {
//     const result = fromCamera
//       ? await ImagePicker.launchCameraAsync({
//           allowsEditing: true,
//           aspect: [4, 3],
//           quality: 1,
//         })
//       : await ImagePicker.launchImageLibraryAsync({
//           allowsEditing: true,
//           aspect: [4, 3],
//           quality: 1,
//         });

//     // Check if the user canceled the operation and extract the URI
//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       const uri = result.assets[0].uri;
//       setImage(uri);
//       onImageSelect(uri); // Pass the URI back to the parent component
//     }
//   };

  return (
    <View style={styles.container}>
      <Button title="Take Photo" onPress={() => handleImagePick(true)} />
      <Button
        title="Pick from Gallery"
        onPress={() => handleImagePick(false)}
      />
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", marginTop: 20 },
  imagePreview: { width: 200, height: 200, marginTop: 20 },
});
