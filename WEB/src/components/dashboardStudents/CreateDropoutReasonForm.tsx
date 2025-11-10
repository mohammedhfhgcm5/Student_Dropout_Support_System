import { useState } from "react";
import { useCreateDropoutReason } from "../../hooks/useDropoutReasons";

export function CreateDropoutReasonForm() {
  const [form, setForm] = useState({ category: "", description: "" });
  const createDropoutReason = useCreateDropoutReason();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.category || !form.description) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      await createDropoutReason.mutateAsync(form);
      alert("✅ Dropout reason added successfully!");
      setForm({ category: "", description: "" });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add reason");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-sm border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Add New Dropout Reason
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="e.g., Economic, Family, Health"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Explain the reason in detail..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={createDropoutReason.isPending}
          className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {createDropoutReason.isPending ? "Saving..." : "Save Reason"}
        </button>
      </form>
    </div>
  );
}
