import React from 'react';
import { mockNotifications } from '../../utils/mockData';
import { NotificationItem } from './NotificationItem';
import { motion } from 'framer-motion';

export function NotificationDropdown() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="divide-y divide-outline-variant"
    >
      {mockNotifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </motion.div>
  );
}
