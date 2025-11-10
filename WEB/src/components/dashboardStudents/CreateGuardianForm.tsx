import { useState } from "react";
import { useCreateGuardian } from "../../hooks/useGuardians";

export function CreateGuardianForm() {
  const { mutate: createGuardian, isPending } = useCreateGuardian();
  const [form, setForm] = useState({
    fullName: "",
    nationalNumber: "",
    phone: "",
    relationToStudent: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName || !form.nationalNumber || !form.relationToStudent) {
      alert("Please fill in all required fields.");
      return;
    }

    createGuardian(form, {
      onSuccess: () => {
        alert("Guardian created successfully!");
        setForm({
          fullName: "",
          nationalNumber: "",
          phone: "",
          relationToStudent: "",
        });
      },
      onError: (err: any) => {
        console.error(err);
        alert("Failed to create guardian.");
      },
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Add New Guardian</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Enter guardian's full name"
            required
          />
        </div>

        {/* National Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            National Number <span className="text-red-500">*</span>
          </label>
          <input
            name="nationalNumber"
            value={form.nationalNumber}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Enter national number"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Optional"
          />
        </div>

        {/* Relation to Student */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Relation to Student <span className="text-red-500">*</span>
          </label>
          <input
            name="relationToStudent"
            value={form.relationToStudent}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="e.g. Father, Mother, Uncle..."
            required
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
          >
            {isPending ? "Creating..." : "Create Guardian"}
          </button>
        </div>
      </form>
    </div>
  );
}
