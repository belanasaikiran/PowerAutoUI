// use client
"use client";
import { TiAttachment } from "react-icons/ti";
import { MdKeyboardVoice } from "react-icons/md";
import { IoSend } from "react-icons/io5";

import { useRef, useState, useEffect } from "react";
import { useFile } from "../../context/FileContext";
import FileInfo from "../FileInfo/FileInfo";

export default function ChatWindow({
  setChartData,
  setTableId,
  tableId,
  setChartType,
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [listening, setListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverOutput, setServerOutput] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<
    Array<{ type: "user" | "system"; message: string; timestamp: number }>
  >([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { fileName, setFileName } = useFile();

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachedFile(e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleVoiceClick = () => {
    setListening(true);
    // Simulate listening state for demo; replace with real logic as needed
    setTimeout(() => setListening(false), 2000);
  };

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

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
        console.log("Current tableId:", tableId);
        const requestBody: { prompt: string; table?: string } = {
          prompt: inputText,
        };
        if (tableId && typeof tableId === "string" && tableId.trim() !== "") {
          requestBody.table = tableId;
          console.log("Adding table to request:", tableId);
        } else {
          console.log("No valid tableId available");
        }
        console.log("Sending request to userprompt:", requestBody);
        response = await fetch("http://localhost:4000/api/userprompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error(`API Error (${response.status}):`, errorText);
        console.error("Request was:", requestBody);
        throw new Error(
          `Failed to submit prompt: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      // Extract summary from response if available
      let output = "";
      if (data && typeof data === "object" && data.summary) {
        output = data.summary;
      } else {
        output =
          typeof data === "string" ? data : JSON.stringify(data, null, 2);
      }
      console.log("Server output:", data);
      console.log("Response structure:", Object.keys(data));
      setServerOutput(data); // Store the full data object for access to properties

      // If the response is valid chart data, set it
      if (data && typeof data === "object") {
        // Store the table ID from the response for the title
        if (data.table) {
          console.log("Received table ID from response:", data.table);
          setTableId && setTableId(data.table);
          console.log("Set table ID to:", data.table);
        } else {
          console.log("No table ID in response");
        }

        // Set chart type from response if available
        if (data.chartType && typeof data.chartType === "string") {
          setChartType && setChartType(data.chartType);
        }

        // Set suggested questions if provided by the server
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          setSuggestedQuestions(data.questions);
        } else {
          setSuggestedQuestions([]);
        }

        if (data.summary) {
          let summary = data.summary;
          if (typeof summary === "string") {
            // Check if it contains JSON
            if (summary.includes("{") && summary.includes("}")) {
              // Remove ```json or ``` if present, then parse
              summary = summary.replace(/^```json\s*|^```\s*/i, "");
              // also remove ``` at endpoint
              summary = summary.replace(/```$/, "");
              try {
                // convert summary to JSON object
                const parsedSummary = JSON.parse(summary);
                console.log("Parsed summary:", parsedSummary);
                setChartData(parsedSummary);
              } catch (error) {
                console.error("Failed to parse summary JSON:", error);
                setChartData(null);
              }
            }
          } else if (typeof summary === "object") {
            setChartData(summary);
          }
        }
      } else {
        // If we're doing a regular prompt with no table ID, don't reset chart data
        if (!attachedFile && !tableId) {
          console.log("Not changing chart data for regular prompt");
        } else {
          // Only reset chart data when we should be showing new chart data
          setChartData(null);
        }
        setSuggestedQuestions([]);
      }

      // Text-to-Speech playback
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const speechText =
          data && data.summary
            ? data.summary
            : typeof data === "string"
              ? data
              : JSON.stringify(data);
        const utter = new window.SpeechSynthesisUtterance(speechText);
        window.speechSynthesis.speak(utter);
      }

      // Add to chat history
      if (inputText) {
        setChatHistory((prev) => [
          ...prev,
          { type: "user", message: inputText, timestamp: Date.now() },
        ]);
      }

      // Add system response to chat history
      setChatHistory((prev) => [
        ...prev,
        {
          type: "system",
          message:
            data && data.report
              ? typeof data.report === "string"
                ? data.report
                : JSON.stringify(data.report, null, 2)
              : data && data.summary && typeof data.summary === "string"
                ? data.summary
                : typeof data === "string"
                  ? data
                  : JSON.stringify(data, null, 2),
          timestamp: Date.now(),
        },
      ]);

      setInputText("");
      setAttachedFile(null);
      setFileName(null);
    } catch (err) {
      // handle error as needed
      console.error("Request failed:", err);
      // Add the error to chat history
      setChatHistory((prev) => [
        ...prev,
        {
          type: "system",
          message: `Error: ${err.message || "Request failed"}`,
          timestamp: Date.now(),
        },
      ]);
      setServerOutput(`Error: ${err.message || "Request failed"}`);
      // Don't reset chart data on error
      // setChartData(null);
      // setPromptTitle(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-700">
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-2">
        {fileName ? (
          <FileInfo
            fileName={fileName}
            onRemoveFile={() => {
              setAttachedFile(null);
              setFileName(null);
            }}
          />
        ) : null}
      </div>

      {(listening || loading) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
          <span className="text-white text-lg font-semibold animate-pulse">
            {loading ? "Submitting..." : "Listening..."}
          </span>
        </div>
      )}

      {/* Chat History */}
      <div
        ref={chatHistoryRef}
        className="flex-grow overflow-y-auto flex flex-col gap-3 py-4 px-4"
        style={{
          scrollBehavior: "smooth",
          height: tableId ? "calc(70vh - 170px)" : "calc(70vh - 120px)",
        }}
      >
        {!fileName && !chatHistory.length && !tableId && (
          <div
            className={`flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-xl transition-colors duration-200 ${dragActive ? "border-blue-500 bg-blue-500 bg-opacity-10" : "border-gray-700"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-5xl mb-6">📊</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Welcome to WoW
            </h3>
            <p className="text-gray-400 max-w-md mb-6">
              Upload a CSV file and ask questions to analyze your data and
              generate beautiful interactive charts.
            </p>
            <div
              className={`${dragActive ? "" : "animate-bounce"} bg-blue-600 p-2 w-10 h-10 ring-1 ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center mb-2`}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d={
                    dragActive ? "M5 15l7-7 7 7" : "M19 14l-7 7m0 0l-7-7m7 7V3"
                  }
                ></path>
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              {dragActive
                ? "Drop your CSV file here"
                : "Drag & drop a CSV file here, or click to browse"}
            </p>
          </div>
        )}
        {tableId && !chatHistory.length && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-xl bg-gray-800 bg-opacity-40 backdrop-blur-sm">
            <div className="text-4xl mb-5">💬</div>
            <h3 className="text-xl font-bold text-white mb-3">
              Your charts are ready!
            </h3>
            <p className="text-gray-300 max-w-md mb-4">
              Now you can ask questions about your data. Try these suggestions:
            </p>
            <div className="flex flex-col gap-3 w-full max-w-md mb-6">
              {(suggestedQuestions.length > 0
                ? suggestedQuestions
                : [
                    "Summarize the main insights from this data",
                    "What are the highest and lowest values?",
                    "Show me the trends over time",
                  ]
              ).map((q, idx) => (
                <div
                  key={idx}
                  className="bg-gray-700 p-3 rounded-md text-left cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => setInputText(q)}
                >
                  {q}
                </div>
              ))}
            </div>
            <p className="text-blue-400 text-sm animate-pulse">
              Click on any suggestion to use it, or type your own question below
            </p>
          </div>
        )}
        {chatHistory.length > 0 &&
          chatHistory.map((chat, index) => (
            <div
              key={`chat-${index}-${chat.timestamp}`}
              className={`
              p-4 rounded-lg shadow-md animate-fadeIn
              ${
                chat.type === "user"
                  ? "bg-blue-600 text-white ml-auto rounded-br-none"
                  : "bg-gray-800 text-white border border-gray-700 rounded-bl-none"
              }
              max-w-[80%] ${chat.type === "user" ? "self-end" : "self-start"}
              transition-all duration-300 ease-in-out
              hover:shadow-lg backdrop-blur-sm
            `}
              style={{
                animationDelay: `${index * 0.05}s`,
                animationDuration: "0.3s",
              }}
            >
              <div className="whitespace-pre-wrap break-words">
                {chat.type === "system"
                  ? chat.message
                      .replace(/^```json\s*|^```\s*/i, "")
                      .replace(/```$/i, "")
                  : chat.message}
              </div>
              <div
                className={`text-xs mt-1 ${chat.type === "user" ? "text-blue-200" : "text-gray-400"}`}
              >
                {new Date(chat.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
      </div>

      {serverOutput && !chatHistory.length && (
        <div className="mb-4 p-4 rounded-lg bg-gray-800 text-white border border-gray-700 overflow-y-auto max-h-[250px] backdrop-blur-sm shadow-md">
          <strong>Response:</strong>
          <div className="whitespace-pre-wrap break-words">
            {typeof serverOutput === "object" && tableId && serverOutput.report
              ? typeof serverOutput.report === "string"
                ? serverOutput.report
                : JSON.stringify(serverOutput.report, null, 2)
              : typeof serverOutput === "object" && serverOutput.summary
                ? serverOutput.summary
                : typeof serverOutput === "string"
                  ? serverOutput
                      .replace(/^```json\s*|^```\s*/i, "")
                      .replace(/```$/i, "")
                  : JSON.stringify(serverOutput, null, 2)}
          </div>
        </div>
      )}
      <div className="sticky bottom-0 py-4 px-4 flex gap-4 min-w-full bg-gray-900 border-t border-gray-700">
        {/* attachment button for file */}
        {/* <button
          className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          onClick={handleAttachmentClick}
          type="button"
          disabled={loading}
        >
          <TiAttachment />
        </button> */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="w-full flex flex-col justify-start p-2 rounded-md bg-gray-700 text-gray-300 gap-2 shadow-inner">
          <input
            // add class names styles - neat
            className="min-w-full px-3 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          onClick={handleVoiceClick}
          type="button"
          disabled={loading}
        >
          <MdKeyboardVoice />
        </button>
        <button
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          onClick={handleSubmit}
          type="button"
          disabled={loading || (!inputText && !attachedFile)}
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
}
