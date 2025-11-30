import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000/api/students";

const initialFormState = {
  id: null,
  name: "",
  email: "",
  course: "",
  age: "",
};

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.course || !formData.age) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const isEdit = !!formData.id;
      const url = isEdit ? `${API_BASE_URL}/${formData.id}` : API_BASE_URL;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          course: formData.course,
          age: Number(formData.age),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setSuccess(isEdit ? "Student updated successfully" : "Student added successfully");
      setFormData(initialFormState);
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (student) => {
    setError("");
    setSuccess("");
    setFormData({
      id: student.id,
      name: student.name,
      email: student.email,
      course: student.course,
      age: student.age,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete student");
      }
      setSuccess("Student deleted successfully");
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setFormData(initialFormState);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-5xl w-full mx-4 my-10 bg-white shadow-lg rounded-xl p-6 md:p-8">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Student Management
          </h1>
         </header>

        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              {formData.id ? "Edit Student" : "Add New Student"}
            </h2>
            {error && (
              <div className="mb-3 rounded-md bg-red-100 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-3 rounded-md bg-emerald-100 text-emerald-700 px-3 py-2 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Enter student name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="student@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Course
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="e.g. MSc AIML, MCA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  min="16"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Enter age"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition"
                >
                  {formData.id ? "Update" : "Create"}
                </button>
                {formData.id && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-800">
                Students List
              </h2>
              <button
                type="button"
                onClick={fetchStudents}
                className="text-xs px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>
            {loading ? (
              <p className="text-sm text-slate-500">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="text-sm text-slate-500">
                No students yet. Add your first student using the form.
              </p>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-slate-600">
                        Name
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-slate-600">
                        Email
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-slate-600">
                        Course
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-slate-600">
                        Age
                      </th>
                      <th className="px-3 py-2 text-right font-medium text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-3 py-2">{student.name}</td>
                        <td className="px-3 py-2">{student.email}</td>
                        <td className="px-3 py-2">{student.course}</td>
                        <td className="px-3 py-2">{student.age}</td>
                        <td className="px-3 py-2 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(student)}
                            className="text-xs px-2 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(student.id)}
                            className="text-xs px-2 py-1 rounded-md bg-rose-600 text-white hover:bg-rose-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
