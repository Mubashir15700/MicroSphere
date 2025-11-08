import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell } from 'lucide-react';
import { fetchWithAuth } from '@/lib/fetchClient';

interface Notification {
  id: number;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export function NotificationMenu({
  notifications: initialNotifications,
}: {
  notifications: Notification[];
}) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const handleMarkAllAsRead = async () => {
    const response = await fetchWithAuth(`/api/notification?action=markAllAsRead`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids: notifications.map((n) => n.id),
        isRead: true,
      }),
    });

    if (!response.ok) {
      return;
    }

    const updatedNotifications = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updatedNotifications);
  };

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0">
        <div className="flex justify-end border-b p-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`hover:bg-muted/50 border-b p-4 transition-colors last:border-0 ${
                  notif.isRead ? 'opacity-60' : 'opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium">New Notification</h4>
                  <span className="text-muted-foreground text-xs">
                    {new Date(notif.createdAt).toLocaleString().split(',')[0]}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">{notif.message}</p>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground p-4 text-center text-sm">
              No new notifications
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
