export interface Comment {
    [x: string]: any;
    id: number;
    url: string;
    content: string;
    uploaded: Date;
    username?: string;
    numberOfLikes: number;
    memeId: number;
}