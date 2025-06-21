// use client
"use client";
import Image from "next/image";
import { TiAttachment } from "react-icons/ti";
import { MdKeyboardVoice } from "react-icons/md";
import { IoSend } from "react-icons/io5";

import { useRef, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { cp } from "fs/promises";

export default function ChatWindow() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [listening, setListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [serverOutput, setServerOutput] = useState<string | null>(null);

  useEffect(() => {
    const s = io("http://localhost:4000");
    setSocket(s);

    s.on("userprompt", (data: any) => {
      const output =
        typeof data === "string" ? data : JSON.stringify(data, null, 2);
      setServerOutput(output);
      setLoading(false);

      // Text-to-Speech playback
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utter = new window.SpeechSynthesisUtterance(output);
        window.speechSynthesis.speak(utter);
      }
    });

    return () => {
      s.disconnect();
    };
  }, []);

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

  // API call to backend via socket
  const handleSubmit = async () => {
    if (!inputText && !attachedFile) return;
    setLoading(true);
    setServerOutput(null);
    try {
      if (socket) {
        if (attachedFile) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const fileData = e.target?.result;
            console.log("fileData: ", fileData);
            socket.emit("userprompt", {
              prompt: inputText,
              file: {
                name: attachedFile.name,
                type: attachedFile.type,
                data: fileData,
              },
            });
            setInputText("");
            setAttachedFile(null);
          };
          reader.readAsArrayBuffer(attachedFile);
        } else {
          console.log("inputText: ", inputText);
          socket.emit("userprompt", {
            prompt: inputText,
          });
          setInputText("");
          setAttachedFile(null);
        }
      }
    } catch (err) {
      // handle error as needed
      console.error(err);
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
          <div className="whitespace-pre-wrap break-words">{serverOutput}</div>
        </div>
      )}
    </div>
  );
}
