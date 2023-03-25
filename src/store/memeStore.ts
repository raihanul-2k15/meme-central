import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Meme, UnsavedMeme } from '../env';

const colorClasses = [
    ['bg-primary', 'text-light'],
    ['bg-secondary', 'text-light'],
    ['bg-success', 'text-light'],
    ['bg-danger', 'text-light'],
    // ['bg-warning', 'text-dark'],
    // ['bg-info', 'text-dark'],
];
const getRandomColorClass = () => {
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    const [bg, fg] = colorClasses[randomIndex];
    return `${bg} ${fg}`;
};

let fakeMemes = [
    {
        id: 1,
        name: 'Meme 1',
        tags: ['meme', 'is', 'fun', 'for', 'health', 'benefits'],
        path: '/src/assets/images/electron.png',
    },
    {
        id: 2,
        name: 'Meme 2',
        tags: ['mishuk', 'loves', 'meme', 'and', 'hates', 'it'],
        path: '/src/assets/images/placeholder.jpg',
    },
];

export const useMemeStore = defineStore('memes', () => {
    const memes = ref<Meme[]>([]);

    const load = async () => {
        if (typeof window.ipcRenderer === 'undefined') {
            memes.value = fakeMemes;
            return;
        }

        memes.value = await window.ipcRenderer.invoke('getMemes');
    };

    const add = async (meme: UnsavedMeme) => {
        if (typeof window.ipcRenderer === 'undefined') {
            memes.value.push({
                id: memes.value.length + 1,
                name: meme.name,
                tags: meme.tags,
                path: '/src/assets/images/placeholder.jpg',
            });
            return;
        }
        await window.ipcRenderer.invoke('addMeme', meme);
        await load();
    };

    const remove = async (meme: Meme) => {
        if (typeof window.ipcRenderer === 'undefined') {
            memes.value = memes.value.filter((m) => m.id !== meme.id);
            return;
        }
        await window.ipcRenderer.invoke('removeMeme', meme.id);
        await load();
    };

    const getTags = (): string[] => {
        const set = new Set<string>();
        memes.value.forEach((meme) => meme.tags.forEach((tag) => set.add(tag)));
        return [...set];
    };

    return {
        memes,
        load,
        add,
        remove,
        getTags,
        getRandomColorClass,
    };
});
