import { Meme } from "./meme";
import { Photo } from "./photo";

export interface User {
    id: number;
    username: string;
    token: string;
    photoUrl: string;
    memeUrl: string;
    memes: Meme[];
    gender: string;
    roles: string[];
    numberOflikes: number;
    likedByUsers: number;
    isBanned: boolean;
    banExpiration: Date;
    banReason: string;
    photos: Photo[];
    email: string;
}