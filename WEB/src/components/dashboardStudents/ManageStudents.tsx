import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Users,
  BarChart3,
  PieChart,
  LineChart,
  FileText,
  UserSquare2,
  School,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreateStudentForm } from "./CreateStudentForm";
import { CreateGuardianForm } from "./CreateGuardianForm";
import { CreateSchoolForm } from "./CreateSchoolForm";
import { useGuardians } from "../../hooks/useGuardians";
import { useSchools } from "../../hooks/useSchools";

import { CreateDropoutReasonForm } from "./CreateDropoutReasonForm";
import { useDropoutReasons } from "../../hooks/useDropoutReasons";
import { useStudents, useStudentReports } from "../../hooks/useStudents";
import { Modal, ReportCard, Section, SidebarButton, SmartUpdateForm, StudentDetailsModal, StudentStatsOverview, StudentStatusStatistics, TableCard } from "./components/components";


export default function ManageStudentsGuardiansSchools() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("view_students");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Student Details Modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const { data: students, isLoading: loadingStudents } = useStudents(0, 20);
  const { impact, gender, age, dropout } = useStudentReports();
  const { data: guardians, isLoading: loadingGuardians } = useGuardians();
  const { data: schools, isLoading: loadingSchools } = useSchools();
  const { data: dropoutReasons, isLoading: isLoadingReasons } = useDropoutReasons();

  const handleRowDoubleClick = (item: any, type: string) => {
    if (type === "view_students") {
      // Open detailed student modal with documents
      setSelectedStudent(item);
      setIsDetailsModalOpen(true);
    } else {
      // Open simple update modal for guardians/schools
      setSelectedItem(item);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Students, Guardians & Schools
          </h2>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 p-6 space-y-6 overflow-y-auto">
          <Section title="Student Statistics">
              <SidebarButton
                label="Overview"
                icon={<BarChart3 size={18} />}
                active={activeTab === "stats_overview"}
                onClick={() => setActiveTab("stats_overview")}
              />
              <SidebarButton
                label="By School"
                icon={<School size={18} />}
                active={activeTab === "stats_school"}
                onClick={() => setActiveTab("stats_school")}
              />
              <SidebarButton
                label="By Location"
                icon={<FileText size={18} />}
                active={activeTab === "stats_location"}
                onClick={() => setActiveTab("stats_location")}
              />
              <SidebarButton
                label="By Status"
                icon={<PieChart size={18} />}
                active={activeTab === "stats_status"}
                onClick={() => setActiveTab("stats_status")}
              />
            </Section>
          <Section title="Student Management">
            <SidebarButton
              label="View All Students"
              icon={<Users size={18} />}
              active={activeTab === "view_students"}
              onClick={() => setActiveTab("view_students")}
            />
            <SidebarButton
              label="Add Student"
              icon={<Plus size={18} />}
              active={activeTab === "add_student"}
              onClick={() => setActiveTab("add_student")}
            />
          </Section>

          <Section title="Guardian Management">
            <SidebarButton
              label="View Guardians"
              icon={<UserSquare2 size={18} />}
              active={activeTab === "view_guardians"}
              onClick={() => setActiveTab("view_guardians")}
            />
            <SidebarButton
              label="Add Guardian"
              icon={<Plus size={18} />}
              active={activeTab === "add_guardian"}
              onClick={() => setActiveTab("add_guardian")}
            />
          </Section>

          <Section title="School Management">
            <SidebarButton
              label="View Schools"
              icon={<School size={18} />}
              active={activeTab === "view_schools"}
              onClick={() => setActiveTab("view_schools")}
            />
            <SidebarButton
              label="Add School"
              icon={<Plus size={18} />}
              active={activeTab === "add_school"}
              onClick={() => setActiveTab("add_school")}
            />
          </Section>

          <Section title="Dropout Reasons Management">
        <SidebarButton
          label="View All Reasons"
          icon={<FileText size={18} />}
          active={activeTab === "view_reasons"}
          onClick={() => setActiveTab("view_reasons")}
        />
        <SidebarButton
          label="Add Reason"
          icon={<Plus size={18} />}
          active={activeTab === "add_reason"}
          onClick={() => setActiveTab("add_reason")}
        />
      </Section>

          <Section title="Reports">
            <SidebarButton
              label="Impact Report"
              icon={<BarChart3 size={18} />}
              active={activeTab === "impact"}
              onClick={() => setActiveTab("impact")}
            />
            <SidebarButton
              label="Gender Distribution"
              icon={<PieChart size={18} />}
              active={activeTab === "gender"}
              onClick={() => setActiveTab("gender")}
            />
            <SidebarButton
              label="Age Distribution"
              icon={<LineChart size={18} />}
              active={activeTab === "age"}
              onClick={() => setActiveTab("age")}
            />
            <SidebarButton
              label="Dropout Reasons"
              icon={<FileText size={18} />}
              active={activeTab === "dropout"}
              onClick={() => setActiveTab("dropout")}
            />
          </Section>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* === STUDENTS === */}
          {activeTab === "view_students" && (
            <TableCard
              title="All Students"
              headers={["#", "Full Name", "Gender", "Status", "Main Language"]}
              rows={
                loadingStudents
                  ? []
                  : students?.map((s, i) => [
                      i + 1,
                      s.fullName,
                      s.gender,
                      s.status,
                      s.mainLanguage,
                    ]) ?? []
              }
              items={students}
              onRowDoubleClick={(item) => handleRowDoubleClick(item, "view_students")}
              isLoading={loadingStudents}
            />
          )}
          {activeTab === "add_student" && <CreateStudentForm />}

          {/* === GUARDIANS === */}
          {activeTab === "view_guardians" && (
            <TableCard
              title="All Guardians"
              headers={["#", "Full Name", "Phone", "Relation", "National Number"]}
              rows={
                loadingGuardians
                  ? []
                  : guardians?.map((g, i) => [
                      i + 1,
                      g.fullName,
                      g.phone || "-",
                      g.relationToStudent,
                      g.nationalNumber,
                    ]) ?? []
              }
              items={guardians}
              onRowDoubleClick={(item) => handleRowDoubleClick(item, "view_guardians")}
              isLoading={loadingGuardians}
            />
          )}
          {activeTab === "add_guardian" && <CreateGuardianForm />}

          {/* === DROPOUT REASONS === */}
          {activeTab === "view_reasons" && (
            <TableCard
              title="All Dropout Reasons"
              headers={["#", "Category", "Description"]}
              rows={
                isLoadingReasons
                  ? []
                  : dropoutReasons?.map((r, i) => [i + 1, r.category, r.description]) ?? []
              }
              items={dropoutReasons}
              onRowDoubleClick={(item) => handleRowDoubleClick(item, "view_reasons")}
              isLoading={isLoadingReasons}
            />
          )}
          {activeTab === "add_reason" && <CreateDropoutReasonForm />}

          {/* === SCHOOLS === */}
          {activeTab === "view_schools" && (
            <TableCard
              title="All Schools"
              headers={["#", "Name", "Region", "Address"]}
              rows={
                loadingSchools
                  ? []
                  : schools?.map((s, i) => [
                      i + 1,
                      s.name,
                      s.region,
                      s.address || "-",
                    ]) ?? []
              }
              items={schools}
              onRowDoubleClick={(item) => handleRowDoubleClick(item, "view_schools")}
              isLoading={loadingSchools}
            />
          )}
          {activeTab === "add_school" && <CreateSchoolForm />}

          {/* === REPORTS === */}
          {activeTab === "impact" && (
            <ReportCard
              title="Impact Report"
              data={impact.data ? [impact.data] : []}
              fileName="Impact_Report"
            />
          )}
          {activeTab === "gender" && (
            <ReportCard
              title="Gender Distribution"
              data={gender.data ? [gender.data] : []}
              fileName="Gender_Distribution"
            />
          )}
          {activeTab === "age" && (
            <ReportCard
              title="Age Distribution"
              data={age.data ? [age.data] : []}
              fileName="Age_Distribution"
            />
          )}
          {activeTab === "dropout" && (
            <ReportCard
              title="Dropout Reasons Report"
              data={dropout.data ?? []}
              fileName="Dropout_Reasons"
            />
          )}
  

          {/* === SIMPLE UPDATE MODAL === */}
          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={`Update ${
              selectedItem?.fullName || selectedItem?.name || "Record"
            }`}
          >
            {selectedItem && (
              <SmartUpdateForm
                type={activeTab}
                item={selectedItem}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </Modal>

          {/* === STUDENT DETAILS MODAL === */}
          {selectedStudent && (
            <StudentDetailsModal
              student={selectedStudent}
              open={isDetailsModalOpen}
              onClose={() => {
                setIsDetailsModalOpen(false);
                setSelectedStudent(null);
              }}
            />
          )}

          {/* === STUDENT STATISTICS === */}
        {activeTab === "stats_overview" && <StudentStatsOverview />}
        {activeTab === "stats_status" && <StudentStatusStatistics />}
        </main>
      </div>
    </div>
  );
}
