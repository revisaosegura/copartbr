import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { X, Check, Bell, DollarSign, Calendar, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationCenterProps {
  onClose: () => void;
}

export default function NotificationCenter({ onClose }: NotificationCenterProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  // Buscar notificações
  const { data: notifications, isLoading } = trpc.notifications.getAll.useQuery({
    limit: 20,
  });

  // Marcar como lida
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.getAll.invalidate();
      utils.notifications.getUnreadCount.invalidate();
    },
  });

  // Marcar todas como lidas
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.getAll.invalidate();
      utils.notifications.getUnreadCount.invalidate();
    },
  });

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_bid":
        return <DollarSign className="text-green-600" size={20} />;
      case "price_change":
        return <DollarSign className="text-blue-600" size={20} />;
      case "auction_reminder":
        return <Calendar className="text-orange-600" size={20} />;
      case "favorite_update":
        return <Star className="text-yellow-600" size={20} />;
      default:
        return <Bell className="text-gray-600" size={20} />;
    }
  };

  return (
    <Card
      ref={cardRef}
      className="absolute right-0 top-12 w-96 max-h-[600px] overflow-hidden shadow-2xl z-50 border-2"
    >
      <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
        <CardTitle className="text-lg">Notificações</CardTitle>
        <div className="flex items-center gap-2">
          {notifications && notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              className="text-xs"
            >
              <Check size={14} className="mr-1" />
              Marcar todas como lidas
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[500px] overflow-y-auto">
        {isLoading && (
          <div className="p-8 text-center text-gray-500">
            Carregando notificações...
          </div>
        )}

        {!isLoading && notifications && notifications.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Bell size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Nenhuma notificação</p>
          </div>
        )}

        {!isLoading && notifications && notifications.length > 0 && (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  if (!notification.read) {
                    markAsReadMutation.mutate({ id: notification.id });
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        !notification.read ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
