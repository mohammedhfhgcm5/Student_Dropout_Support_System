// src/types/fileTypes.ts

export interface UploadedFileResponse {
  message: string;
  filename: string;
  url: string;
}

export interface UploadedMultiResponse {
  message: string;
  files: {
    filename: string;
    url: string;
  }[];
}

export interface DeleteFileResponse {
  message: string;
  filename?: string;
}

export interface DeleteMultiResponse {
  message: string;
  deleted: string[];
  notFound: string[];
}

export interface DeleteFileDto {
  url: string;
}

export interface DeleteMultiFileDto {
  fileUrls: string[];
}
