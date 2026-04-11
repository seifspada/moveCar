// components/MissionSuccess/MissionNotifications.tsx

import React from 'react';
import { Notification } from '@/app/types/mission';

interface MissionNotificationsProps {
  notifications: Notification[];
}

export const MissionNotifications: React.FC<MissionNotificationsProps> = ({ notifications }) => (
  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-3 print:p-2 print:border">
    <h5 className="font-bold text-orange-800 mb-3 flex items-center gap-1 text-sm print:text-xs print:mb-2">
      <span className="text-base print:text-sm">🔔</span> Notifications
    </h5>
    <div className="space-y-2 print:space-y-1.5">
      {notifications.map((notif, idx) => (
        <div key={idx} className="bg-white p-2 rounded-lg border border-orange-200 print:p-1.5">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-sm print:text-xs">
              {notif.typeNotification === 'DEPART' ? '📤' : '📥'}
            </span>
            <p className="font-bold text-gray-900 text-xs flex-1">
              {notif.typeNotification === 'DEPART' ? 'Départ' : 'Arrivée'}
            </p>
            <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
              notif.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {notif.actif ? '✓' : '○'}
            </span>
          </div>
          <p className="text-xs text-gray-600 truncate">{notif.nomContact || 'N/A'}</p>
          <p className="text-xs text-gray-500">{notif.telephoneContact || 'N/A'}</p>
        </div>
      ))}
    </div>
  </div>
);