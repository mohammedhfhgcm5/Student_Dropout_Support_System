import { useState } from "react";

import { Paperclip, UploadCloud } from "lucide-react";
import { useStudentDocuments, useCreateDocument } from "../../hooks/useDocuments";
import { useUploadFile } from "../../hooks/useFiles";

interface StudentDetailsProps {
  student: any;
  onClose: () => void;
}

export function StudentDetails({ student, onClose }: StudentDetailsProps) {
  const { data: documents, refetch } = useStudentDocuments(student.id);
  const { mutate: uploadFile, isPending: uploading } = useUploadFile();
  const { mutate: createDoc } = useCreateDocument();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return alert("Please select a file first.");

    uploadFile(
      { file: selectedFile, folderName: `student-${student.id}` },
      {
        onSuccess: (res) => {
          // after upload → create Document record
          const fileType = selectedFile.type.split("/")[0];
          createDoc(
            {
              studentId: student.id,
              filePath: res.url,
              fileType,
            },
            {
              onSuccess: () => {
                alert("✅ File uploaded and saved!");
                refetch();
                setSelectedFile(null);
              },
            }
          );
        },
        onError: () => alert("❌ Upload failed."),
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* 🧍‍♂️ Student info */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Student Info
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <p><strong>Full Name:</strong> {student.fullName}</p>
          <p><strong>Gender:</strong> {student.gender}</p>
          <p><strong>Status:</strong> {student.status}</p>
          <p><strong>Main Language:</strong> {student.mainLanguage}</p>
          <p><strong>Acquired Language:</strong> {student.acquiredLanguage}</p>
          {student.supportNeeds && (
            <p className="col-span-2"><strong>Support Needs:</strong> {student.supportNeeds}</p>
          )}
        </div>
      </div>

      {/* 📁 Upload section */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <h4 className="text-md font-semibold mb-3 text-gray-800 flex items-center gap-2">
          <UploadCloud size={18} /> Upload Document
        </h4>
        <div className="flex items-center gap-3">
          <input
            type="file"
            onChange={handleFileSelect}
            className="text-sm text-gray-700"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {/* 📜 Documents list */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-md font-semibold mb-3 flex items-center gap-2 text-gray-800">
          <Paperclip size={18} /> Uploaded Documents
        </h4>

        {documents && documents.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <a
                  href={doc.filePath}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {doc.filePath.split("/").pop()}
                </a>
                <span className="text-gray-500">{doc.fileType}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No documents uploaded yet.</p>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
