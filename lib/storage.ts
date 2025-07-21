// lib/storage.ts
import { storage } from "./firebase"
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage"

export async function uploadImage(file: File, uid: string): Promise<string> {
  const fileRef = ref(storage, `images/${uid}/${file.name}`)
  const uploadTask = uploadBytesResumable(fileRef, file)

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      }
    )
  })
}
