export interface Meme {
    [x: string]: any;
    id: number;
    url: string;
    isApproved: boolean;
    username?: string;
}