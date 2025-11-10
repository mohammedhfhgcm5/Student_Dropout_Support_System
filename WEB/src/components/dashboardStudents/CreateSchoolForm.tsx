import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useCreateSchool } from "../../hooks/useSchools";
import type { CreateSchoolDto } from "../../types/schoolTypes";
import { locationService } from "../../api/locationService";

export function CreateSchoolForm() {
  const { register, handleSubmit, reset, setValue } = useForm<CreateSchoolDto>();
  const { mutate: createSchool, isPending } = useCreateSchool();

  // 📍 Location search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ id: number; name: string; region: string } | null>(null);

  // 🧠 Fetch locations dynamically
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res =
          query.trim() === ""
            ? await locationService.getAll()
            : await locationService.search(query);
        setResults(res);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };

    const delay = setTimeout(fetchLocations, 400);
    return () => clearTimeout(delay);
  }, [query]);

  // 🧾 Submit handler
  const onSubmit = (data: CreateSchoolDto) => {
    if (!selectedLocation) {
      alert("⚠️ Please select a location before saving.");
      return;
    }

    createSchool(
      {
        ...data,
        locationId: selectedLocation.id,
        // address and region already set via setValue()
      },
      {
        onSuccess: () => {
          alert("✅ School created successfully!");
          reset();
          setSelectedLocation(null);
          setQuery("");
          setResults([]);
        },
        onError: () => alert("❌ Failed to create school."),
      }
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Add New School</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 🏫 School Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">School Name</label>
          <input
            {...register("name", { required: true })}
            className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
          />
        </div>

        {/* 📍 Location (Searchable Dropdown) */}
        <div className="relative col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search or leave empty..."
            className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
          />

          {/* Dropdown results */}
          {results.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-200 mt-1 w-full rounded-md max-h-40 overflow-auto">
              {results.map((loc) => (
                <li
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocation({ id: loc.id, name: loc.name, region: loc.region });
                    setQuery(loc.name);
                    setResults([]);
                    setValue("locationId", loc.id);
                    // 🧠 Auto-fill fields
                    setValue("address", loc.name);
                    setValue("region", loc.region);
                  }}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {loc.name} — <span className="text-gray-500 text-xs">{loc.region}</span>
                </li>
              ))}
            </ul>
          )}

          {selectedLocation && (
            <p className="text-xs text-green-600 mt-1">
              Selected Location: {selectedLocation.name} (Region: {selectedLocation.region})
            </p>
          )}
        </div>

        {/* 🏠 Address (auto-filled but editable) */}
        <div>
          <label className="text-sm font-medium text-gray-700">Address</label>
          <input
            {...register("address")}
            className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
            placeholder="Auto-filled from location..."
          />
        </div>

        {/* 🌍 Region (auto-filled but editable) */}
        <div>
          <label className="text-sm font-medium text-gray-700">Region</label>
          <input
            {...register("region", { required: true })}
            className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
            placeholder="Auto-filled from location..."
          />
        </div>

        {/* 💾 Submit */}
        <div className="col-span-2 mt-4">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors w-full"
          >
            {isPending ? "Saving..." : "Save School"}
          </button>
        </div>
      </form>
    </div>
  );
}
