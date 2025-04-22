export interface Notification {
    id: number;
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: string;
    seen: boolean;
  }