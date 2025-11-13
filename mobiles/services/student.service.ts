// src/services/student.service.ts
import type { Student } from "@/types/student";
import { api } from "./http";

// Get all students
export const getAllStudents = async (
  skip = 0,
  limit = 10
): Promise<Student[]> => {
  const { data } = await api.get(`/students`, { params: { skip, limit } });
  return data;
};

// Get student by ID
export const getStudentById = async (id: number): Promise<Student> => {
  const { data } = await api.get(`/students/${id}`);
  return data;
};

// Search students
export const searchStudents = async (
  query: string,
  skip = 0,
  limit = 10
): Promise<Student[]> => {
  const { data } = await api.get(`/students/search`, {
    params: { q: query, skip, limit },
  });
  return data;
};
