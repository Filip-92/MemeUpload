export interface Comment {
    [x: string]: any;
    id: number;
    url: string;
    content: string;
    uploaded: Date;
    isEdited: boolean;
    username?: string;
    numberOfLikes: number;
    memeId: number;
}