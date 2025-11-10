import type { CreateStudentDto, Student, UpdateStudentDto } from "../types/studentTypes";
import { apiClient } from "./apiConfig";


const API_URL = "/students";

export const studentService = {
  // 🧩 إنشاء طالب جديد
  async create(data: CreateStudentDto): Promise<Student> {
    const token = localStorage.getItem("access_token");
    const res = await apiClient.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data ?? res;
  },

  // 📋 جلب جميع الطلاب (مع pagination)
  async getAll(skip = 0, limit = 20): Promise<Student[]> {
   
    
    const res = await apiClient.get(`${API_URL}?skip=${skip}&limit=${limit}`);
    return res.data ?? res;
  },

  // 🔍 البحث
  async search(q: string, skip = 0, limit = 20): Promise<Student[]> {
    const res = await apiClient.get(`${API_URL}/search?q=${q}&skip=${skip}&limit=${limit}`);
    return res.data ?? res;
  },

  // 🧍‍♂️ جلب طالب محدد
  async getOne(id: number): Promise<Student> {
    const res = await apiClient.get(`${API_URL}/${id}`);
    return res.data ?? res;
  },

  // ✏️ تحديث بيانات الطالب
  async update(id: number, data: UpdateStudentDto): Promise<Student> {
    const token = localStorage.getItem("access_token");
    const res = await apiClient.patch(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data ?? res;
  },

  // ❌ حذف طالب
  async remove(id: number): Promise<void> {
    const token = localStorage.getItem("access_token");
    await apiClient.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // 🧭 جلب الطلاب حسب Guardian / School / Location / DropoutReason
  async byGuardian(guardianId: number): Promise<Student[]> {
    const res = await apiClient.get(`${API_URL}/by-guardian/${guardianId}`);
    return res.data ?? res;
  },
  async bySchool(schoolId: number): Promise<Student[]> {
    const res = await apiClient.get(`${API_URL}/by-school/${schoolId}`);
    return res.data ?? res;
  },
  async byLocation(locationId: number): Promise<Student[]> {
    const res = await apiClient.get(`${API_URL}/by-location/${locationId}`);
    return res.data ?? res;
  },
  async byDropoutReason(dropoutReasonId: number): Promise<Student[]> {
    const res = await apiClient.get(`${API_URL}/by-dropout-reason/${dropoutReasonId}`);
    return res.data ?? res;
  },

  // 🧮 الإحصاءات (count)
  async countAll(): Promise<number> {
    const res = await apiClient.get(`${API_URL}/count/all`);
    return res.data ?? res;
  },
  async countByStatus(status: string): Promise<number> {
    const res = await apiClient.get(`${API_URL}/count/status/${status}`);
    return res.data ?? res;
  },
  async countByGender(): Promise<any> {
    const res = await apiClient.get(`${API_URL}/count/gender`);
    return res.data ?? res;
  },

  // 🧮 إحصاءات كاملة لحالات الطلاب
async statusStatistics(){

  console.log("AWAD");
  
  const res = await Promise.all([
    this.countByStatus("ACTIVE"),
    this.countByStatus("DROPOUT"),
    this.countByStatus("RETURNED"),
    this.countByStatus("AT_RISK"),
  ]);

  console.log("in Student Service ", res);
  

  return {
    ACTIVE: res[0],
    DROPOUT: res[1],
    RETURNED: res[2],
    AT_RISK: res[3],
  };
},


  // 🧾 التقارير
  async impactReport() {
    const res = await apiClient.get(`${API_URL}/report/impact`);
    return res.data ?? res;
  },
  async ageDistribution() {
  const res = await apiClient.get(`${API_URL}/distribution/age`);
  return res.data ?? res;
},
  async monthlyReport(year: number, month: number) {
    const res = await apiClient.get(`${API_URL}/report/monthly?year=${year}&month=${month}`);
    return res.data ?? res;
  },
  async geographicReport() {
    const res = await apiClient.get(`${API_URL}/report/geographic`);
    return res.data ?? res;
  },
  async dropoutReasonReport() {
    const res = await apiClient.get(`${API_URL}/report/dropout-reasons`);
    return res.data ?? res;
  },

  // 📅 بيانات إضافية (زي الزيارات والتبرعات والمستندات)
  async followUpVisits(studentId: number) {
    const res = await apiClient.get(`${API_URL}/${studentId}/follow-up-visits`);
    return res.data ?? res;
  },
  async donations(studentId: number) {
    const res = await apiClient.get(`${API_URL}/${studentId}/donations`);
    return res.data ?? res;
  },
  async documents(studentId: number) {
    const res = await apiClient.get(`${API_URL}/${studentId}/documents`);
    return res.data ?? res;
  },
};
