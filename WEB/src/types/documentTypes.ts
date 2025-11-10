// src/types/documentTypes.ts

export interface Document {
  id: number;
  studentId: number;
  filePath: string;
  fileType: string;
  uploadDate: string;
}

export interface CreateDocumentDto {
  studentId: number;
  filePath: string;
  fileType: string;
}

export interface UpdateDocumentDto {
  filePath?: string;
  fileType?: string;
}
