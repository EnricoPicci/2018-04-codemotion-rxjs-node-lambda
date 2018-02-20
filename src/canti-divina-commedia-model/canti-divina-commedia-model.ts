
export interface Cantica {
    name: string;
    canti: Array<Canto>
}

export interface Canto {
    name: string;
    content: Array<string>;
    sequence?: number
}
