import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "../api/studentsService";
import type { CreateStudentDto, UpdateStudentDto } from "../types/studentTypes";


/* ===================== 🔹 Basic CRUD Hooks ===================== */
export const useStudents = (skip = 0, limit = 20) =>
  useQuery({
    queryKey: ["students", skip, limit],
    queryFn: () => studentService.getAll(skip, limit),
  });

export const useStudent = (id: number) =>
  useQuery({
    queryKey: ["student", id],
    queryFn: () => studentService.getOne(id),
    enabled: !!id,
  });

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentDto) => studentService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["students"] }),
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentDto }) =>
      studentService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["students"] }),
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => studentService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["students"] }),
  });
};

/* ===================== 🔹 Reports & Stats ===================== */
export const useImpactReport = () =>
  useQuery({
    queryKey: ["students", "impact-report"],
    queryFn: studentService.impactReport,
  });

export const useDropoutReasonReport = () =>
  useQuery({
    queryKey: ["students", "dropout-reason-report"],
    queryFn: studentService.dropoutReasonReport,
  });

export const useMonthlyReport = (year: number, month: number) =>
  useQuery({
    queryKey: ["students", "monthly-report", year, month],
    queryFn: () => studentService.monthlyReport(year, month),
    enabled: !!year && !!month,
  });

export const useGeographicReport = () =>
  useQuery({
    queryKey: ["students", "geographic-report"],
    queryFn: studentService.geographicReport,
  });

export const useGenderCount = () =>
  useQuery({
    queryKey: ["students", "gender-count"],
    queryFn: studentService.countByGender,
  });

export const useStatusCount = (status: string) =>
  useQuery({
    queryKey: ["students", "status-count", status],
    queryFn: () => studentService.countByStatus(status),
  });

  /* ===================== 🔹 Combined Student Reports ===================== */
export const useStudentReports = () => {
  const impact = useImpactReport();
  const gender = useGenderCount();
  const age = useQuery({
    queryKey: ["students", "age-distribution"],
    queryFn: studentService.ageDistribution,
  });
  const dropout = useDropoutReasonReport();

  return {
    impact,
    gender,
    age,
    dropout,
  };
};
/* ===================== 🔹 Status Statistics Hook ===================== */
export const useStatusStatistics = () =>
  useQuery({
    queryKey: ["students", "status-statistics"],
    queryFn: ()=> studentService.statusStatistics(),
  });

