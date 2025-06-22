// // use client
// "use client";
// import { TiAttachment } from "react-icons/ti";
// import { MdKeyboardVoice } from "react-icons/md";
// import { IoSend } from "react-icons/io5";

// import { useRef, useState, useEffect } from "react";
// import { useFile } from "../../context/FileContext";
// import FileInfo from "../FileInfo/FileInfo";

// export default function ChatWindow({
//   setChartData,
//   setTableId,
//   tableId,
//   setChartType,
// }) {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [attachedFile, setAttachedFile] = useState<File | null>(null);
//   const [listening, setListening] = useState(false);
//   const [inputText, setInputText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [serverOutput, setServerOutput] = useState<string | null>(null);
//   const [chatHistory, setChatHistory] = useState<
//     Array<{ type: "user" | "system"; message: string; timestamp: number }>
//   >([]);
//   const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
//   const chatHistoryRef = useRef<HTMLDivElement>(null);
//   const [dragActive, setDragActive] = useState(false);
//   const { fileName, setFileName } = useFile();

//   const handleAttachmentClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setAttachedFile(e.target.files[0]);
//       setFileName(e.target.files[0].name);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       setAttachedFile(e.dataTransfer.files[0]);
//       setFileName(e.dataTransfer.files[0].name);
//     }
//   };

//   const handleVoiceClick = () => {
//     setListening(true);
//     // Simulate listening state for demo; replace with real logic as needed
//     setTimeout(() => setListening(false), 2000);
//   };

//   // Scroll chat to bottom when new messages arrive
//   useEffect(() => {
//     if (chatHistoryRef.current) {
//       chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
//     }
//   }, [chatHistory]);

//   // API call to backend via REST endpoint
//   const handleSubmit = async () => {
//     if (!inputText && !attachedFile) return;
//     setLoading(true);
//     setServerOutput(null);
//     try {
//       let response;
//       if (attachedFile) {
//         const formData = new FormData();
//         formData.append("file", attachedFile);
//         formData.append("prompt", inputText);

//         response = await fetch("http://localhost:4000/api/upload-csv-prompt", {
//           method: "POST",
//           body: formData,
//         });
//       } else {
//         console.log("Current tableId:", tableId);
//         const requestBody: { prompt: string; table?: string } = {
//           prompt: inputText,
//         };
//         if (tableId && typeof tableId === "string" && tableId.trim() !== "") {
//           requestBody.table = tableId;
//           console.log("Adding table to request:", tableId);
//         } else {
//           console.log("No valid tableId available");
//         }
//         console.log("Sending request to userprompt:", requestBody);
//         response = await fetch("http://localhost:4000/api/userprompt", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         });
//       }

//       if (!response.ok) {
//         const errorText = await response.text().catch(() => "Unknown error");
//         console.error(`API Error (${response.status}):`, errorText);
//         console.error("Request was:", requestBody);
//         throw new Error(
//           `Failed to submit prompt: ${response.status} ${response.statusText}`,
//         );
//       }

//       const data = await response.json();
//       // Extract summary from response if available
//       let output = "";
//       if (data && typeof data === "object" && data.summary) {
//         output = data.summary;
//       } else {
//         output =
//           typeof data === "string" ? data : JSON.stringify(data, null, 2);
//       }
//       console.log("Server output:", data);
//       console.log("Response structure:", Object.keys(data));
//       setServerOutput(data); // Store the full data object for access to properties

//       // If the response is valid chart data, set it
//       if (data && typeof data === "object") {
//         // Store the table ID from the response for the title
//         if (data.table) {
//           console.log("Received table ID from response:", data.table);
//           setTableId && setTableId(data.table);
//           console.log("Set table ID to:", data.table);
//         } else {
//           console.log("No table ID in response");
//         }

//         // Set chart type from response if available
//         if (data.chartType && typeof data.chartType === "string") {
//           setChartType && setChartType(data.chartType);
//         }

//         // Set suggested questions if provided by the server
//         if (Array.isArray(data.questions) && data.questions.length > 0) {
//           setSuggestedQuestions(data.questions);
//         } else {
//           setSuggestedQuestions([]);
//         }

//         if (data.summary) {
//           let summary = data.summary;
//           if (typeof summary === "string") {
//             // Check if it contains JSON
//             if (summary.includes("{") && summary.includes("}")) {
//               // Remove ```json or ``` if present, then parse
//               summary = summary.replace(/^```json\s*|^```\s*/i, "");
//               // also remove ``` at endpoint
//               summary = summary.replace(/```$/, "");
//               try {
//                 // convert summary to JSON object
//                 const parsedSummary = JSON.parse(summary);
//                 console.log("Parsed summary:", parsedSummary);
//                 setChartData(parsedSummary);
//               } catch (error) {
//                 console.error("Failed to parse summary JSON:", error);
//                 setChartData(null);
//               }
//             }
//           } else if (typeof summary === "object") {
//             setChartData(summary);
//           }
//         }
//       } else {
//         // If we're doing a regular prompt with no table ID, don't reset chart data
//         if (!attachedFile && !tableId) {
//           console.log("Not changing chart data for regular prompt");
//         } else {
//           // Only reset chart data when we should be showing new chart data
//           setChartData(null);
//         }
//         setSuggestedQuestions([]);
//       }

//       // Text-to-Speech playback
//       if (typeof window !== "undefined" && "speechSynthesis" in window) {
//         const speechText =
//           data && data.summary
//             ? data.summary
//             : typeof data === "string"
//               ? data
//               : JSON.stringify(data);
//         const utter = new window.SpeechSynthesisUtterance(speechText);
//         window.speechSynthesis.speak(utter);
//       }

//       // Add to chat history
//       if (inputText) {
//         setChatHistory((prev) => [
//           ...prev,
//           { type: "user", message: inputText, timestamp: Date.now() },
//         ]);
//       }

//       // Add system response to chat history
//       setChatHistory((prev) => [
//         ...prev,
//         {
//           type: "system",
//           message:
//             data && data.report
//               ? typeof data.report === "string"
//                 ? data.report
//                 : JSON.stringify(data.report, null, 2)
//               : data && data.summary && typeof data.summary === "string"
//                 ? data.summary
//                 : typeof data === "string"
//                   ? data
//                   : JSON.stringify(data, null, 2),
//           timestamp: Date.now(),
//         },
//       ]);

//       setInputText("");
//       setAttachedFile(null);
//       setFileName(null);
//     } catch (err) {
//       // handle error as needed
//       console.error("Request failed:", err);
//       // Add the error to chat history
//       setChatHistory((prev) => [
//         ...prev,
//         {
//           type: "system",
//           message: `Error: ${err.message || "Request failed"}`,
//           timestamp: Date.now(),
//         },
//       ]);
//       setServerOutput(`Error: ${err.message || "Request failed"}`);
//       // Don't reset chart data on error
//       // setChartData(null);
//       // setPromptTitle(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-full flex flex-col bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-700">
//       <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-2">
//         {fileName ? (
//           <FileInfo
//             fileName={fileName}
//             onRemoveFile={() => {
//               setAttachedFile(null);
//               setFileName(null);
//             }}
//           />
//         ) : null}
//       </div>

//       {(listening || loading) && (
//         <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
//           <span className="text-white text-lg font-semibold animate-pulse">
//             {loading ? "Submitting..." : "Listening..."}
//           </span>
//         </div>
//       )}

//       {/* Chat History */}
//       <div
//         ref={chatHistoryRef}
//         className="flex-grow overflow-y-auto flex flex-col gap-3 py-4 px-4"
//         style={{
//           scrollBehavior: "smooth",
//           height: tableId ? "calc(70vh - 170px)" : "calc(70vh - 120px)",
//         }}
//       >
//         {!fileName && !chatHistory.length && !tableId && (
//           <div
//             className={`flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-xl transition-colors duration-200 ${dragActive ? "border-blue-500 bg-blue-500 bg-opacity-10" : "border-gray-700"}`}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <div className="text-5xl mb-6">📊</div>
//             <h3 className="text-2xl font-bold text-white mb-3">
//               Welcome to WoW
//             </h3>
//             <p className="text-gray-400 max-w-md mb-6">
//               Upload a CSV file and ask questions to analyze your data and
//               generate beautiful interactive charts.
//             </p>
//             <div
//               className={`${dragActive ? "" : "animate-bounce"} bg-blue-600 p-2 w-10 h-10 ring-1 ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center mb-2`}
//             >
//               <svg
//                 className="w-6 h-6 text-white"
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   d={
//                     dragActive ? "M5 15l7-7 7 7" : "M19 14l-7 7m0 0l-7-7m7 7V3"
//                   }
//                 ></path>
//               </svg>
//             </div>
//             <p className="text-gray-500 text-sm">
//               {dragActive
//                 ? "Drop your CSV file here"
//                 : "Drag & drop a CSV file here, or click to browse"}
//             </p>
//           </div>
//         )}
//         {tableId && !chatHistory.length && (
//           <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-xl bg-gray-800 bg-opacity-40 backdrop-blur-sm">
//             <div className="text-4xl mb-5">💬</div>
//             <h3 className="text-xl font-bold text-white mb-3">
//               Your charts are ready!
//             </h3>
//             <p className="text-gray-300 max-w-md mb-4">
//               Now you can ask questions about your data. Try these suggestions:
//             </p>
//             <div className="flex flex-col gap-3 w-full max-w-md mb-6">
//               {(suggestedQuestions.length > 0
//                 ? suggestedQuestions
//                 : [
//                     "Summarize the main insights from this data",
//                     "What are the highest and lowest values?",
//                     "Show me the trends over time",
//                   ]
//               ).map((q, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-gray-700 p-3 rounded-md text-left cursor-pointer hover:bg-gray-600 transition-colors"
//                   onClick={() => setInputText(q)}
//                 >
//                   {q}
//                 </div>
//               ))}
//             </div>
//             <p className="text-blue-400 text-sm animate-pulse">
//               Click on any suggestion to use it, or type your own question below
//             </p>
//           </div>
//         )}
//         {chatHistory.length > 0 &&
//           chatHistory.map((chat, index) => (
//             <div
//               key={`chat-${index}-${chat.timestamp}`}
//               className={`
//               p-4 rounded-lg shadow-md animate-fadeIn
//               ${
//                 chat.type === "user"
//                   ? "bg-blue-600 text-white ml-auto rounded-br-none"
//                   : "bg-gray-800 text-white border border-gray-700 rounded-bl-none"
//               }
//               max-w-[80%] ${chat.type === "user" ? "self-end" : "self-start"}
//               transition-all duration-300 ease-in-out
//               hover:shadow-lg backdrop-blur-sm
//             `}
//               style={{
//                 animationDelay: `${index * 0.05}s`,
//                 animationDuration: "0.3s",
//               }}
//             >
//               <div className="whitespace-pre-wrap break-words">
//                 {chat.type === "system"
//                   ? chat.message
//                       .replace(/^```json\s*|^```\s*/i, "")
//                       .replace(/```$/i, "")
//                   : chat.message}
//               </div>
//               <div
//                 className={`text-xs mt-1 ${chat.type === "user" ? "text-blue-200" : "text-gray-400"}`}
//               >
//                 {new Date(chat.timestamp).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </div>
//             </div>
//           ))}
//       </div>

//       {serverOutput && !chatHistory.length && (
//         <div className="mb-4 p-4 rounded-lg bg-gray-800 text-white border border-gray-700 overflow-y-auto max-h-[250px] backdrop-blur-sm shadow-md">
//           <strong>Response:</strong>
//           <div className="whitespace-pre-wrap break-words">
//             {typeof serverOutput === "object" && tableId && serverOutput.report
//               ? typeof serverOutput.report === "string"
//                 ? serverOutput.report
//                 : JSON.stringify(serverOutput.report, null, 2)
//               : typeof serverOutput === "object" && serverOutput.summary
//                 ? serverOutput.summary
//                 : typeof serverOutput === "string"
//                   ? serverOutput
//                       .replace(/^```json\s*|^```\s*/i, "")
//                       .replace(/```$/i, "")
//                   : JSON.stringify(serverOutput, null, 2)}
//           </div>
//         </div>
//       )}
//       <div className="sticky bottom-0 py-4 px-4 flex gap-4 min-w-full bg-gray-900 border-t border-gray-700">
//         {/* attachment button for file */}
//         {/* <button
//           className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
//           onClick={handleAttachmentClick}
//           type="button"
//           disabled={loading}
//         >
//           <TiAttachment />
//         </button> */}
//         <input
//           ref={fileInputRef}
//           type="file"
//           className="hidden"
//           onChange={handleFileChange}
//         />

//         <div className="w-full flex flex-col justify-start p-2 rounded-md bg-gray-700 text-gray-300 gap-2 shadow-inner">
//           <input
//             // add class names styles - neat
//             className="min-w-full px-3 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
//             type="text"
//             placeholder="Type your message..."
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             disabled={loading}
//           />
//         </div>

//         <button
//           className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
//           onClick={handleVoiceClick}
//           type="button"
//           disabled={loading}
//         >
//           <MdKeyboardVoice />
//         </button>
//         <button
//           className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
//           onClick={handleSubmit}
//           type="button"
//           disabled={loading || (!inputText && !attachedFile)}
//         >
//           <IoSend />
//         </button>
//       </div>
//     </div>
//   );
// }


// use client
// "use client";
// import { TiAttachment } from "react-icons/ti";
// import { IoSend } from "react-icons/io5";

// import { useRef, useState, useEffect } from "react";
// import { useFile } from "../../context/FileContext";
// import FileInfo from "../FileInfo/FileInfo";

// export default function ChatWindow({
//   setChartData,
//   setTableId,
//   tableId,
//   setChartType,
// }) {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [attachedFile, setAttachedFile] = useState<File | null>(null);
//   const [inputText, setInputText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [serverOutput, setServerOutput] = useState<string | null>(null);
//   const [chatHistory, setChatHistory] = useState<
//     Array<{ type: "user" | "system"; message: string; timestamp: number }>
//   >([]);
//   const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
//   const chatHistoryRef = useRef<HTMLDivElement>(null);
//   const [dragActive, setDragActive] = useState(false);
//   const { fileName, setFileName } = useFile();

//   const handleAttachmentClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setAttachedFile(e.target.files[0]);
//       setFileName(e.target.files[0].name);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       setAttachedFile(e.dataTransfer.files[0]);
//       setFileName(e.dataTransfer.files[0].name);
//     }
//   };

//   // Scroll chat to bottom when new messages arrive
//   useEffect(() => {
//     if (chatHistoryRef.current) {
//       chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
//     }
//   }, [chatHistory]);

//   // API call to backend via REST endpoint
//   const handleSubmit = async () => {
//     if (!inputText && !attachedFile) return;
//     setLoading(true);
//     setServerOutput(null);
//     try {
//       let response;
//       if (attachedFile) {
//         const formData = new FormData();
//         formData.append("file", attachedFile);
//         formData.append("prompt", inputText);

//         response = await fetch("http://localhost:4000/api/upload-csv-prompt", {
//           method: "POST",
//           body: formData,
//         });
//       } else {
//         console.log("Current tableId:", tableId);
//         const requestBody: { prompt: string; table?: string } = {
//           prompt: inputText,
//         };
//         if (tableId && typeof tableId === "string" && tableId.trim() !== "") {
//           requestBody.table = tableId;
//           console.log("Adding table to request:", tableId);
//         } else {
//           console.log("No valid tableId available");
//         }
//         console.log("Sending request to userprompt:", requestBody);
//         response = await fetch("http://localhost:4000/api/userprompt", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         });
//       }

//       if (!response.ok) {
//         const errorText = await response.text().catch(() => "Unknown error");
//         console.error(`API Error (${response.status}):`, errorText);
//         console.error("Request was:", requestBody);
//         throw new Error(
//           `Failed to submit prompt: ${response.status} ${response.statusText}`,
//         );
//       }

//       const data = await response.json();
//       // Extract summary from response if available
//       let output = "";
//       if (data && typeof data === "object" && data.summary) {
//         output = data.summary;
//       } else {
//         output =
//           typeof data === "string" ? data : JSON.stringify(data, null, 2);
//       }
//       console.log("Server output:", data);
//       console.log("Response structure:", Object.keys(data));
//       setServerOutput(data); // Store the full data object for access to properties

//       // If the response is valid chart data, set it
//       if (data && typeof data === "object") {
//         // Store the table ID from the response for the title
//         if (data.table) {
//           console.log("Received table ID from response:", data.table);
//           setTableId && setTableId(data.table);
//           console.log("Set table ID to:", data.table);
//         } else {
//           console.log("No table ID in response");
//         }

//         // Set chart type from response if available
//         if (data.chartType && typeof data.chartType === "string") {
//           setChartType && setChartType(data.chartType);
//         }

//         // Set suggested questions if provided by the server
//         if (Array.isArray(data.questions) && data.questions.length > 0) {
//           setSuggestedQuestions(data.questions);
//         } else {
//           setSuggestedQuestions([]);
//         }

//         if (data.summary) {
//           let summary = data.summary;
//           if (typeof summary === "string") {
//             // Check if it contains JSON
//             if (summary.includes("{") && summary.includes("}")) {
//               // Remove ```json or ``` if present, then parse
//               summary = summary.replace(/^```json\s*|^```\s*/i, "");
//               // also remove ``` at endpoint
//               summary = summary.replace(/```$/, "");
//               try {
//                 // convert summary to JSON object
//                 const parsedSummary = JSON.parse(summary);
//                 console.log("Parsed summary:", parsedSummary);
//                 setChartData(parsedSummary);
//               } catch (error) {
//                 console.error("Failed to parse summary JSON:", error);
//                 setChartData(null);
//               }
//             }
//           } else if (typeof summary === "object") {
//             setChartData(summary);
//           }
//         }
//       } else {
//         // If we're doing a regular prompt with no table ID, don't reset chart data
//         if (!attachedFile && !tableId) {
//           console.log("Not changing chart data for regular prompt");
//         } else {
//           // Only reset chart data when we should be showing new chart data
//           setChartData(null);
//         }
//         setSuggestedQuestions([]);
//       }

//       // Add to chat history
//       if (inputText) {
//         setChatHistory((prev) => [
//           ...prev,
//           { type: "user", message: inputText, timestamp: Date.now() },
//         ]);
//       }

//       // Add system response to chat history
//       setChatHistory((prev) => [
//         ...prev,
//         {
//           type: "system",
//           message:
//             data && data.report
//               ? typeof data.report === "string"
//                 ? data.report
//                 : JSON.stringify(data.report, null, 2)
//               : data && data.summary && typeof data.summary === "string"
//                 ? data.summary
//                 : typeof data === "string"
//                   ? data
//                   : JSON.stringify(data, null, 2),
//           timestamp: Date.now(),
//         },
//       ]);

//       setInputText("");
//       setAttachedFile(null);
//       setFileName(null);
//     } catch (err) {
//       // handle error as needed
//       console.error("Request failed:", err);
//       // Add the error to chat history
//       setChatHistory((prev) => [
//         ...prev,
//         {
//           type: "system",
//           message: `Error: ${err.message || "Request failed"}`,
//           timestamp: Date.now(),
//         },
//       ]);
//       setServerOutput(`Error: ${err.message || "Request failed"}`);
//       // Don't reset chart data on error
//       // setChartData(null);
//       // setPromptTitle(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-full flex flex-col bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-700">
//       <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-2">
//         {fileName ? (
//           <FileInfo
//             fileName={fileName}
//             onRemoveFile={() => {
//               setAttachedFile(null);
//               setFileName(null);
//             }}
//           />
//         ) : null}
//       </div>

//       {loading && (
//         <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
//           <span className="text-white text-lg font-semibold animate-pulse">
//             Submitting...
//           </span>
//         </div>
//       )}

//       {/* Chat History */}
//       <div
//         ref={chatHistoryRef}
//         className="flex-grow overflow-y-auto flex flex-col gap-3 py-4 px-4"
//         style={{
//           scrollBehavior: "smooth",
//           height: tableId ? "calc(70vh - 170px)" : "calc(70vh - 120px)",
//         }}
//       >
//         {!fileName && !chatHistory.length && !tableId && (
//           <div
//             className={`flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-xl transition-colors duration-200 ${dragActive ? "border-blue-500 bg-blue-500 bg-opacity-10" : "border-gray-700"}`}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <div className="text-5xl mb-6">📊</div>
//             <h3 className="text-2xl font-bold text-white mb-3">
//               Welcome to WoW
//             </h3>
//             <p className="text-gray-400 max-w-md mb-6">
//               Upload a CSV file and ask questions to analyze your data and
//               generate beautiful interactive charts.
//             </p>
//             <div
//               className={`${dragActive ? "" : "animate-bounce"} bg-blue-600 p-2 w-10 h-10 ring-1 ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center mb-2`}
//             >
//               <svg
//                 className="w-6 h-6 text-white"
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   d={
//                     dragActive ? "M5 15l7-7 7 7" : "M19 14l-7 7m0 0l-7-7m7 7V3"
//                   }
//                 ></path>
//               </svg>
//             </div>
//             <p className="text-gray-500 text-sm">
//               {dragActive
//                 ? "Drop your CSV file here"
//                 : "Drag & drop a CSV file here, or click to browse"}
//             </p>
//           </div>
//         )}
//         {tableId && !chatHistory.length && (
//           <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-xl bg-gray-800 bg-opacity-40 backdrop-blur-sm">
//             <div className="text-4xl mb-5">💬</div>
//             <h3 className="text-xl font-bold text-white mb-3">
//               Your charts are ready!
//             </h3>
//             <p className="text-gray-300 max-w-md mb-4">
//               Now you can ask questions about your data. Try these suggestions:
//             </p>
//             <div className="flex flex-col gap-3 w-full max-w-md mb-6">
//               {(suggestedQuestions.length > 0
//                 ? suggestedQuestions
//                 : [
//                     "Summarize the main insights from this data",
//                     "What are the highest and lowest values?",
//                     "Show me the trends over time",
//                   ]
//               ).map((q, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-gray-700 p-3 rounded-md text-left cursor-pointer hover:bg-gray-600 transition-colors"
//                   onClick={() => setInputText(q)}
//                 >
//                   {q}
//                 </div>
//               ))}
//             </div>
//             <p className="text-blue-400 text-sm animate-pulse">
//               Click on any suggestion to use it, or type your own question below
//             </p>
//           </div>
//         )}
//         {chatHistory.length > 0 &&
//           chatHistory.map((chat, index) => (
//             <div
//               key={`chat-${index}-${chat.timestamp}`}
//               className={`
//               p-4 rounded-lg shadow-md animate-fadeIn
//               ${
//                 chat.type === "user"
//                   ? "bg-blue-600 text-white ml-auto rounded-br-none"
//                   : "bg-gray-800 text-white border border-gray-700 rounded-bl-none"
//               }
//               max-w-[80%] ${chat.type === "user" ? "self-end" : "self-start"}
//               transition-all duration-300 ease-in-out
//               hover:shadow-lg backdrop-blur-sm
//             `}
//               style={{
//                 animationDelay: `${index * 0.05}s`,
//                 animationDuration: "0.3s",
//               }}
//             >
//               <div className="whitespace-pre-wrap break-words">
//                 {chat.type === "system"
//                   ? chat.message
//                       .replace(/^```json\s*|^```\s*/i, "")
//                       .replace(/```$/i, "")
//                   : chat.message}
//               </div>
//               <div
//                 className={`text-xs mt-1 ${chat.type === "user" ? "text-blue-200" : "text-gray-400"}`}
//               >
//                 {new Date(chat.timestamp).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </div>
//             </div>
//           ))}
//       </div>

//       {serverOutput && !chatHistory.length && (
//         <div className="mb-4 p-4 rounded-lg bg-gray-800 text-white border border-gray-700 overflow-y-auto max-h-[250px] backdrop-blur-sm shadow-md">
//           <strong>Response:</strong>
//           <div className="whitespace-pre-wrap break-words">
//             {typeof serverOutput === "object" && tableId && serverOutput.report
//               ? typeof serverOutput.report === "string"
//                 ? serverOutput.report
//                 : JSON.stringify(serverOutput.report, null, 2)
//               : typeof serverOutput === "object" && serverOutput.summary
//                 ? serverOutput.summary
//                 : typeof serverOutput === "string"
//                   ? serverOutput
//                       .replace(/^```json\s*|^```\s*/i, "")
//                       .replace(/```$/i, "")
//                   : JSON.stringify(serverOutput, null, 2)}
//           </div>
//         </div>
//       )}
//       <div className="sticky bottom-0 py-4 px-4 flex gap-4 min-w-full bg-gray-900 border-t border-gray-700">
//         {/* attachment button for file */}
//         {/* <button
//           className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
//           onClick={handleAttachmentClick}
//           type="button"
//           disabled={loading}
//         >
//           <TiAttachment />
//         </button> */}
//         <input
//           ref={fileInputRef}
//           type="file"
//           className="hidden"
//           onChange={handleFileChange}
//         />

//         <div className="w-full flex flex-col justify-start p-2 rounded-md bg-gray-700 text-gray-300 gap-2 shadow-inner">
//           <input
//             // add class names styles - neat
//             className="min-w-full px-3 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
//             type="text"
//             placeholder="Type your message..."
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             disabled={loading}
//           />
//         </div>

//         <button
//           className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
//           onClick={handleSubmit}
//           type="button"
//           disabled={loading || (!inputText && !attachedFile)}
//         >
//           <IoSend />
//         </button>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { TiAttachment } from "react-icons/ti";
// import { IoSend } from "react-icons/io5";
// import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa"; // Add this import

// import { useRef, useState, useEffect } from "react";
// import { useFile } from "../../context/FileContext";
// import FileInfo from "../FileInfo/FileInfo";

// export default function ChatWindow({
//   setChartData,
//   setTableId,
//   tableId,
//   setChartType,
// }) {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [attachedFile, setAttachedFile] = useState<File | null>(null);
//   const [inputText, setInputText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [serverOutput, setServerOutput] = useState<string | null>(null);
//   const [chatHistory, setChatHistory] = useState<
//     Array<{ type: "user" | "system"; message: string; timestamp: number }>
//   >([]);
//   const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
//   const chatHistoryRef = useRef<HTMLDivElement>(null);
//   const [dragActive, setDragActive] = useState(false);
//   const { fileName, setFileName } = useFile();

//   // Speech-to-text states
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
//   const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
//   const [isRecording, setIsRecording] = useState(false);
//   const [listening, setListening] = useState(false); // For transcription processing

//   // API KEY CONFIGURATION
//   const ELEVENLABS_API_KEY = "sk_4ce34b9f3d8478ac9e07a0641a901eedcf32e4b05328de83";

//   // CORE TRANSCRIPTION FUNCTION
//   const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
//     const formData = new FormData();
//     formData.append('file', audioBlob, 'recording.webm');
//     formData.append('model_id', 'scribe_v1');

//     const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
//       method: 'POST',
//       headers: {
//         'xi-api-key': ELEVENLABS_API_KEY
//       },
//       body: formData
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Speech-to-text failed: ${response.status} - ${errorText}`);
//     }

//     const result = await response.json();
//     return result.text || '';
//   };

//   // START RECORDING FUNCTION
//   const startRecording = async () => {
//     try {
//       // Request microphone access
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         audio: {
//           channelCount: 1,
//           sampleRate: 16000,
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true
//         } 
//       });
      
//       // Create MediaRecorder
//       const recorder = new MediaRecorder(stream);
//       const chunks: Blob[] = [];

//       // Handle data collection
//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunks.push(event.data);
//         }
//       };

//       // Handle recording stop
//       recorder.onstop = async () => {
//         setListening(true); // Show processing UI
        
//         try {
//           // Create audio blob
//           const audioBlob = new Blob(chunks, { type: 'audio/webm' });
//           console.log('Audio recorded:', audioBlob.size, 'bytes');
          
//           // Transcribe audio
//           const transcribedText = await transcribeAudio(audioBlob);
          
//           // Use transcribed text
//           if (transcribedText.trim()) {
//             setInputText(transcribedText);
//             console.log('Transcribed:', transcribedText);
//           }
          
//         } catch (error) {
//           console.error('Transcription error:', error);
//           alert('Transcription failed. Please try again.');
//         } finally {
//           setListening(false); // Hide processing UI
//         }
//       };

//       // Start recording
//       recorder.start();
//       setMediaRecorder(recorder);
//       setAudioChunks(chunks);
//       setIsRecording(true);
      
//     } catch (error) {
//       console.error('Microphone access denied:', error);
//       alert('Microphone access required. Please allow and try again.');
//     }
//   };

//   // STOP RECORDING FUNCTION
//   const stopRecording = () => {
//     if (mediaRecorder && mediaRecorder.state === 'recording') {
//       mediaRecorder.stop();
//       mediaRecorder.stream.getTracks().forEach(track => track.stop());
//       setIsRecording(false);
//       setMediaRecorder(null);
//     }
//   };

//   // VOICE BUTTON HANDLER
//   const handleVoiceClick = async () => {
//     if (!isRecording) {
//       await startRecording();
//     } else {
//       stopRecording();
//     }
//   };

//   const handleAttachmentClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setAttachedFile(e.target.files[0]);
//       setFileName(e.target.files[0].name);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       setAttachedFile(e.dataTransfer.files[0]);
//       setFileName(e.dataTransfer.files[0].name);
//     }
//   };

//   // Scroll chat to bottom when new messages arrive
//   useEffect(() => {
//     if (chatHistoryRef.current) {
//       chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
//     }
//   }, [chatHistory]);

//   // API call to backend via REST endpoint
//   const handleSubmit = async () => {
//     if (!inputText && !attachedFile) return;
//     setLoading(true);
//     setServerOutput(null);
//     try {
//       let response;
//       if (attachedFile) {
//         const formData = new FormData();
//         formData.append("file", attachedFile);
//         formData.append("prompt", inputText);

//         response = await fetch("http://localhost:4000/api/upload-csv-prompt", {
//           method: "POST",
//           body: formData,
//         });
//       } else {
//         console.log("Current tableId:", tableId);
//         const requestBody: { prompt: string; table?: string } = {
//           prompt: inputText,
//         };
//         if (tableId && typeof tableId === "string" && tableId.trim() !== "") {
//           requestBody.table = tableId;
//           console.log("Adding table to request:", tableId);
//         } else {
//           console.log("No valid tableId available");
//         }
//         console.log("Sending request to userprompt:", requestBody);
//         response = await fetch("http://localhost:4000/api/userprompt", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         });
//       }

//       if (!response.ok) {
//         const errorText = await response.text().catch(() => "Unknown error");
//         console.error(`API Error (${response.status}):`, errorText);
//         console.error("Request was:", requestBody);
//         throw new Error(
//           `Failed to submit prompt: ${response.status} ${response.statusText}`,
//         );
//       }

//       const data = await response.json();
//       // Extract summary from response if available
//       let output = "";
//       if (data && typeof data === "object" && data.summary) {
//         output = data.summary;
//       } else {
//         output =
//           typeof data === "string" ? data : JSON.stringify(data, null, 2);
//       }
//       console.log("Server output:", data);
//       console.log("Response structure:", Object.keys(data));
//       setServerOutput(data); // Store the full data object for access to properties

//       // If the response is valid chart data, set it
//       if (data && typeof data === "object") {
//         // Store the table ID from the response for the title
//         if (data.table) {
//           console.log("Received table ID from response:", data.table);
//           setTableId && setTableId(data.table);
//           console.log("Set table ID to:", data.table);
//         } else {
//           console.log("No table ID in response");
//         }

//         // Set chart type from response if available
//         if (data.chartType && typeof data.chartType === "string") {
//           setChartType && setChartType(data.chartType);
//         }

//         // Set suggested questions if provided by the server
//         if (Array.isArray(data.questions) && data.questions.length > 0) {
//           setSuggestedQuestions(data.questions);
//         } else {
//           setSuggestedQuestions([]);
//         }

//         if (data.summary) {
//           let summary = data.summary;
//           if (typeof summary === "string") {
//             // Check if it contains JSON
//             if (summary.includes("{") && summary.includes("}")) {
//               // Remove ```json or ``` if present, then parse
//               summary = summary.replace(/^```json\s*|^```\s*/i, "");
//               // also remove ``` at endpoint
//               summary = summary.replace(/```$/, "");
//               try {
//                 // convert summary to JSON object
//                 const parsedSummary = JSON.parse(summary);
//                 console.log("Parsed summary:", parsedSummary);
//                 setChartData(parsedSummary);
//               } catch (error) {
//                 console.error("Failed to parse summary JSON:", error);
//                 setChartData(null);
//               }
//             }
//           } else if (typeof summary === "object") {
//             setChartData(summary);
//           }
//         }
//       } else {
//         // If we're doing a regular prompt with no table ID, don't reset chart data
//         if (!attachedFile && !tableId) {
//           console.log("Not changing chart data for regular prompt");
//         } else {
//           // Only reset chart data when we should be showing new chart data
//           setChartData(null);
//         }
//         setSuggestedQuestions([]);
//       }

//       // Add to chat history
//       if (inputText) {
//         setChatHistory((prev) => [
//           ...prev,
//           { type: "user", message: inputText, timestamp: Date.now() },
//         ]);
//       }

//       // Add system response to chat history
//       setChatHistory((prev) => [
//         ...prev,
//         {
//           type: "system",
//           message:
//             data && data.report
//               ? typeof data.report === "string"
//                 ? data.report
//                 : JSON.stringify(data.report, null, 2)
//               : data && data.summary && typeof data.summary === "string"
//                 ? data.summary
//                 : typeof data === "string"
//                   ? data
//                   : JSON.stringify(data, null, 2),
//           timestamp: Date.now(),
//         },
//       ]);

//       setInputText("");
//       setAttachedFile(null);
//       setFileName(null);
//     } catch (err) {
//       // handle error as needed
//       console.error("Request failed:", err);
//       // Add the error to chat history
//       setChatHistory((prev) => [
//         ...prev,
//         {
//           type: "system",
//           message: `Error: ${err.message || "Request failed"}`,
//           timestamp: Date.now(),
//         },
//       ]);
//       setServerOutput(`Error: ${err.message || "Request failed"}`);
//       // Don't reset chart data on error
//       // setChartData(null);
//       // setPromptTitle(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-full flex flex-col bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-700">
//       <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-2">
//         {fileName ? (
//           <FileInfo
//             fileName={fileName}
//             onRemoveFile={() => {
//               setAttachedFile(null);
//               setFileName(null);
//             }}
//           />
//         ) : null}
//       </div>

//       {(loading || listening) && (
//         <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
//           <span className="text-white text-lg font-semibold animate-pulse">
//             {loading ? "Submitting..." : listening ? "Transcribing..." : "Processing..."}
//           </span>
//         </div>
//       )}

//       {/* Chat History */}
//       <div
//         ref={chatHistoryRef}
//         className="flex-grow overflow-y-auto flex flex-col gap-3 py-4 px-4"
//         style={{
//           scrollBehavior: "smooth",
//           height: tableId ? "calc(70vh - 170px)" : "calc(70vh - 120px)",
//         }}
//       >
//         {!fileName && !chatHistory.length && !tableId && (
//           <div
//             className={`flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-xl transition-colors duration-200 ${dragActive ? "border-blue-500 bg-blue-500 bg-opacity-10" : "border-gray-700"}`}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <div className="text-5xl mb-6">📊</div>
//             <h3 className="text-2xl font-bold text-white mb-3">
//               Welcome to WoW
//             </h3>
//             <p className="text-gray-400 max-w-md mb-6">
//               Upload a CSV file and ask questions to analyze your data and
//               generate beautiful interactive charts.
//             </p>
//             <div
//               className={`${dragActive ? "" : "animate-bounce"} bg-blue-600 p-2 w-10 h-10 ring-1 ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center mb-2`}
//             >
//               <svg
//                 className="w-6 h-6 text-white"
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   d={
//                     dragActive ? "M5 15l7-7 7 7" : "M19 14l-7 7m0 0l-7-7m7 7V3"
//                   }
//                 ></path>
//               </svg>
//             </div>
//             <p className="text-gray-500 text-sm">
//               {dragActive
//                 ? "Drop your CSV file here"
//                 : "Drag & drop a CSV file here, or click to browse"}
//             </p>
//           </div>
//         )}
//         {tableId && !chatHistory.length && (
//           <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-xl bg-gray-800 bg-opacity-40 backdrop-blur-sm">
//             <div className="text-4xl mb-5">💬</div>
//             <h3 className="text-xl font-bold text-white mb-3">
//               Your charts are ready!
//             </h3>
//             <p className="text-gray-300 max-w-md mb-4">
//               Now you can ask questions about your data. Try these suggestions or use voice input:
//             </p>
//             <div className="flex flex-col gap-3 w-full max-w-md mb-6">
//               {(suggestedQuestions.length > 0
//                 ? suggestedQuestions
//                 : [
//                     "Summarize the main insights from this data",
//                     "What are the highest and lowest values?",
//                     "Show me the trends over time",
//                   ]
//               ).map((q, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-gray-700 p-3 rounded-md text-left cursor-pointer hover:bg-gray-600 transition-colors"
//                   onClick={() => setInputText(q)}
//                 >
//                   {q}
//                 </div>
//               ))}
//             </div>
//             <p className="text-blue-400 text-sm animate-pulse">
//               Click on any suggestion to use it, or type/speak your own question below
//             </p>
//           </div>
//         )}
//         {chatHistory.length > 0 &&
//           chatHistory.map((chat, index) => (
//             <div
//               key={`chat-${index}-${chat.timestamp}`}
//               className={`
//               p-4 rounded-lg shadow-md animate-fadeIn
//               ${
//                 chat.type === "user"
//                   ? "bg-blue-600 text-white ml-auto rounded-br-none"
//                   : "bg-gray-800 text-white border border-gray-700 rounded-bl-none"
//               }
//               max-w-[80%] ${chat.type === "user" ? "self-end" : "self-start"}
//               transition-all duration-300 ease-in-out
//               hover:shadow-lg backdrop-blur-sm
//             `}
//               style={{
//                 animationDelay: `${index * 0.05}s`,
//                 animationDuration: "0.3s",
//               }}
//             >
//               <div className="whitespace-pre-wrap break-words">
//                 {chat.type === "system"
//                   ? chat.message
//                       .replace(/^```json\s*|^```\s*/i, "")
//                       .replace(/```$/i, "")
//                   : chat.message}
//               </div>
//               <div
//                 className={`text-xs mt-1 ${chat.type === "user" ? "text-blue-200" : "text-gray-400"}`}
//               >
//                 {new Date(chat.timestamp).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </div>
//             </div>
//           ))}
//       </div>

//       {serverOutput && !chatHistory.length && (
//         <div className="mb-4 p-4 rounded-lg bg-gray-800 text-white border border-gray-700 overflow-y-auto max-h-[250px] backdrop-blur-sm shadow-md">
//           <strong>Response:</strong>
//           <div className="whitespace-pre-wrap break-words">
//             {typeof serverOutput === "object" && tableId && serverOutput.report
//               ? typeof serverOutput.report === "string"
//                 ? serverOutput.report
//                 : JSON.stringify(serverOutput.report, null, 2)
//               : typeof serverOutput === "object" && serverOutput.summary
//                 ? serverOutput.summary
//                 : typeof serverOutput === "string"
//                   ? serverOutput
//                       .replace(/^```json\s*|^```\s*/i, "")
//                       .replace(/```$/i, "")
//                   : JSON.stringify(serverOutput, null, 2)}
//           </div>
//         </div>
//       )}
      
//       {/* INPUT AREA WITH SPEECH BUTTON */}
//       <div className="sticky bottom-0 py-4 px-4 flex gap-2 min-w-full bg-gray-900 border-t border-gray-700">
//         <input
//           ref={fileInputRef}
//           type="file"
//           className="hidden"
//           onChange={handleFileChange}
//         />

//         <div className="w-full flex flex-col justify-start p-2 rounded-md bg-gray-700 text-gray-300 gap-2 shadow-inner">
//           <input
//             className="min-w-full px-3 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
//             type="text"
//             placeholder={isRecording ? "Recording..." : listening ? "Transcribing..." : "Type your message or click mic to speak..."}
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             disabled={loading || isRecording || listening}
//           />
//         </div>

//         {/* SPEECH-TO-TEXT BUTTON */}
//         <button
//           className={`px-4 py-2 rounded-md transition-colors ${
//             isRecording 
//               ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
//               : 'bg-green-600 hover:bg-green-700'
//           } text-white`}
//           onClick={handleVoiceClick}
//           type="button"
//           disabled={loading || listening}
//           title={isRecording ? "Stop recording" : "Start voice recording"}
//         >
//           {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
//         </button>

//         <button
//           className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
//           onClick={handleSubmit}
//           type="button"
//           disabled={loading || (!inputText && !attachedFile)}
//         >
//           <IoSend />
//         </button>
//       </div>
//     </div>
//   );
// }

//kaushik
// "use client";
// import { TiAttachment } from "react-icons/ti";
// import { IoSend } from "react-icons/io5";
// import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

// import { useRef, useState, useEffect } from "react";
// import { useFile } from "../../context/FileContext";
// import FileInfo from "../FileInfo/FileInfo";

// export default function ChatWindow({
//   setChartData,
//   setTableId,
//   tableId,
//   setChartType,
// }) {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [attachedFile, setAttachedFile] = useState<File | null>(null);
//   const [inputText, setInputText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [serverOutput, setServerOutput] = useState<string | null>(null);
//   const [chatHistory, setChatHistory] = useState<
//     Array<{ type: "user" | "system"; message: string; timestamp: number }>
//   >([]);
//   const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
//   const chatHistoryRef = useRef<HTMLDivElement>(null);
//   const [dragActive, setDragActive] = useState(false);
//   const { fileName, setFileName } = useFile();

//   // Speech-to-text states
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
//   const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
//   const [isRecording, setIsRecording] = useState(false);
//   const [listening, setListening] = useState(false);

//   // API KEY CONFIGURATION
//   const ELEVENLABS_API_KEY = "sk_4ce34b9f3d8478ac9e07a0641a901eedcf32e4b05328de83";

//   // CORE TRANSCRIPTION FUNCTION
//   const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
//     const formData = new FormData();
//     formData.append('file', audioBlob, 'recording.webm');
//     formData.append('model_id', 'scribe_v1');

//     const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
//       method: 'POST',
//       headers: {
//         'xi-api-key': ELEVENLABS_API_KEY
//       },
//       body: formData
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Speech-to-text failed: ${response.status} - ${errorText}`);
//     }

//     const result = await response.json();
//     return result.text || '';
//   };

//   // START RECORDING FUNCTION
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         audio: {
//           channelCount: 1,
//           sampleRate: 16000,
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true
//         } 
//       });
      
//       const recorder = new MediaRecorder(stream);
//       const chunks: Blob[] = [];

//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunks.push(event.data);
//         }
//       };

//       recorder.onstop = async () => {
//         setListening(true);
        
//         try {
//           const audioBlob = new Blob(chunks, { type: 'audio/webm' });
//           console.log('Audio recorded:', audioBlob.size, 'bytes');
          
//           const transcribedText = await transcribeAudio(audioBlob);
          
//           if (transcribedText.trim()) {
//             setInputText(transcribedText);
//             console.log('Transcribed:', transcribedText);
//           }
          
//         } catch (error) {
//           console.error('Transcription error:', error);
//           alert('Transcription failed. Please try again.');
//         } finally {
//           setListening(false);
//         }
//       };

//       recorder.start();
//       setMediaRecorder(recorder);
//       setAudioChunks(chunks);
//       setIsRecording(true);
      
//     } catch (error) {
//       console.error('Microphone access denied:', error);
//       alert('Microphone access required. Please allow and try again.');
//     }
//   };

//   // STOP RECORDING FUNCTION
//   const stopRecording = () => {
//     if (mediaRecorder && mediaRecorder.state === 'recording') {
//       mediaRecorder.stop();
//       mediaRecorder.stream.getTracks().forEach(track => track.stop());
//       setIsRecording(false);
//       setMediaRecorder(null);
//     }
//   };

//   // VOICE BUTTON HANDLER
//   const handleVoiceClick = async () => {
//     if (!isRecording) {
//       await startRecording();
//     } else {
//       stopRecording();
//     }
//   };

//   const handleAttachmentClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setAttachedFile(e.target.files[0]);
//       setFileName(e.target.files[0].name);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDiveline>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       setAttachedFile(e.dataTransfer.files[0]);
//       setFileName(e.dataTransfer.files[0].name);
//     }
//   };

//   // Scroll chat to bottom when new messages arrive
//   useEffect(() => {
//     if (chatHistoryRef.current) {
//       chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
//     }
//   }, [chatHistory]);

//   // API call to backend via REST endpoint
//   const handleSubmit = async () => {
//     if (!inputText && !attachedFile) return;
//     setLoading(true);
//     setServerOutput(null);
    
//     let requestBody: any = null;
    
//     try {
//       let response;
//       if (attachedFile) {
//         const formData = new FormData();
//         formData.append("file", attachedFile);
//         formData.append("prompt", inputText);

//         requestBody = { file: attachedFile.name, prompt: inputText };

//         response = await fetch("http://localhost:4000/api/upload-csv-prompt", {
//           method: "POST",
//           body: formData,
//         });
//       } else {
//         console.log("Current tableId:", tableId);
//         requestBody = {
//           prompt: inputText,
//         };
//         if (tableId && typeof tableId === "string" && tableId.trim() !== "") {
//           requestBody.table = tableId;
//           console.log("Adding table to request:", tableId);
//         } else {
//           console.log("No valid tableId available");
//         }
//         console.log("Sending request to userprompt:", requestBody);
//         response = await fetch("http://localhost:4000/api/userprompt", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         });
//       }

//       if (!response.ok) {
//         const errorText = await response.text().catch(() => "Unknown error");
//         console.error(`API Error (${response.status}):`, errorText);
//         console.error("Request was:", requestBody);
//         throw new Error(
//           `Failed to submit prompt: ${response.status} ${response.statusText}`,
//         );
//       }

//       const data = await response.json();
//       let output = "";
//       if (data && typeof data === "object" && data.summary) {
//         output = data.summary;
//       } else {
//         output =
//           typeof data === "string" ? data : JSON.stringify(data, null, 2);
//       }
//       console.log("Server output:", data);
//       console.log("Response structure:", Object.keys(data));
//       setServerOutput(data);

//       // If the response is valid chart data, set it
//       if (data && typeof data === "object") {
//         // Store the table ID from the response for the title
//         if (data.table) {
//           console.log("Received table ID from response:", data.table);
//           setTableId && setTableId(data.table);
//           console.log("Set table ID to:", data.table);
//         } else {
//           console.log("No table ID in response");
//         }

//         // Set chart type from response if available
//         if (data.chartType && typeof data.chartType === "string") {
//           setChartType && setChartType(data.chartType);
//         }

//         // Set suggested questions if provided by the server
//         if (Array.isArray(data.questions) && data.questions.length > 0) {
//           setSuggestedQuestions(data.questions);
//         } else {
//           setSuggestedQuestions([]);
//         }

//         if (data.summary) {
//           let summary = data.summary;
//           if (typeof summary === "string") {
//             // Check if it contains JSON
//             if (summary.includes("{") && summary.includes("}")) {
//               // Remove ```json or ``` if present, then parse
//               summary = summary.replace(/^```json\s*|^```\s*/i, "");
//               // also remove ``` at endpoint
//               summary = summary.replace(/```$/, "");
//               try {
//                 // convert summary to JSON object
//                 const parsedSummary = JSON.parse(summary);
//                 console.log("Parsed summary:", parsedSummary);
//                 setChartData(parsedSummary);
//               } catch (error) {
//                 console.error("Failed to parse summary JSON:", error);
//                 setChartData(null);
//               }
//             }
//           } else if (typeof summary === "object") {
//             setChartData(summary);
//           }
//         }
//       } else {
//         // If we're doing a regular prompt with no table ID, don't reset chart data
//         if (!attachedFile && !tableId) {
//           console.log("Not changing chart data for regular prompt");
//         } else {
//           // Only reset chart data when we should be showing new chart data
//           setChartData(null);
//         }
//         setSuggestedQuestions([]);
//       }

//       // Add to chat history
//       if (inputText) {
//         setChatHistory((prev) => [
//           ...prev,
//           { type: "user", message: inputText, timestamp: Date.now() },
//         ]);
//       }

//       // Add system response to chat history
//       setChatHistory((prev) => [
//         ...prev,
//         {
//           type: "system",
//           message:
//             data && data.report
//               ? typeof data.report === "string"
//                 ? data.report
//                 : JSON.stringify(data.report, null, 2)
//               : data && data.summary && typeof data.summary === "string"
//                 ? data.summary
//                 : typeof data === "string"
//                   ? data
//                   : JSON.stringify(data, null, 2),
//           timestamp: Date.now(),
//         },
//       ]);

//       setInputText("");
//       setAttachedFile(null);
//       setFileName(null);
//     } catch (err) {
//       console.error("Request failed:", err);
//       setChatHistory((prev) => [
//         ...prev,
//         {
//           type: "system",
//           message: `Error: ${err.message || "Request failed"}`,
//           timestamp: Date.now(),
//         },
//       ]);
//       setServerOutput(`Error: ${err.message || "Request failed"}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-full flex flex-col bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-700">
//       <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-2">
//         {fileName ? (
//           <FileInfo
//             fileName={fileName}
//             onRemoveFile={() => {
//               setAttachedFile(null);
//               setFileName(null);
//             }}
//           />
//         ) : null}
//       </div>

//       {(loading || listening) && (
//         <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
//           <span className="text-white text-lg font-semibold animate-pulse">
//             {loading ? "Submitting..." : listening ? "Transcribing..." : "Processing..."}
//           </span>
//         </div>
//       )}

//       {/* Chat History */}
//       <div
//         ref={chatHistoryRef}
//         className="flex-grow overflow-y-auto flex flex-col gap-3 py-4 px-4"
//         style={{
//           scrollBehavior: "smooth",
//           height: tableId ? "calc(70vh - 170px)" : "calc(70vh - 120px)",
//         }}
//       >
//         {!fileName && !chatHistory.length && !tableId && (
//           <div
//             className={`flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-xl transition-colors duration-200 ${dragActive ? "border-blue-500 bg-blue-500 bg-opacity-10" : "border-gray-700"}`}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <div className="text-5xl mb-6">📊</div>
//             <h3 className="text-2xl font-bold text-white mb-3">
//               Welcome to WoW
//             </h3>
//             <p className="text-gray-400 max-w-md mb-6">
//               Upload a CSV file and ask questions to analyze your data and
//               generate beautiful interactive charts.
//             </p>
//             <div
//               className={`${dragActive ? "" : "animate-bounce"} bg-blue-600 p-2 w-10 h-10 ring-1 ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center mb-2`}
//             >
//               <svg
//                 className="w-6 h-6 text-white"
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   d={
//                     dragActive ? "M5 15l7-7 7 7" : "M19 14l-7 7m0 0l-7-7m7 7V3"
//                   }
//                 ></path>
//               </svg>
//             </div>
//             <p className="text-gray-500 text-sm">
//               {dragActive
//                 ? "Drop your CSV file here"
//                 : "Drag & drop a CSV file here, or click to browse"}
//             </p>
//           </div>
//         )}
//         {tableId && !chatHistory.length && (
//           <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-xl bg-gray-800 bg-opacity-40 backdrop-blur-sm">
//             <div className="text-4xl mb-5">💬</div>
//             <h3 className="text-xl font-bold text-white mb-3">
//               Your charts are ready!
//             </h3>
//             <p className="text-gray-300 max-w-md mb-4">
//               Now you can ask questions about your data. Try these suggestions or use voice input:
//             </p>
//             <div className="flex flex-col gap-3 w-full max-w-md mb-6">
//               {(suggestedQuestions.length > 0
//                 ? suggestedQuestions
//                 : [
//                     "Summarize the main insights from this data",
//                     "What are the highest and lowest values?",
//                     "Show me the trends over time",
//                   ]
//               ).map((q, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-gray-700 p-3 rounded-md text-left cursor-pointer hover:bg-gray-600 transition-colors"
//                   onClick={() => setInputText(q)}
//                 >
//                   {q}
//                 </div>
//               ))}
//             </div>
//             <p className="text-blue-400 text-sm animate-pulse">
//               Click on any suggestion to use it, or type/speak your own question below
//             </p>
//           </div>
//         )}
//         {chatHistory.length > 0 &&
//           chatHistory.map((chat, index) => (
//             <div
//               key={`chat-${index}-${chat.timestamp}`}
//               className={`
//               p-4 rounded-lg shadow-md animate-fadeIn
//               ${
//                 chat.type === "user"
//                   ? "bg-blue-600 text-white ml-auto rounded-br-none"
//                   : "bg-gray-800 text-white border border-gray-700 rounded-bl-none"
//               }
//               max-w-[80%] ${chat.type === "user" ? "self-end" : "self-start"}
//               transition-all duration-300 ease-in-out
//               hover:shadow-lg backdrop-blur-sm
//             `}
//               style={{
//                 animationDelay: `${index * 0.05}s`,
//                 animationDuration: "0.3s",
//               }}
//             >
//               <div className="whitespace-pre-wrap break-words">
//                 {chat.type === "system"
//                   ? chat.message
//                       .replace(/^```json\s*|^```\s*/i, "")
//                       .replace(/```$/i, "")
//                   : chat.message}
//               </div>
//               <div
//                 className={`text-xs mt-1 ${chat.type === "user" ? "text-blue-200" : "text-gray-400"}`}
//               >
//                 {new Date(chat.timestamp).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </div>
//             </div>
//           ))}
//       </div>

//       {serverOutput && !chatHistory.length && (
//         <div className="mb-4 p-4 rounded-lg bg-gray-800 text-white border border-gray-700 overflow-y-auto max-h-[250px] backdrop-blur-sm shadow-md">
//           <strong>Response:</strong>
//           <div className="whitespace-pre-wrap break-words">
//             {typeof serverOutput === "object" && tableId && serverOutput.report
//               ? typeof serverOutput.report === "string"
//                 ? serverOutput.report
//                 : JSON.stringify(serverOutput.report, null, 2)
//               : typeof serverOutput === "object" && serverOutput.summary
//                 ? serverOutput.summary
//                 : typeof serverOutput === "string"
//                   ? serverOutput
//                       .replace(/^```json\s*|^```\s*/i, "")
//                       .replace(/```$/i, "")
//                   : JSON.stringify(serverOutput, null, 2)}
//           </div>
//         </div>
//       )}
      
//       {/* INPUT AREA WITH SPEECH BUTTON */}
//       <div className="sticky bottom-0 py-4 px-4 flex gap-2 min-w-full bg-gray-900 border-t border-gray-700">
//         <input
//           ref={fileInputRef}
//           type="file"
//           className="hidden"
//           onChange={handleFileChange}
//         />

//         <div className="w-full flex flex-col justify-start p-2 rounded-md bg-gray-700 text-gray-300 gap-2 shadow-inner">
//           <input
//             className="min-w-full px-3 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
//             type="text"
//             placeholder={isRecording ? "Recording..." : listening ? "Transcribing..." : "Type your message or click mic to speak..."}
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             disabled={loading || isRecording || listening}
//           />
//         </div>

//         {/* SPEECH-TO-TEXT BUTTON */}
//         <button
//           className={`px-4 py-2 rounded-md transition-colors ${
//             isRecording 
//               ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
//               : 'bg-green-600 hover:bg-green-700'
//           } text-white`}
//           onClick={handleVoiceClick}
//           type="button"
//           disabled={loading || listening}
//           title={isRecording ? "Stop recording" : "Start voice recording"}
//         >
//           {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
//         </button>

//         <button
//           className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
//           onClick={handleSubmit}
//           type="button"
//           disabled={loading || (!inputText && !attachedFile)}
//         >
//           <IoSend />
//         </button>
//       </div>
//     </div>
//   );
// }





//cow
"use client";
import { TiAttachment } from "react-icons/ti";
import { IoSend } from "react-icons/io5";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

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

  // Speech-to-text states
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [listening, setListening] = useState(false);

  //kaushik - START: Text-to-Speech States
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioExplanation, setAudioExplanation] = useState<string>("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  //kaushik - END: Text-to-Speech States

  // API KEY CONFIGURATION
  const ELEVENLABS_API_KEY = "sk_4ce34b9f3d8478ac9e07a0641a901eedcf32e4b05328de83";

  // CORE TRANSCRIPTION FUNCTION
  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model_id', 'scribe_v1');

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Speech-to-text failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result.text || '';
  };

  // START RECORDING FUNCTION
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setListening(true);
        
        try {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          console.log('Audio recorded:', audioBlob.size, 'bytes');
          
          const transcribedText = await transcribeAudio(audioBlob);
          
          if (transcribedText.trim()) {
            setInputText(transcribedText);
            console.log('Transcribed:', transcribedText);
          }
          
        } catch (error) {
          console.error('Transcription error:', error);
          alert('Transcription failed. Please try again.');
        } finally {
          setListening(false);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Microphone access required. Please allow and try again.');
    }
  };

  // STOP RECORDING FUNCTION
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  // VOICE BUTTON HANDLER
  const handleVoiceClick = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      stopRecording();
    }
  };

  //kaushik - START: Text-to-Speech Functions
  // Generate audio explanation for chart data
  const generateAudioExplanation = async (chartData: any, chartType: string) => {
    if (!chartData) return;
    
    setIsGeneratingAudio(true);
    try {
      const dashboardConfig = {
        chartType: chartType,
        chartData: chartData,
        tableName: tableId,
        timestamp: new Date().toISOString()
      };

      const response = await fetch("http://localhost:4000/api/generate-audio-explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dashboardConfig: dashboardConfig,
          voiceId: 'pNInz6obpgDQGcFmaJgB' // Default voice
        })
      });

      if (!response.ok) {
        throw new Error(`Audio generation failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.audioBase64) {
        setAudioExplanation(result.explanation);
        
        // Create audio element and play
        const audioBlob = new Blob([
          Uint8Array.from(atob(result.audioBase64), c => c.charCodeAt(0))
        ], { type: 'audio/mpeg' });
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onplay = () => setIsPlayingAudio(true);
        audio.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        setCurrentAudio(audio);
        
        // Add explanation to chat history
        setChatHistory(prev => [...prev, {
          type: "system",
          message: `🎤 **Audio Explanation Generated:**\n\n${result.explanation}`,
          timestamp: Date.now()
        }]);
        
        // Auto-play the audio
        await audio.play();
      }
    } catch (error) {
      console.error("Failed to generate audio explanation:", error);
      setChatHistory(prev => [...prev, {
        type: "system",
        message: `❌ Audio explanation failed: ${error.message}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Stop current audio playback
  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };

  // Play/pause audio control
  const toggleAudio = () => {
    if (currentAudio) {
      if (isPlayingAudio) {
        currentAudio.pause();
        setIsPlayingAudio(false);
      } else {
        currentAudio.play();
        setIsPlayingAudio(true);
      }
    }
  };
  //kaushik - END: Text-to-Speech Functions

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

  const handleDragLeave = (e: React.DragEvent<HTMLDiveline>) => {
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
    
    let requestBody: any = null;
    
    try {
      let response;
      if (attachedFile) {
        const formData = new FormData();
        formData.append("file", attachedFile);
        formData.append("prompt", inputText);

        requestBody = { file: attachedFile.name, prompt: inputText };

        response = await fetch("http://localhost:4000/api/upload-csv-prompt", {
          method: "POST",
          body: formData,
        });
      } else {
        console.log("Current tableId:", tableId);
        requestBody = {
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
      let output = "";
      if (data && typeof data === "object" && data.summary) {
        output = data.summary;
      } else {
        output =
          typeof data === "string" ? data : JSON.stringify(data, null, 2);
      }
      console.log("Server output:", data);
      console.log("Response structure:", Object.keys(data));
      setServerOutput(data);

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
      console.error("Request failed:", err);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "system",
          message: `Error: ${err.message || "Request failed"}`,
          timestamp: Date.now(),
        },
      ]);
      setServerOutput(`Error: ${err.message || "Request failed"}`);
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

      {(loading || listening || isGeneratingAudio) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
          <span className="text-white text-lg font-semibold animate-pulse">
            {loading ? "Submitting..." : listening ? "Transcribing..." : isGeneratingAudio ? "Generating Audio..." : "Processing..."}
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
              Now you can ask questions about your data. Try these suggestions, use voice input, or listen to audio explanations:
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
              Click on any suggestion to use it, type/speak your own question, or listen to audio explanations below
            </p>

            {/*kaushik - START: Audio Controls*/}
            {(isGeneratingAudio || currentAudio) && (
              <div className="mt-4 p-3 bg-gray-700 rounded-lg border border-purple-500">
                <div className="flex items-center gap-3">
                  <div className="text-purple-400 text-xl">🎤</div>
                  <div className="flex-1">
                    {isGeneratingAudio ? (
                      <div className="text-purple-300 text-sm animate-pulse">
                        Generating audio explanation...
                      </div>
                    ) : (
                      <div className="text-purple-300 text-sm">
                        Audio explanation ready
                      </div>
                    )}
                  </div>
                  {currentAudio && !isGeneratingAudio && (
                    <div className="flex gap-2">
                      <button
                        onClick={toggleAudio}
                        className={`px-3 py-1 rounded-md text-xs transition-colors ${
                          isPlayingAudio 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {isPlayingAudio ? "⏸ Pause" : "▶ Play"}
                      </button>
                      <button
                        onClick={stopAudio}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-xs transition-colors"
                      >
                        ⏹ Stop
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/*kaushik - END: Audio Controls*/}
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
      
      {/* INPUT AREA WITH SPEECH BUTTON */}
      <div className="sticky bottom-0 py-4 px-4 flex gap-2 min-w-full bg-gray-900 border-t border-gray-700">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="w-full flex flex-col justify-start p-2 rounded-md bg-gray-700 text-gray-300 gap-2 shadow-inner">
          <input
            className="min-w-full px-3 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            type="text"
            placeholder={isRecording ? "Recording..." : listening ? "Transcribing..." : isGeneratingAudio ? "Generating audio..." : "Type your message or click mic to speak..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading || isRecording || listening || isGeneratingAudio}
          />
        </div>

        {/* SPEECH-TO-TEXT BUTTON */}
        <button
          className={`px-4 py-2 rounded-md transition-colors text-white ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
          onClick={handleVoiceClick}
          type="button"
          disabled={loading || listening || isGeneratingAudio}
          title={isRecording ? "Stop recording" : "Start voice recording"}
        >
          {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
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