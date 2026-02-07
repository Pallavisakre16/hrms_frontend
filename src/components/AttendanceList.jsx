import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Filter, CheckCircle2, XCircle, Search } from "lucide-react";
import { attendance } from "../api";

export default function AttendanceList({ employees = [], refreshTrigger = 0, onSelectEmployee }) {
  const [selected, setSelected] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ start_date: "", end_date: "" });

  const load = async (empId, filterState = null) => {
    const currentFilter = filterState || filter;
    const hasDateFilters = currentFilter.start_date || currentFilter.end_date;
    
    if (!empId && !hasDateFilters) {
      setRecords([]);
      return;
    }
    
    setLoading(true);
    try {
      const params = {};
      if (currentFilter.start_date) params.start_date = currentFilter.start_date;
      if (currentFilter.end_date) params.end_date = currentFilter.end_date;
      
      let res;
      if (empId) {
        res = await attendance.listByEmployee(empId, params);
      } else if (hasDateFilters) {
        res = await attendance.listAll(params);
      } else {
        setRecords([]);
        return;
      }
      setRecords(res.data || []);
    } catch (e) {
      console.error('Error loading attendance:', e);
      setRecords([]);
    } finally { setLoading(false); }
  };

  const handleSelectEmployee = (empId) => {
    setSelected(empId);
    onSelectEmployee && onSelectEmployee(empId || null);
    load(empId);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  React.useEffect(() => {
    load(selected);
  }, [refreshTrigger]);

  const getStatusColor = (status) => {
    return status === "Present" 
      ? "bg-green-100 text-green-700 border-green-300" 
      : "bg-red-100 text-red-700 border-red-300";
  };

  const getStatusIcon = (status) => {
    return status === "Present" 
      ? <CheckCircle2 size={18} /> 
      : <XCircle size={18} />;
  };

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-4 border"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
            <select 
              value={selected} 
              onChange={e => handleSelectEmployee(e.target.value)} 
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
            >
              <option value="">All employees</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.full_name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <input 
              type="date" 
              value={filter.start_date} 
              onChange={e => handleFilterChange({...filter, start_date: e.target.value})} 
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input 
              type="date" 
              value={filter.end_date} 
              onChange={e => handleFilterChange({...filter, end_date: e.target.value})} 
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <motion.button 
            onClick={() => load(selected, filter)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg"
          >
            <Filter size={18} />
            Filter
          </motion.button>
        </div>
      </motion.div>

      {/* Records Section */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-16 bg-gradient-to-r from-gray-200 to-gray-100 rounded-xl animate-pulse-slow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      ) : !records.length ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <Search size={48} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No attendance records found</p>
          <p className="text-gray-400 text-sm">Select an employee or dates to view records</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {records.map((r, idx) => (
              <motion.div 
                key={r.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-xl p-4 border-l-4 border-purple-500"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Calendar size={20} className="text-purple-500" />
                    <span className="font-medium text-gray-900">{new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${getStatusColor(r.status)}`}
                  >
                    {getStatusIcon(r.status)}
                    <span className="font-semibold text-sm">{r.status}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
