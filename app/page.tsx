import { Button } from "@/components/ui/button";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

//create the features section
const features = [
  {
    name: "Store your PDF Documents",
    description:
      "Upload your PDF documents and store them securely in the cloud.",
    icon: GlobeIcon
  },
  {
    name: "Store your PDF Documents",
    description:
      "Upload your PDF documents and store them securely in the cloud.",
    icon: GlobeIcon
  },
  {
    name: "Store your PDF Documents",
    description:
      "Upload your PDF documents and store them securely in the cloud.",
    icon: GlobeIcon
  },
  {
    name: "Store your PDF Documents",
    description:
      "Upload your PDF documents and store them securely in the cloud.",
    icon: GlobeIcon
  },
  {
    name: "Store your PDF Documents",
    description:
      "Upload your PDF documents and store them securely in the cloud.",
    icon: GlobeIcon
  },
  {
    name: "Store your PDF Documents",
    description:
      "Upload your PDF documents and store them securely in the cloud.",
    icon: GlobeIcon
  }
];

export default function Home() {
  return (
    <main className="flex-1 p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600 overflow-scroll">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col items-center justify-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Your Interactive Doucment Companion
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your PDFs Into Interactive Conversations
            </p>
            <p className="mt-6 text-lg text-gray-600">
              Introducing{" "}
              <span className="font-bold text-indigo-600">Chat with PDF.</span>
              <br />
              <br /> Upload your document, and our chatbot will answer
              questions, summarize content, and answer all you Qs. Ideal for
              everyone
              <span className="text-indigo-600"> Chat with PDF</span>
              turns static documents into{" "}
              <span className="font-bold">dynamic conversations</span>{" "}
              enchancing productivity 10x fold effortlessly.
            </p>
          </div>
          <Button asChild className="mt-10">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
        <div>
          <div>
            <Image
              alt="App Screenshot"
              src="https://i.imgur.com/VciRSTI.jpeg"
              width={2432}
              height={1442}
              className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

//aschild button will make the button behave better
