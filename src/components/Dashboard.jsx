import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, CheckCircle2 } from "lucide-react";
import { attendance, employees } from "../api";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const DashboardCard = ({ icon: Icon, label, value, gradient, index }) => (
  <motion.div
    custom={index}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
    className={`glass rounded-2xl p-6 border-l-4 ${gradient}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
        <p className="text-4xl font-bold text-gray-900">{value ?? "—"}</p>
      </div>
      <div className={`p-4 rounded-xl ${gradient.split('border-')[1].split(' ')[0] === 'blue' ? 'bg-blue-100' : gradient.split('border-')[1].split(' ')[0] === 'purple' ? 'bg-purple-100' : 'bg-green-100'}`}>
        <Icon size={32} className={gradient.split('border-')[1].split(' ')[0] === 'blue' ? 'text-blue-600' : gradient.split('border-')[1].split(' ')[0] === 'purple' ? 'text-purple-600' : 'text-green-600'} />
      </div>
    </div>
  </motion.div>
);

export default function Dashboard({ refreshTrigger = 0, selectedEmployee = null }) {
  const [data, setData] = useState(null);
  const [selectedEmpData, setSelectedEmpData] = useState(null);
  const [selectedEmpName, setSelectedEmpName] = useState(null);
  const [loadingDash, setLoadingDash] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoadingDash(true);
      try {
        const res = await attendance.dashboard();
        setData(res.data);
      } catch (e) {
        setData(null);
      } finally {
        setLoadingDash(false);
      }
    };
    load();
  }, [refreshTrigger]);

  useEffect(() => {
    const load = async () => {
      if (!selectedEmployee) {
        setSelectedEmpData(null);
        setSelectedEmpName(null);
        return;
      }
      try {
        const empId = parseInt(selectedEmployee, 10);
        const empRes = await employees.list();
        const emp = empRes.data.find(e => e.id === empId);
        setSelectedEmpName(emp?.full_name || null);
        
        const res = await attendance.presentDaysForEmployee(empId);
        console.log('Present days response:', res);
        const presentDaysValue = res.data?.present_days ?? 0;
        setSelectedEmpData({ present_days: presentDaysValue });
      } catch (e) {
        console.error('Error fetching present days:', e);
        setSelectedEmpData({ present_days: 0 });
      }
    };
    load();
  }, [selectedEmployee, refreshTrigger]);

  const cards = [
    { 
      icon: Users, 
      label: "Total Employees", 
      value: data?.total_employees,
      gradient: "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50"
    },
    { 
      icon: Calendar, 
      label: "Total Attendance Records", 
      value: data?.total_attendance_rows,
      gradient: "border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100/50"
    },
    ...(selectedEmployee ? [{
      icon: CheckCircle2,
      label: selectedEmpName ? `${selectedEmpName}'s Present Days` : "Present Days",
      value: selectedEmpData?.present_days,
      gradient: "border-green-500 bg-gradient-to-br from-green-50 to-green-100/50"
    }] : [])
  ];

  return (
    <motion.div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cards.length} gap-6`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loadingDash ? (
        <>
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="h-32 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl animate-pulse-slow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </>
      ) : (
        cards.map((card, i) => (
          <DashboardCard key={card.label} {...card} index={i} />
        ))
      )}
    </motion.div>
  );
}
