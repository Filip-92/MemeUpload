export interface Notification {
    [x: string]: any;
    id: number;
    content: string;
    memeId: number;
    userId: number;
    sentTime: string;
    isRead: false;
}