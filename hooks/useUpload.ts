"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

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
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (!file || !user) return;

    //TODO: FREE/PRO Limitations...

    const fileIdToUploadTo = uuidv4(); //example: 123e4567-e89b-12d3-a456-426614174000

    //this is where we will store our files (vercel blob storage)
    const storageRef;
  };
}
export default useUpload;
