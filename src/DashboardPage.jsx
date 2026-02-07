import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import AttendanceForm from "./components/AttendanceForm";
import AttendanceList from "./components/AttendanceList";
import Dashboard from "./components/Dashboard";
import { employees, attendance } from "./api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function DashboardPage() {
  const [emps, setEmps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);

  const fetchEmps = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employees.list();
      setEmps(res.data || []);
    } catch (e) {
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmps();
  }, []);

  const onCreate = async () => {
    await fetchEmps();
    setRefreshTrigger((prev) => prev + 1);
  };

  const onDelete = async (id) => {
    await employees.delete(id);
    await fetchEmps();
    setRefreshTrigger((prev) => prev + 1);
  };

  const onAttendanceMarked = async () => {
    await fetchEmps();
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header className="mb-8" variants={itemVariants}>
          <div className="glass rounded-2xl p-8 border-b-2 border-blue-200/50 relative">
            
            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                window.location.href = "/login";
              }}
              className="absolute top-6 right-6 text-sm font-medium text-red-600 text-red-700
                        px-4 py-2 rounded-lg bg-red-50 transition hover:bg-red-100 cursor-pointer"
            >
              Logout
            </button>

            {/* Title */}
            <h1 className="text-5xl font-bold gradient-text mb-2">
              HRMS Lite
            </h1>

            <p className="text-gray-600 text-lg">
              Modern Employee & Attendance Management System
            </p>

          </div>
        </motion.header>

        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AlertCircle className="text-red-500" size={24} />
            <span className="text-red-700">{error}</span>
          </motion.div>
        )}

        {/* Dashboard */}
        <motion.div variants={itemVariants}>
          <Dashboard
            refreshTrigger={refreshTrigger}
            selectedEmployee={selectedEmployee}
          />
        </motion.div>

        {/* Lists Section */}
        <motion.section
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <motion.div
            className="glass rounded-2xl p-6 card-hover"
            whileHover={{ boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
            </div>
            {loading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse-slow"
                  />
                ))}
              </div>
            )}
            {error && !loading && (
              <div className="text-red-500 text-center py-4">
                Failed to load employees
              </div>
            )}
            {!loading && !error && (
              <EmployeeList employees={emps} onDelete={onDelete} />
            )}
          </motion.div>

          <motion.div
            className="glass rounded-2xl p-6 card-hover"
            whileHover={{ boxShadow: "0 20px 40px rgba(168, 85, 247, 0.15)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
            </div>
            <AttendanceList
              employees={emps}
              refreshTrigger={refreshTrigger}
              onSelectEmployee={setSelectedEmployee}
            />
          </motion.div>
        </motion.section>

        {/* Forms Section (collapsible) */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          variants={itemVariants}
        >
          <motion.div
            className="glass rounded-2xl p-6 card-hover"
            whileHover={{ boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)" }}
          >
            <div className="flex items-center gap-2 mb-4 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h2
                  onClick={() => setShowEmployeeForm((s) => !s)}
                  className="text-2xl font-bold text-gray-800 cursor-pointer"
                >
                  Add Employee
                </h2>
              </div>
              <button
                onClick={() => setShowEmployeeForm((s) => !s)}
                className="px-3 py-1 rounded bg-blue-50 text-blue-700"
              >
                {showEmployeeForm ? "Hide" : "Show"}
              </button>
            </div>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={
                showEmployeeForm
                  ? { height: "auto", opacity: 1 }
                  : { height: 0, opacity: 0 }
              }
              transition={{ duration: 0.4 }}
              style={{ overflow: "hidden" }}
            >
              {showEmployeeForm && <EmployeeForm onCreate={onCreate} />}
            </motion.div>
          </motion.div>

          <motion.div
            className="glass rounded-2xl p-6 card-hover"
            whileHover={{ boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)" }}
          >
            <div className="flex items-center gap-2 mb-4 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <h2
                  onClick={() => setShowAttendanceForm((s) => !s)}
                  className="text-2xl font-bold text-gray-800 cursor-pointer"
                >
                  Mark Attendance
                </h2>
              </div>
              <button
                onClick={() => setShowAttendanceForm((s) => !s)}
                className="px-3 py-1 rounded bg-purple-50 text-purple-700"
              >
                {showAttendanceForm ? "Hide" : "Show"}
              </button>
            </div>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={
                showAttendanceForm
                  ? { height: "auto", opacity: 1 }
                  : { height: 0, opacity: 0 }
              }
              transition={{ duration: 0.4 }}
              style={{ overflow: "hidden" }}
            >
              {showAttendanceForm && (
                <AttendanceForm employees={emps} onMark={onAttendanceMarked} />
              )}
            </motion.div>
          </motion.div>
        </motion.section>

      </motion.div>
    </div>
  );
}
