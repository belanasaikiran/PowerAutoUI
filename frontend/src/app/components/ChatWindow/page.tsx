// use client
"use client";
import Image from "next/image";
import { TiAttachment } from "react-icons/ti";
import { MdKeyboardVoice } from "react-icons/md";
import { IoSend } from "react-icons/io5";

import { useRef, useState } from "react";

import Dashboard from "../Dashboard/dashboard";

export default function ChatWindow() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [listening, setListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverOutput, setServerOutput] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleVoiceClick = () => {
    setListening(true);
    // Simulate listening state for demo; replace with real logic as needed
    setTimeout(() => setListening(false), 2000);
  };

  // API call to backend via REST endpoint
  const handleSubmit = async () => {
    if (!inputText && !attachedFile) return;
    setLoading(true);
    setServerOutput(null);
    try {
      let response;
      if (attachedFile) {
        const formData = new FormData();
        formData.append("file", attachedFile);
        formData.append("prompt", inputText);

        response = await fetch("http://localhost:4000/api/upload-csv-prompt", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("http://localhost:4000/api/userprompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: inputText }),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to submit prompt");
      }

      const data = await response.json();
      const output =
        typeof data === "string" ? data : JSON.stringify(data, null, 2);
      console.log("Server output:", data);
      setServerOutput(output);

      // If the response is valid chart data, set it
      if (data && typeof data === "object" && data.summary) {
        let summary = data.summary;
        if (typeof summary === "string") {
          // Remove ```json or ``` if present, then parse
          summary = summary.replace(/^```json\s*|^```\s*/i, "");
          // also remove ``` at endpoint
          summary = summary.replace(/```$/, "");
          // convert summary to JSON object
          summary = JSON.parse(summary);
          console.log("set Summary: ", summary);
          setChartData(summary);
        } else {
          setChartData(null);
        }
      } else {
        setChartData(null);
      }

      // Text-to-Speech playback
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utter = new window.SpeechSynthesisUtterance(output);
        window.speechSynthesis.speak(utter);
      }

      setInputText("");
      setAttachedFile(null);
    } catch (err) {
      // handle error as needed
      console.error(err);
      setServerOutput("Upload failed");
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      {(listening || loading) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
          <span className="text-white text-lg font-semibold animate-pulse">
            {loading ? "Submitting..." : "Listening..."}
          </span>
        </div>
      )}
      <div className="flex gap-4 min-w-full">
        {/* attachment button for file */}
        <button
          className="px-4 py-2 rounded-md bg-gray-700 text-gray-300"
          onClick={handleAttachmentClick}
          type="button"
          disabled={loading}
        >
          <TiAttachment />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="w-full flex flex-col justify-start p-2 rounded-md bg-gray-700 text-gray-300 gap-2">
          {attachedFile && (
            <span className="flex justify-between gap-2 text-xs text-green-400  truncate max-w-[140px] bg-gray-800 px-2 py-1 rounded">
              <span className="truncate max-w-[100px]">
                {attachedFile.name}
              </span>
              <button
                type="button"
                className="text-red-400 hover:text-red-600 ml-1"
                onClick={() => setAttachedFile(null)}
                aria-label="Remove attached file"
                disabled={loading}
              >
                &times;
              </button>
            </span>
          )}
          <input
            className="min-w-full"
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          className="px-4 py-2 rounded-md bg-gray-700 text-gray-300"
          onClick={handleVoiceClick}
          type="button"
          disabled={loading}
        >
          <MdKeyboardVoice />
        </button>
        <button
          className="px-4 py-2 rounded-md bg-gray-700 text-gray-300"
          onClick={handleSubmit}
          type="button"
          disabled={loading}
        >
          <IoSend />
        </button>
      </div>
      {serverOutput && (
        <div className="mt-4 p-3 rounded bg-gray-800 text-white border border-gray-600">
          <strong>Server Output:</strong>
          <div className="whitespace-pre-wrap break-words">
            {typeof serverOutput === "string"
              ? serverOutput.replace(/^```json\s*|^```\s*/i, "")
              : JSON.stringify(serverOutput, null, 2)}
          </div>
        </div>
      )}
      <div className="py-4">
        <Dashboard chartData={chartData} />
      </div>
    </div>
  );
}
