import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { employees } from "../api";

const InputField = React.memo(function InputField({ label, placeholder, value, onChange, type = "text" }) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
      />
    </div>
  );
});

export default function EmployeeForm({ onCreate }) {
  const [form, setForm] = useState({ employee_id: "", full_name: "", email: "", department: ""});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(false);

  const onChangeEmployeeId = useCallback((e) => setForm(f => ({ ...f, employee_id: e.target.value })), []);
  const onChangeFullName = useCallback((e) => setForm(f => ({ ...f, full_name: e.target.value })), []);
  const onChangeEmail = useCallback((e) => setForm(f => ({ ...f, email: e.target.value })), []);
  const onChangeDepartment = useCallback((e) => setForm(f => ({ ...f, department: e.target.value })), []);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSuccess(false);
    setLoading(true);
    try {
      if (!form.employee_id || !form.full_name || !form.email || !form.department) {
        throw new Error("All fields are required");
      }
      await employees.create(form);
      setForm({ employee_id: "", full_name: "", email: "", department: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onCreate && onCreate();
    } catch (e) {
      setErr(e.response?.data?.detail || e.message);
    } finally { setLoading(false); }
  };

  

  return (
    <form onSubmit={submit} className="space-y-4">
      {err && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3"
        >
          <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{err}</span>
        </motion.div>
      )}

      {success && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3"
        >
          <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
          <span className="text-green-700 text-sm font-medium">Employee added successfully!</span>
        </motion.div>
      )}

      <InputField label="Employee ID" placeholder="E001" value={form.employee_id} onChange={onChangeEmployeeId} />
      <InputField label="Full Name" placeholder="John Doe" value={form.full_name} onChange={onChangeFullName} />
      <InputField label="Email" placeholder="john@example.com" type="email" value={form.email} onChange={onChangeEmail} />
      <InputField label="Department" placeholder="Engineering" value={form.department} onChange={onChangeDepartment} />
      
      <motion.button 
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Adding...
          </>
        ) : (
          "Add Employee"
        )}
      </motion.button>
    </form>
  );
}
