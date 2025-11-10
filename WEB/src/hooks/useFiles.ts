// src/hooks/useFiles.ts
import { useMutation } from "@tanstack/react-query";
import { fileService } from "../api/fileService";
import type { DeleteFileDto, DeleteMultiFileDto } from "../types/fileTypes";

// ✅ Upload single file
export function useUploadFile() {
  return useMutation({
    mutationFn: ({
      file,
      folderName,
    }: {
      file: File;
      folderName?: string;
    }) => fileService.uploadSingle(file, folderName),
  });
}

// ✅ Upload multiple files
export function useUploadMultiFiles() {
  return useMutation({
    mutationFn: ({
      files,
      folderName,
    }: {
      files: File[];
      folderName?: string;
    }) => fileService.uploadMulti(files, folderName),
  });
}

// ✅ Delete one file
export function useDeleteFile() {
  return useMutation({
    mutationFn: (dto: DeleteFileDto) => fileService.deleteFile(dto),
  });
}

// ✅ Delete multiple files
export function useDeleteMultiFiles() {
  return useMutation({
    mutationFn: (dto: DeleteMultiFileDto) => fileService.deleteMultiFiles(dto),
  });
}
