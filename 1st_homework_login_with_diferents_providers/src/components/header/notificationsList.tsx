"use client";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/credentials";
import { Timestamp } from "firebase/firestore";
import "@/styles/notifications.css";
import { IoIosNotifications } from "react-icons/io";
import { Notification, NotificationsListProps } from "@/types/notification";

export function NotificationsList({ user }: NotificationsListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!user) return;

    const notificationsQuery = query(
      collection(db, "userNotifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notificationsList: Notification[] = [];
        let unreadCounter = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          notificationsList.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt as Timestamp,
          } as Notification);

          if (!data.read) {
            unreadCounter++;
          }
        });

        setNotifications(notificationsList);
        setUnreadCount(unreadCounter);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, "userNotifications", notificationId), {
        read: true,
        readAt: new Date(),
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      const promises = unreadNotifications.map((notification) =>
        updateDoc(doc(db, "userNotifications", notification.id), {
          read: true,
          readAt: new Date(),
        })
      );
      await Promise.all(promises);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate();
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Ahora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="notifications-container">
      <button
        className="notifications-button"
        onClick={() => setIsOpen(!isOpen)}
        ref={buttonRef}
      >
        <IoIosNotifications size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-list">
            <div className="notifications-header">
              <h3>Notificaciones</h3>
              {unreadCount > 0 && (
                <button className="mark-all-read-btn" onClick={markAllAsRead}>
                  Marcar todas como leídas
                </button>
              )}
              <button
                className="notifications-close-btn"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              <div className="notifications-scroll">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      !notification.read ? "unread" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-header">
                      <h4 className="notification-title">
                        {notification.title}
                      </h4>
                      <span className="notification-time">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="notification-body">{notification.body}</p>
                    {!notification.read && (
                      <div className="unread-indicator"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="notifications-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
