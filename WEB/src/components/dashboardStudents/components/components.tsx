import { Upload, Download, Trash2 ,File } from "lucide-react";
import { useState } from "react";
import { useCreateDocument, useDeleteDocument, useStudentDocuments } from "../../../hooks/useDocuments";
import { useUploadFile } from "../../../hooks/useFiles";
import { useGenderCount, useStatusStatistics } from "../../../hooks/useStudents";
import { exportToExcel, exportToPDF } from "../../../utils/exportUtils";



/* ===================== STUDENT DETAILS MODAL ===================== */
export function StudentDetailsModal({
  student,
  open,
  onClose,
}: {
  student: any;
  open: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"details" | "documents">("details");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [documentName, setDocumentName] = useState("");

  const uploadFileMutation = useUploadFile();
  const createDocumentMutation = useCreateDocument();
  const deleteDocumentMutation = useDeleteDocument();
  
  const { data: documents, isLoading: loadingDocs } = useStudentDocuments(student.id);


  

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setDocumentName(e.target.files[0].name);
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile || !documentType || !documentName) {
      alert("Please select a file, enter document name, and select document type");
      return;
    }

    try {
      // Step 1: Upload file to server and get URL
      const uploadResult = await uploadFileMutation.mutateAsync({
        file: selectedFile,
       
      });

      

      // Step 2: Create document record with the returned URL
      await createDocumentMutation.mutateAsync({
        studentId: student.id,
        fileType: documentType,
        filePath: uploadResult.url, // Use the URL returned from file upload
      });

      // Reset form
      setSelectedFile(null);
      setDocumentType("");
      setDocumentName("");
      alert("✅ Document uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Failed to upload document");
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocumentMutation.mutateAsync(docId);
        alert("✅ Document deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        alert("❌ Failed to delete document");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl relative max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {student.fullName} - Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-light w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 flex gap-4">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Student Details
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "documents"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Documents ({documents?.length || 0})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
         {activeTab === "details" && (
          <div className="space-y-8">
            {/* === BASIC INFO === */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Basic Information
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <DetailItem label="Full Name" value={student.fullName} />
                <DetailItem label="Gender" value={student.gender} />
                <DetailItem label="Status" value={student.status} />
                <DetailItem label="Main Language" value={student.mainLanguage} />
                <DetailItem label="Acquired Language" value={student.acquiredLanguage || "-"} />
                <DetailItem label="Support Needs" value={student.supportNeeds || "-"} />
                <DetailItem
                  label="Date of Birth"
                  value={
                    student.dateOfBirth
                      ? new Date(student.dateOfBirth).toLocaleDateString()
                      : "-"
                  }
                />
                <DetailItem label="National Number" value={student.nationalNumber || "-"} />
              </div>
            </div>
                
            {/* === GUARDIAN INFO === */}
            {student.guardian && (
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Guardian Information
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <DetailItem label="Guardian Name" value={student.guardian.fullName || "-"} />
                  <DetailItem label="Phone" value={student.guardian.phone || "-"} />
                  <DetailItem label="Relation" value={student.guardian.relationToStudent || "-"} />
                  <DetailItem label="National Number" value={student.guardian.nationalNumber || "-"} />
                </div>
              </div>
            )}
        
            {/* === SCHOOL & LOCATION INFO === */}
            {(student.school || student.location) && (
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  School & Location Information
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  {student.school && (
                    <>
                      <DetailItem label="School Name" value={student.school.name || "-"} />
                      <DetailItem label="Region" value={student.school.region || "-"} />
                      <DetailItem label="Address" value={student.school.address || "-"} />
                    </>
                  )}
                  {student.location && (
                    <>
                      <DetailItem label="Location Name" value={student.location.name || "-"} />
                      <DetailItem label="Region" value={student.location.region || "-"} />
                      <DetailItem label="Country" value={student.location.country || "-"} />
                    </>
                  )}
                </div>
              </div>
            )}
        
            {/* === DROPOUT REASON (اختياري) === */}
            {student.dropoutReason && (
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Dropout Reason
                </h4>
                 <DetailItem label="Category" value={student.dropoutReason.category || "-"} />
                 <DetailItem label="Description" value={student.dropoutReason.description || "-"} />
                
              </div>
            )}
          </div>
        )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              {/* Upload Form */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Upload size={18} />
                  Upload New Document
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Name
                    </label>
                    <input
                      type="text"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="e.g., Birth Certificate"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Type
                    </label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select type...</option>
                      <option value="ID">ID Document</option>
                      <option value="Academic">Academic Record</option>
                      <option value="Medical">Medical Document</option>
                      <option value="Legal">Legal Document</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select File
                    </label>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {selectedFile && (
                      <p className="text-xs text-gray-600 mt-2">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleUploadDocument}
                    disabled={uploadFileMutation.isPending || createDocumentMutation.isPending}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploadFileMutation.isPending || createDocumentMutation.isPending ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <Upload size={18} />
                        Upload Document
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Documents List */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">
                  Uploaded Documents
                </h4>
                {loadingDocs ? (
                  <p className="text-gray-500 text-sm">Loading documents...</p>
                ) : documents && documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <File size={24} className="text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {doc.fileType
}
                            </p>
                            <p className="text-xs text-gray-500">
                              {doc.type} • Uploaded {new Date(doc.uploadDate
                                ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                       <div className="flex items-center gap-2">
                     {/* 👁️ Preview Button */}
                     <button
                       onClick={() => window.open(`http://localhost:3000${doc.filePath}`, "_blank")}
                       className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                       title="Preview"
                     >
                       👁️
                     </button>

                     {/* ⬇️ Download Button */}
                     <a
                       href={`http://localhost:3000${doc.filePath}`}
                       download
                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                       title="Download"
                     >
                       <Download size={18} />
                     </a>

                     {/* 🗑️ Delete Button */}
                     <button
                       onClick={() => handleDeleteDocument(doc.id)}
                       className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                       title="Delete"
                       disabled={deleteDocumentMutation.isPending}
                       >
                         </button>
                            <Trash2 size={18} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
}

/* ===================== HELPERS ===================== */

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function SidebarButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-lg transition-all ${
        active
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

/* ===== TABLE CARD ===== */
export function TableCard({
  title,
  headers,
  rows,
  items,
  onRowDoubleClick,
  isLoading,
}: {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  items?: any[];
  onRowDoubleClick?: (item: any) => void;
  isLoading?: boolean;
}) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : rows.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((r, i) => (
                <tr
                  key={i}
                  onDoubleClick={() => onRowDoubleClick?.(items?.[i])}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {r.map((cell, j) => (
                    <td
                      key={j}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500 text-sm">No data found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== MODAL ===== */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-light w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ===== SMART UPDATE FORM ===== */
export function SmartUpdateForm({
  item,
  type,
  onClose,
}: {
  item: any;
  type: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState(item);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("✅ Updated successfully!");
    onClose();
  };

  if (type === "view_guardians") {
    return (
      <div className="space-y-4">
        <Input name="fullName" label="Full Name" value={form.fullName} onChange={handleChange} />
        <Input name="phone" label="Phone" value={form.phone ?? ""} onChange={handleChange} />
        <Input name="relationToStudent" label="Relation" value={form.relationToStudent ?? ""} onChange={handleChange} />
        <ButtonRow onSave={handleSave} onCancel={onClose} />
      </div>
    );
  }

  if (type === "view_schools") {
    return (
      <div className="space-y-4 ">
        <Input name="name" label="School Name" value={form.name} onChange={handleChange} />
        <Input name="region" label="Region" value={form.region} onChange={handleChange} />
        <Input name="address" label="Address" value={form.address ?? ""} onChange={handleChange} />
        <ButtonRow onSave={handleSave} onCancel={onClose} />
      </div>
    );
  }

  return <p className="text-gray-500 text-sm">No editable fields found.</p>;
}

function Input({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (e: any) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

function ButtonRow({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
      <button
        onClick={onCancel}
        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
      >
        Save Changes
      </button>
    </div>
  );
}


/* ===== REPORT CARD ===== */
export function ReportCard({
  title,
  data,
  fileName,
}: {
  title: string;
  data: any[];
  fileName: string;
}) {
  const arabicTitles: Record<string, string> = {
    "Impact Report": "تقرير الأثر",
    "Gender Distribution": "توزيع الجنس",
    "Age Distribution": "توزيع الأعمار",
    "Dropout Reasons Report": "تقرير أسباب التسرب",
  };

  const arabicTitle = arabicTitles[title] || "تقرير";

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="flex gap-3">
          <button
            onClick={() => exportToExcel(data, fileName)}
            className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            Export Excel
          </button>
          <button
            onClick={() =>
              exportToPDF(data, fileName, {
                title:
                  "منصة دعم الأطفال المنقطعين عن الدراسة / Student Dropout Support System",
                subtitle: `${arabicTitle} / ${title}`,
                logoUrl: "/logo.png",
              })
            }
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="p-6">
        <pre className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto border border-gray-200">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
/* ===================== 🔹 STUDENT STATS OVERVIEW ===================== */

export function StudentStatsOverview() {
  const { data: stats, isLoading } = useStatusStatistics();
  const { data: Gender, isPending  } = useGenderCount();


  console.log("in components",stats);
  

  if (isLoading|| isPending) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading statistics...</p>
      </div>
    );
  }
    console.log(stats);
    console.log(Gender);
    
  

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">📊 Student Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
       <StatCard title="Active Students" value={stats.ACTIVE} color="green" />
        <StatCard title="Dropouts" value={stats.DROPOUT} color="red" />
        <StatCard title="Returned" value={stats.RETURNED} color="yellow" />
        <StatCard title="At Risk" value={stats.AT_RISK} color="orange" />
        <StatCard title="FEMALE" value={Gender.female} color="purple" />
        <StatCard title="MALE" value={Gender.male} color="blue" />
        <StatCard title="FEMALE Percentage" value={Gender.femalePercentage} color="indigo" />
        <StatCard title="MALE Percentage" value={Gender.malePercentage} color="indigo" />
      </div>
    </div>
  );
}

/* ===================== 🔹 BY STATUS (more detailed) ===================== */
 export function StudentStatusStatistics() {
  const { data: stats, isLoading } = useStatusStatistics();


  

  if (isLoading)
    return <p className="text-gray-500 text-center mt-8">Loading status data...</p>;

  console.log("afterisloding",stats);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Students by Status</h2>

      <table className="min-w-full border border-gray-200 divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              Count
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          <tr>
            <td className="px-6 py-4 font-medium text-gray-900">Active</td>
            <td className="px-6 py-4 text-green-700">{stats?.ACTIVE ?? 0}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-medium text-gray-900">Dropout</td>
            <td className="px-6 py-4 text-red-700">{stats?.DROPOUT ?? 0}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-medium text-gray-900">Returned</td>
            <td className="px-6 py-4 text-yellow-700">{stats?.RETURNED ?? 0}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-medium text-gray-900">At Risk</td>
            <td className="px-6 py-4 text-orange-700">{stats?.AT_RISK ?? 0}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function StatCard({
  title,
  value,
  color = "blue",
  icon,
  trend,
  subtitle,
}: {
  title: string;
  value: number;
  color?: "green" | "red" | "yellow" | "orange" | "blue" | "purple" | "indigo";
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}) {
  const colorSchemes = {
    green: {
      bg: "bg-green-50 dark:bg-green-950/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-700 dark:text-green-300",
      accent: "bg-green-500",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-700 dark:text-red-300",
      accent: "bg-red-500",
    },
    yellow: {
      bg: "bg-orange-50 dark:bg-orange-950/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-700 dark:text-yellow-300",
      accent: "bg-yellow-500",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-950/20",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-700 dark:text-orange-300",
      accent: "bg-orange-500",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-700 dark:text-blue-300",
      accent: "bg-blue-500",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/20",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-700 dark:text-purple-300",
      accent: "bg-purple-500",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/20",
      border: "border-indigo-200 dark:border-indigo-800",
      text: "text-indigo-700 dark:text-indigo-300",
      accent: "bg-indigo-500",
    },
  };

  const scheme = colorSchemes[color];

  return (
    <div
      className={`
        relative p-6 rounded-2xl shadow-sm border transition-all duration-300 
        hover:shadow-md hover:scale-[1.02] group overflow-hidden
        ${scheme.bg} ${scheme.border}
        backdrop-blur-sm bg-white/5
      `}
    >
      {/* Animated accent line */}
      <div
        className={`absolute top-0 left-0 w-1 h-full ${scheme.accent} transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500`}
      />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="w-full h-full bg-gradient-to-br from-current to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm font-semibold uppercase tracking-wide ${scheme.text} opacity-80`}>
            {title}
          </p>
          {icon && (
            <div className={`p-2 rounded-lg ${scheme.bg} ${scheme.text}`}>
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {typeof value === 'number' ? value.toLocaleString() : value ?? 0}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Trend indicator */}
          {trend && (
            <div className="flex items-center space-x-1">
              <svg
                className={`w-4 h-4 ${trend.isPositive ? 'text-green-500' : 'text-red-500'} ${
                  !trend.isPositive ? 'rotate-180' : ''
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>

        {/* Progress bar for visual interest */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div
              className={`h-1 rounded-full ${scheme.accent} transition-all duration-1000 ease-out`}
              style={{
                width: `${Math.min((Math.abs(value) / 1000) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
