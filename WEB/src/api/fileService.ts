// src/api/fileService.ts
import type { UploadedFileResponse, UploadedMultiResponse, DeleteFileDto, DeleteFileResponse, DeleteMultiFileDto, DeleteMultiResponse } from "../types/fileTypes";
import { apiClient } from "./apiConfig";


export const fileService = {
  // ✅ Upload single file
  async uploadSingle(
    file: File,
    folderName?: string
  ): Promise<UploadedFileResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const params: Record<string, any> = {};
    if (folderName) params.filename = folderName;

    const res = await apiClient.post("/files/upload", formData, {
      params,
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  // ✅ Upload multiple files
  async uploadMulti(
    files: File[],
    folderName?: string
  ): Promise<UploadedMultiResponse> {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    const params: Record<string, any> = {};
    if (folderName) params.filename = folderName;

    const res = await apiClient.post("/files/upload-multi", formData, {
      params,
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  // ✅ Delete a single file
  async deleteFile(dto: DeleteFileDto): Promise<DeleteFileResponse> {
    const res = await apiClient.delete("/files/delete", { data: dto });
    return res.data;
  },

  // ✅ Delete multiple files
  async deleteMultiFiles(dto: DeleteMultiFileDto): Promise<DeleteMultiResponse> {
    const res = await apiClient.delete("/files/delete-multi", { data: dto });
    return res.data;
  },
};
