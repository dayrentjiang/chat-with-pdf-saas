"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";

export async function generateEmbeddings(docId: string) {
  auth.protect(); //protect this route with Clerk

  //turn a PDF into embeddings [strings of numbers]
  await generateEmbeddingsInPineconeVectorStore(docId);

  //ensures that the dashboard shows the newest embeddings
  revalidatePath("/dashboard");

  return { completed: true };
}
