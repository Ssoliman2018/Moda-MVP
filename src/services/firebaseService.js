import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../firebaseConfig";

export const uploadUserImage = async (localUri) => {
  const fileName = `${Date.now()}.jpg`;
  const storageRef = ref(storage, `userImages/${fileName}`);
  const response = await fetch(localUri);
  const blob = await response.blob();
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
};

export const fetchUserImagesFromFirebase = async () => {
  const storageRef = ref(storage, `userImages`);
  const result = await listAll(storageRef);
  return Promise.all(result.items.map((itemRef) => getDownloadURL(itemRef)));
};
