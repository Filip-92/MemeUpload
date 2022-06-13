export interface Reply {
    id: number;
    url: string;
    content: string;
    uploaded: string;
    username?: string;
    numberOfLikes: number;
    memeId: number;
    commentId: number;
}