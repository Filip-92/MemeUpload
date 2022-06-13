export interface Comment {
    id: number;
    url: string;
    content: string;
    uploaded: string;
    username?: string;
    numberOfLikes: number;
    memeId: number;
}