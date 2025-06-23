export async function uploadCsvAndPrompt(csvFile: File, prompt: string) {
  const formData = new FormData();
  formData.append("file", csvFile);
  formData.append("prompt", prompt);

  const response = await fetch("/api/upload-csv", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload CSV");
  }

  return response.json(); // Expecting chart data in response
}
