export interface NotificationFE {
    id: string; // _id từ BE
    user: string; // userId
    title: string;
    message: string;
    type?: string;
    link?: string;
    isRead: boolean;
    relatedApplication?: string; // applicationId
    createdAt: string; // ISO Date string
    updatedAt?: string; // ISO Date string
  }