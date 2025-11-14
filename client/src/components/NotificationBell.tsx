import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import NotificationCenter from "./NotificationCenter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, loading } = useAuth();
  const isAuthenticated = Boolean(user);

  // Buscar notificações não lidas
  const { data: unreadCount } = trpc.notifications.getUnreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? 30000 : undefined, // Atualizar somente para usuários autenticados
  });

  if (loading) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white hover:bg-white/10"
          disabled
        >
          <Bell size={20} />
        </Button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative text-white hover:bg-white/10"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell size={20} />
        {unreadCount && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {showNotifications && (
        <NotificationCenter onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
}
