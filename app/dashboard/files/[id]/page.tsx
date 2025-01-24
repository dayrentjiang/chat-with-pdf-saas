import PdfView from "@/components/PdfView";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

async function chatToFilePage({ params }: { params: { id: string } }) {
  //get the file ID from the URL
  const { id } = await params;

  auth.protect();
  const { userId } = await auth();

  //use firebase admin to access the file (firebase admin because we are on server, secure)
  const ref = await adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .get();

  const url = ref.data()?.downloadUrl;

  return (
    <div className="grid lg:grid-cols-5 h-full overflow-hidden">
      {/* right */}
      <div className="col-span-5 lg:col-span-2 overflow-y-auto">
        {/* chat side */}
      </div>
      {/* left */}
      <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
        {/* PDFView */}
        <PdfView url={url} />
      </div>
    </div>
  );
}

export default chatToFilePage;
