export interface Score {
    id: string;
    title: string;
    composer: string | 'Anonymous';
    dateComposed: string;
    genre: string;
    source: string;
    notation: string;
    voices: number;
    language: string;
    instruments: string[];
    description: string;
    transcribedBy: string;
    transcriptionDate: string;
    lastModified: string;
    tags: string[];
    thumbnailUrl: string;
    meiData: string;
};