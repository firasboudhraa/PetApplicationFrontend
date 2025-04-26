export interface NotificationM {
    id: number;
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: string;
    seen: boolean;
  }

export interface Notification {

    id?: number;
    type: string;
    message: string;
    createdAt?: string;
    isRead?: boolean;
}
  
