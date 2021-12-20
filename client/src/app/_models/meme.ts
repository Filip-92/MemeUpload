export interface Meme {
    [x: string]: any;
    id: number;
    url: string;
    title: string;
    description: string;
    isApproved: boolean;
    username?: string;
}