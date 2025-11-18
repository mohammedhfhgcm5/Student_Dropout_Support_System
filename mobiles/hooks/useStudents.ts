// src/hooks/useStudents.ts
import {
  getAllStudents,
  getStudentById,
  searchStudents,
} from "@/services/student.service";
import { useQuery } from "@tanstack/react-query";

// 🔹 Get all students
export const useStudents = (skip = 0, limit = 10) =>
  useQuery({
    queryKey: ["students", skip, limit],
    queryFn: () => getAllStudents(skip, limit),
  });

// 🔹 Get student by ID
export const useStudentById = (id: number) =>
  useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudentById(id),
    enabled: !!id,
  });

// 🔹 Search students
export const useStudentSearch = (query: string, skip = 0, limit = 10) =>
  useQuery({
    queryKey: ["students-search", query, skip, limit],
    queryFn: () => searchStudents(query, skip, limit),
    enabled: query.length > 0,
  });
