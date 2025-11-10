// src/hooks/useDocuments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentService } from "../api/documentService";
import type { CreateDocumentDto, UpdateDocumentDto } from "../types/documentTypes";

export function useDocuments(skip = 0, limit = 20) {
  return useQuery({
    queryKey: ["documents", skip, limit],
    queryFn: () => documentService.getAll(skip, limit),
  });
}

export function useDocument(id: number) {
  return useQuery({
    queryKey: ["document", id],
    queryFn: () => documentService.getById(id),
    enabled: !!id,
  });
}

export function useStudentDocuments(studentId: number) {
  return useQuery({
    queryKey: ["student-documents", studentId],
    queryFn: () => documentService.getByStudent(studentId),
    enabled: !!studentId,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDocumentDto) => documentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDocumentDto }) =>
      documentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => documentService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}
