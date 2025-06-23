"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type FileContextType = {
  fileName: string | null;
  setFileName: (name: string | null) => void;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <FileContext.Provider value={{ fileName, setFileName }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFile() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
}