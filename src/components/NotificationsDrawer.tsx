import React from 'react';
import { 
  X, 
  Bell, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Check, 
  CheckCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { NotificationItem } from '../types';
import { ApiClient } from '../services/apiClient';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onNotificationUpdate: () => void;
  onActionClick: (actionLink?: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onNotificationUpdate,
  onActionClick
}) => {
  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    await ApiClient.markAllNotificationsRead();
    onNotificationUpdate();
  };

  const handleItemClick = async (notif: NotificationItem) => {
    if (!notif.read) {
      await ApiClient.markNotificationRead(notif.id);
      onNotificationUpdate();
    }
    if (notif.actionLink) {
      onActionClick(notif.actionLink);
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'EXPIRY':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'MISSING_DOC':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'MISMATCH':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#006B4F]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Notifications</h2>
              <p className="text-xs text-slate-500">Citizen alerts & scheme updates</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-[#006B4F] hover:underline font-semibold flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 p-4 overflow-y-auto divide-y divide-slate-100 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`
                pt-3 first:pt-0 p-3 rounded-2xl cursor-pointer transition-colors
                ${n.read ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/40 border border-emerald-100/70 hover:bg-emerald-50/70'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(n.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {n.message}
                  </p>

                  {n.actionLabel && (
                    <div className="pt-1.5 flex items-center text-xs font-bold text-[#006B4F]">
                      <span>{n.actionLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No notifications at this time.
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <p className="text-[11px] text-slate-500">
            Real-time synchronization with State & Central Welfare Portals
          </p>
        </div>
      </div>
    </>
  );
};
