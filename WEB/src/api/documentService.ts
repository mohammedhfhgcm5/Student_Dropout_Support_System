// src/api/documentService.ts
import type { Document,CreateDocumentDto, UpdateDocumentDto } from "../types/documentTypes";
import { apiClient } from "./apiConfig";

export const documentService = {
  // ✅ Create document record
  async create(data: CreateDocumentDto): Promise<Document> {
    const res = await apiClient.post("/documents", data);
    return res.data;
  },

  // ✅ Get all documents
  async getAll(skip = 0, limit = 20): Promise<Document[]> {
    const res = await apiClient.get("/documents", { params: { skip, limit } });
    return res.data;
  },

  // ✅ Get document by ID
  async getById(id: number): Promise<Document> {
    const res = await apiClient.get(`/documents/${id}`);
    return res.data;
  },

  // ✅ Get all documents for a specific student
  async getByStudent(studentId: number): Promise<Document[]> {
    const res = await apiClient.get("/documents", { params: { skip: 0, limit: 100 } });
    return res.data.filter((d: Document) => d.studentId === studentId);
  },

  // ✅ Update document
  async update(id: number, data: UpdateDocumentDto): Promise<Document> {
    const res = await apiClient.patch(`/documents/${id}`, data);
    return res.data;
  },

  // ✅ Delete document
  async remove(id: number): Promise<void> {
    await apiClient.delete(`/documents/${id}`);
  },

  // ✅ Search documents
  async search(q: string): Promise<Document[]> {
    const res = await apiClient.get("/documents/search", { params: { q } });
    return res.data;
  },
};

