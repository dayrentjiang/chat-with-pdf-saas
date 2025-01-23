import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "../firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

//initialize the openAi model with API key and model name
const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini"
});

//export const indexName of pinecone, need to be the same name as our pinecone index
export const indexName = "dayrentpdfsaas";

//helper function
async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace value provided");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  //download the PDF file from firestore via the stored Download URL, access firebase
  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;
  if (!downloadUrl) {
    throw new Error("Download URL not found");
  }

  console.log(`---Download URL fetched successfully: ${downloadUrl}---`);

  //fetch the PDF file from the download URL
  const response = await fetch(downloadUrl);

  //load the PDF into a PDFDocument object. The response.blob(); method converts the response into a Blob object, which is then used to create an object URL.
  const data = await response.blob();

  //load the PDF document from the specified path
  console.log("---Loading the PDF document---");
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  //split the PDF document into smaller parts for easier processing
  console.log("---Splitting the PDF document into smaller parts---");
  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`---Splitting completed, ${splitDocs.length} parts created---`);

  return splitDocs;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  let pineconeVectorStore;

  //MAJOR 1: generate embeddings for the split documents
  console.log("---Generating embeddings for the split documents---");
  const embeddings = new OpenAIEmbeddings();

  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, userId);

  //we want to makesure we dont create another namespace (embeddings) for the same pdf file
  if (namespaceAlreadyExists) {
    console.log("---Namespace already exists, reusing existing embeddings---");

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index, //the dayrentpdfsaas (the pinecone index name)
      namespace: docId //the document ID is the namespace
    });

    return pineconeVectorStore;
  } else {
    //if the namespace does not exist, download the PDF file from firestore via the stored Download
    //URL and generate the embeddings and store them in the Pinecone Vector Store
    //take the pdf and split into documents (using own created helper function)
    const splitDocs = await generateDocs(docId);

    console.log(
      `---Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store...--- `
    );

    //store the embeddings in the Pinecone Vector Store namespace (this will push the embeddings into the pinecone nameSpace)
    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId
      }
    );

    return pineconeVectorStore;
  }
}
