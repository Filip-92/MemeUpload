export interface Comment {
    [x: string]: any;
    id: number;
    url: string;
    content: string;
    uploaded: string;
    username?: string;
    numberOfLikes: number;
}