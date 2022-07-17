import { Meme } from './meme';
import { Photo } from './photo';

export interface Member {
    id: number;
    username: string;
    photoUrl: string;
    memeUrl: string;
    age: number;
    created: Date;
    lastActive: Date;
    gender: string;
    photos: Photo[];
    memes: Meme[];
    comments: Comment[];
    numberOflikes: number;
  }
  
