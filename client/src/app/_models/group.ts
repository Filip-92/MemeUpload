export interface Group {
    name: string;
    connections;
}

interface Connection {
    connectionId: string;
    username: string;
}