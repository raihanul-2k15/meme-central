/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

export interface Meme {
    id: number;
    name: string;
    path: string;
    tags: string[];
    caption: string;
}

export interface UnsavedMeme {
    name: string;
    tags: string[];
    caption: string;
    imageContents: string;
}
