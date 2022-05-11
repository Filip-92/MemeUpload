export interface User {
    id: number;
    username: string;
    token: string;
    photoUrl: string;
    memeUrl: string;
    gender: string;
    roles: string[];
    numberOflikes: number;
}