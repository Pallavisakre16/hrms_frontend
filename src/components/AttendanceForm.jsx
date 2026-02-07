import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { attendance } from "../api";

export default function AttendanceForm({ employees = [], onMark }) {
  const [form, setForm] = useState({ employee_id: "", date: "", status: "Present" });
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setLoading(true);
    
    try {
      if (!form.employee_id || !form.date) throw new Error("Select employee and date.");
      await attendance.mark({
        employee_id: parseInt(form.employee_id, 10),
        date: form.date,
        status: form.status
      });
      setSuccessMsg("Attendance marked successfully!");
      onMark && await onMark();
      setForm({ employee_id: "", date: "", status: "Present" });
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e) {
      const errMsg = e.response?.data?.detail || e.message;
      setErrorMsg(errMsg);
      setTimeout(() => setErrorMsg(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3"
        >
          <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
          <span className="text-green-700 text-sm">{successMsg}</span>
        </motion.div>
      )}

      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3"
        >
          <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{errorMsg}</span>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
        <select 
          value={form.employee_id} 
          onChange={e => setForm({...form, employee_id: e.target.value})} 
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
        >
          <option value="">Choose an employee...</option>
          {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_id})</option>)}
        </select>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
        <input 
          type="date" 
          value={form.date} 
          onChange={e => setForm({...form, date: e.target.value})} 
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <div className="flex gap-3">
          {["Present", "Absent"].map((status) => (
            <motion.label 
              key={status}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer flex-1"
            >
              <input 
                type="radio"
                name="status"
                value={status}
                checked={form.status === status}
                onChange={e => setForm({...form, status: e.target.value})}
                className="w-4 h-4 cursor-pointer"
              />
              <span className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
                form.status === status
                  ? status === "Present" 
                    ? "bg-green-100 text-green-700 border-2 border-green-500"
                    : "bg-red-100 text-red-700 border-2 border-red-500"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {status}
              </span>
            </motion.label>
          ))}
        </div>
      </motion.div>

      <motion.button 
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Marking...
          </>
        ) : (
          "Mark Attendance"
        )}
      </motion.button>
    </form>
  );
}
