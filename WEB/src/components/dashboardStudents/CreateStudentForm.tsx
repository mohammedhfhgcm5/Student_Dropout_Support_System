import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateStudent } from "../../hooks/useStudents";
import {
  Gender,
  StudentStatus,
  type CreateStudentDto,
} from "../../types/studentTypes";
import { guardianService } from "../../api/guardianService";
import { schoolService } from "../../api/schoolService";
import { locationService } from "../../api/locationService";
import { dropoutReasonService } from "../../api/dropoutReasonService";

export function CreateStudentForm() {
  const { register, handleSubmit, reset, setValue } = useForm<CreateStudentDto>();
  const { mutate: createStudent, isPending } = useCreateStudent();

  // 🧩 Guardian state
  const [guardianQuery, setGuardianQuery] = useState("");
  const [guardianResults, setGuardianResults] = useState<any[]>([]);
  const [selectedGuardian, setSelectedGuardian] = useState<{ id: number; name: string } | null>(null);

  // 🏫 School state
  const [schoolQuery, setSchoolQuery] = useState("");
  const [schoolResults, setSchoolResults] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<{ id: number; name: string } | null>(null);

  // 📍 Location state
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ id: number; name: string } | null>(null);
  // 💬 Dropout Reason state
const [dropoutReasonQuery, setDropoutReasonQuery] = useState("");
const [dropoutReasonResults, setDropoutReasonResults] = useState<any[]>([]);
const [selectedDropoutReason, setSelectedDropoutReason] = useState<{ id: number; name: string } | null>(null);


  // 🧠 Fetch guardians dynamically
  useEffect(() => {
    const fetchGuardians = async () => {
      try {
        const res =
          guardianQuery.trim() === ""
            ? await guardianService.getAll()
            : await guardianService.search(guardianQuery);
        setGuardianResults(res);
      } catch (err) {
        console.error("Failed to fetch guardians:", err);
      }
    };
    const delay = setTimeout(fetchGuardians, 400);
    return () => clearTimeout(delay);
  }, [guardianQuery]);

  // 🧠 Fetch schools dynamically
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res =
          schoolQuery.trim() === ""
            ? await schoolService.getAll()
            : await schoolService.search(schoolQuery);
        setSchoolResults(res);
      } catch (err) {
        console.error("Failed to fetch schools:", err);
      }
    };
    const delay = setTimeout(fetchSchools, 400);
    return () => clearTimeout(delay);
  }, [schoolQuery]);

  // 🧠 Fetch locations dynamically
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res =
          locationQuery.trim() === ""
            ? await locationService.getAll()
            : await locationService.search(locationQuery);
        setLocationResults(res);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    const delay = setTimeout(fetchLocations, 400);
    return () => clearTimeout(delay);
  }, [locationQuery]);

  // 🧠 Fetch dropout reasons dynamically
useEffect(() => {
  const fetchDropoutReasons = async () => {
    try {
      const res =
        dropoutReasonQuery.trim() === ""
          ? await dropoutReasonService.getAll()
          : await dropoutReasonService.search(dropoutReasonQuery);
      setDropoutReasonResults(res);
    } catch (err) {
      console.error("Failed to fetch dropout reasons:", err);
    }
  };
  const delay = setTimeout(fetchDropoutReasons, 400);
  return () => clearTimeout(delay);
}, [dropoutReasonQuery]);


  // 🧾 Form submit
  const onSubmit = (data: CreateStudentDto) => {
    if (!selectedGuardian) {
      alert("⚠️ Please select a guardian before saving.");
      return;
    }

    createStudent(
      {
        ...data,
        guardianId: selectedGuardian.id,
        schoolId: selectedSchool?.id,
        locationId: selectedLocation?.id,
      },
      {
        onSuccess: () => {
          alert("✅ Student created successfully!");
          reset();
          setSelectedGuardian(null);
          setSelectedSchool(null);
          setSelectedLocation(null);
          setGuardianQuery("");
          setSchoolQuery("");
          setLocationQuery("");
          setGuardianResults([]);
          setSchoolResults([]);
          setLocationResults([]);
        },
        onError: (err) => {
          console.error(err);
          alert("❌ Failed to create student.");
        },
      }
    );
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Student</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* 🧍 Full Name */}
        <Input label="Full Name" register={register("fullName", { required: true })} />

        {/* 🆔 National Number */}
        <Input label="National Number" register={register("nationalNumber", { required: true })} />

        {/* ⚧ Gender */}
        <Select
          label="Gender"
          register={register("gender", { required: true })}
          options={[
            { value: Gender.MALE, label: "Male" },
            { value: Gender.FEMALE, label: "Female" },
            { value: Gender.OTHER, label: "Other" },
          ]}
        />

        {/* 🟢 Status */}
        <Select
          label="Status"
          register={register("status", { required: true })}
          options={[
            { value: StudentStatus.ACTIVE, label: "Active" },
            { value: StudentStatus.DROPOUT, label: "Dropout" },
            { value: StudentStatus.RETURNED, label: "Returned" },
            { value: StudentStatus.AT_RISK, label: "At Risk" },
          ]}
        />

        {/* 🌍 Languages */}
        <Input label="Main Language" register={register("mainLanguage", { required: true })} />
        <Input label="Acquired Language" register={register("acquiredLanguage")} />

        {/* ❤️ Support Needs */}
        <Input label="Support Needs" register={register("supportNeeds")} />

        {/* 📅 Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("dateOfBirth", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 👨‍👩 Guardian Selector */}
        <SearchSelect
          label="Guardian"
          query={guardianQuery}
          setQuery={setGuardianQuery}
          results={guardianResults}
          setResults={setGuardianResults}
          selected={selectedGuardian}
          setSelected={setSelectedGuardian}
          setValue={(id) => setValue("guardianId", id)}
          display={(g) => `${g.fullName} — ${g.nationalNumber}`}
        />

        {/* 🏫 School Selector */}
        <SearchSelect
          label="School"
          query={schoolQuery}
          setQuery={setSchoolQuery}
          results={schoolResults}
          setResults={setSchoolResults}
          selected={selectedSchool}
          setSelected={setSelectedSchool}
          setValue={(id) => setValue("schoolId", id)}
          display={(s) => `${s.name} — ${s.region}`}
        />

        {/* 📍 Location Selector */}
        <SearchSelect
          label="Location"
          query={locationQuery}
          setQuery={setLocationQuery}
          results={locationResults}
          setResults={setLocationResults}
          selected={selectedLocation}
          setSelected={setSelectedLocation}
          setValue={(id) => setValue("locationId", id)}
          display={(l) => `${l.name} — ${l.region}`}
        />
        {/* 🧩 Dropout Reason Selector */}
        <SearchSelect
          label="Dropout Reason"
          query={dropoutReasonQuery}
          setQuery={setDropoutReasonQuery}
          results={dropoutReasonResults}
          setResults={setDropoutReasonResults}
          selected={selectedDropoutReason}
          setSelected={setSelectedDropoutReason}
          setValue={(id) => setValue("dropoutReasonId", id)}
          display={(r) => `${r.category} — ${r.description}`}
        />

        {/* 💾 Submit */}
        <div className="col-span-1 md:col-span-2 mt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors w-full shadow-sm"
          >
            {isPending ? "Saving..." : "Save Student"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ✅ Generic Input Field */
function Input({ label, register }: { label: string; register: any }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        {...register}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

/* ✅ Generic Select Field */
function Select({
  label,
  register,
  options,
}: {
  label: string;
  register: any;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        {...register}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ✅ Reusable Searchable Dropdown Component */
function SearchSelect({
  label,
  query,
  setQuery,
  results,
  setResults,
  selected,
  setSelected,
  setValue,
  display,
}: {
  label: string;
  query: string;
  setQuery: (q: string) => void;
  results: any[];
  setResults: (r: any[]) => void;
  selected: { id: number; name: string } | null;
  setSelected: (s: any) => void;
  setValue: (id: number) => void;
  display: (item: any) => string;
}) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Type to search ${label.toLowerCase()}...`}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-200 mt-2 w-full rounded-lg shadow-lg max-h-48 overflow-auto">
          {results.map((r) => (
            <li
              key={r.id}
              onClick={() => {
                setSelected({ id: r.id, name: r.name || r.fullName });
                setQuery(r.name || r.fullName);
                setResults([]);
                setValue(r.id);
              }}
              className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
            >
              {display(r)}
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <p className="text-xs text-green-600 mt-2 font-medium">
          ✓ Selected {label}: {selected.name} (ID: {selected.id})
        </p>
      )}
    </div>
  );
}