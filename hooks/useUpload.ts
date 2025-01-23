"use client";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage, db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { generateEmbeddings } from "@/actions/generateEmbeddings";

//setting up an enum in order to have a fixed set of values
export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI Embedding, This will only take a few seconds..."
}

export type Status = StatusText[keyof StatusText];

export function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const { user } = useUser();
  //   const router = useRouter();

  const handleUpload = async (file: File) => {
    if (!file || !user) return;

    //TODO: FREE/PRO Limitations...

    const fileIdToUploadTo = uuidv4(); //example: 123e4567-e89b-12d3-a456-426614174000

    //this is where we will store our files (firebase storage)
    const storageRef = ref(storage, `users/${user.id}/${fileIdToUploadTo}`);

    //streaming the upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    //listen to the state change from the upload task
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //we can get the percentage of the upload
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setStatus(StatusText.UPLOADING);
        setProgress(percent);
      },
      (error) => {
        console.error("error uploading file", error);
      },
      async () => {
        setStatus(StatusText.UPLOADED);

        //generate the URL of the uploaded file
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setStatus(StatusText.SAVING);

        //save the file to the firestore database (lagi mongoDB) on collection name users, and files of the user
        await setDoc(doc(db, "users", user.id, "files", fileIdToUploadTo), {
          name: file.name,
          size: file.size,
          type: file.type,
          downloadUrl: downloadUrl,
          ref: uploadTask.snapshot.ref.fullPath,
          createdAt: new Date()
        });

        //generate the AI embedding
        setStatus(StatusText.GENERATING);
        await generateEmbeddings(fileIdToUploadTo);
        setFileId(fileIdToUploadTo);
      }
    );
  };

  return { progress, status, fileId, handleUpload };
}
export default useUpload;
