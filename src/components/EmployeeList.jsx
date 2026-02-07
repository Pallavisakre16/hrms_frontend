import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, User, Mail, Briefcase } from "lucide-react";
import * as ReactWindow from 'react-window';

const VirtualList = ReactWindow.FixedSizeList || (ReactWindow.default && ReactWindow.default.FixedSizeList);

export default function EmployeeList({ employees = [], onDelete }) {
  const [toDelete, setToDelete] = useState(null);

  if (!employees.length) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <User size={48} className="text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No employees yet.</p>
        <p className="text-gray-400 text-sm">Add your first employee to get started</p>
      </motion.div>
    );
  }

  const handleDelete = (emp) => {
    setToDelete(emp);
  };

  const confirmDelete = (empId) => {
    onDelete(empId);
    setToDelete(null);
  };

  return (
    <>
      {employees.length > 25 ? (
        <VirtualList
          height={520}
          itemCount={employees.length}
          itemSize={120}
          width="100%"
        >
          {({ index, style }) => {
            const emp = employees[index];
            return (
              <div style={style} key={emp.id} className="p-2">
                <div className="glass rounded-xl p-4 border-l-4 border-blue-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {emp.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{emp.full_name}</p>
                          <p className="text-xs text-gray-500">ID: {emp.employee_id}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 md:text-right">
                      <div className="flex items-center gap-2 text-sm text-gray-600 md:justify-end">
                        <Mail size={16} className="text-blue-500" />
                        <span>{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 md:justify-end">
                        <Briefcase size={16} className="text-purple-500" />
                        <span>{emp.department}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <motion.button
                      onClick={() => handleDelete(emp)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center justify-center gap-2 font-medium text-sm transition-all"
                    >
                      <Trash2 size={16} />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            );
          }}
        </VirtualList>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {employees.map((emp) => (
              <motion.div 
                key={emp.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-xl p-4 border-l-4 border-blue-500 group"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {emp.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{emp.full_name}</p>
                        <p className="text-xs text-gray-500">ID: {emp.employee_id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 md:text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600 md:justify-end">
                      <Mail size={16} className="text-blue-500" />
                      <span>{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 md:justify-end">
                      <Briefcase size={16} className="text-purple-500" />
                      <span>{emp.department}</span>
                    </div>
                  </div>
                </div>

                <motion.button 
                  onClick={() => handleDelete(emp)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="mt-3 w-full md:w-auto px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center justify-center gap-2 font-medium text-sm transition-all"
                >
                  <Trash2 size={16} />
                  Delete
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {toDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-6 max-w-sm w-full border"
            >
              <p className="text-lg font-bold text-gray-900 mb-2">Delete Employee?</p>
              <p className="text-gray-600 mb-6">Are you sure you want to delete <span className="font-semibold">{toDelete.full_name}</span>? This action cannot be undone.</p>
              
              <div className="flex gap-3">
                <motion.button 
                  onClick={() => setToDelete(null)}
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
                >
                  Cancel
                </motion.button>
                <motion.button 
                  onClick={() => confirmDelete(toDelete.id)}
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
