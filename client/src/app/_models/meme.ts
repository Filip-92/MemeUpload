export interface Meme {
    [x: string]: any;
    id: number;
    url: string;
    title: string;
    description: string;
    uploaded: string;
    isApproved: boolean;
    username?: string;
    numberOfLikes: number;
    comments: Comment[];
}