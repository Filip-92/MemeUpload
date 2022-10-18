export interface Reply {
    id: number;
    url: string;
    content: string;
    uploaded: string;
    isEdited: boolean;
    username?: string;
    numberOfLikes: number;
    memeId: number;
    commentId: number;
    quote: string;
    replyingToUser: string;
    replyingToReplyId: number;
}