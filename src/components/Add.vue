<template>
    <div>
        <div v-show="!adding">
            <div class="p-5 mt-10 text-center">
                <h3>Add a new meme</h3>
                <h6>1. Paste an image from clipboard</h6>
                <h6>2. Copy a file from file explorer and paste it here</h6>
                <h6>
                    3. Choose a file by browsing. (Good luck finding the browse button, spoiler alert: you can't find
                    it. Because I haven't implemented it)
                </h6>
            </div>
        </div>

        <div v-show="adding" class="text-center">
            <div class="w-50 mx-auto">
                <input class="form-control form-control-sm my-2" type="text" v-model="name" placeholder="Name" />
                <div class="d-flex justify-content-center my-2">
                    <div class="me-2 flex-grow-1">
                        <span v-for="(t, i) in tags" :key="i" class="badge rounded-pill bg-primary mx-1">
                            {{ t }}
                        </span>
                        <span v-if="tags.length == 0" class="badge bg-dark mx-1">No Tags Yet</span>
                    </div>
                    <div class="" style="min-width: 100px">
                        <Autocomplete
                            @input="searchTag"
                            @select="selectTag"
                            @enter="selectTag"
                            :options="tagMatches"
                            placeholder="Add Tag"
                        >
                            <template v-slot:item="{ item }">
                                {{ item }}
                            </template>
                        </Autocomplete>
                    </div>
                </div>
                <div class="d-flex justify-content-center my-2">
                    <button class="btn btn-primary mx-2" @click="add">Save</button>
                    <button class="btn btn-secondary mx-2" @click="cancel">Cancel</button>
                </div>
            </div>
            <div class="row w-100">
                <div class="col-sm-8">
                    <img class="meme-image w-100 mh-100 m-2" src="#" alt="" ref="imgRef" />
                </div>
                <div class="col-sm-4">
                    <div class="d-flex justify-content-between">
                        <label for="caption">Caption</label>
                        <button
                            class="btn btn-sm btn-primary"
                            :disabled="generatingCaption || tags.length == 0"
                            @click="generateCaption"
                        >
                            Generate
                        </button>
                    </div>
                    <textarea
                        class="form-control form-control-sm w-100 m-2"
                        id="caption"
                        rows="8"
                        placeholder="Caption"
                        v-model="caption"
                    ></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, defineComponent } from 'vue';
import { UnsavedMeme } from '../env';
import { useMemeStore } from '../store/memeStore';
import Autocomplete from './Autocomplete.vue';

export default defineComponent({
    name: 'Add',
    components: { Autocomplete },
    setup() {
        const store = useMemeStore();

        const adding = ref<boolean>(false);
        const name = ref<string>('');
        const tags = ref<string[]>([]);
        const caption = ref<string>('');
        const allTags = ref<string[]>([]);
        const imgRef = ref<HTMLImageElement | null>(null);
        const generatingCaption = ref<boolean>(false);

        const tagSearchTerm = ref('');
        const searchTag = (term: string) => (tagSearchTerm.value = term);
        const tagMatches = computed(() => {
            const diff = allTags.value.filter((x) => !tags.value.includes(x));
            if (tagSearchTerm.value === '') return diff;
            return diff.filter((t) => t.includes(tagSearchTerm.value));
        });

        const selectTag = (tag: string) => {
            tag = tag.toLowerCase();
            if (tags.value.includes(tag)) return;
            tags.value.push(tag);
        };

        let file: File | null = null;

        onMounted(() => {
            document.onpaste = (e) => {
                const dt = e.clipboardData || (window as any).clipboardData;
                if (dt.files.length < 1) return;
                const f = dt.files[0];
                if (!f.type.includes('image')) return;

                file = f;
                const reader = new FileReader();
                reader.onload = (e) => {
                    (imgRef.value as HTMLImageElement).src = e.target?.result as string;
                    adding.value = true;
                    allTags.value = store.getTags();
                };
                reader.readAsDataURL(f);
            };
        });

        const cancel = () => {
            adding.value = false;
            name.value = '';
            tags.value = [];
        };

        const add = () => {
            if (!adding.value || !file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const memeToSave: UnsavedMeme = {
                    name: name.value == '' ? 'Unnamed' : name.value,
                    tags: [...tags.value],
                    caption: caption.value,
                    imageContents: btoa(e.target?.result as string),
                };

                store.add(memeToSave);

                cancel();
            };
            reader.readAsBinaryString(file);
        };

        const generateCaption = () => {
            generatingCaption.value = true;
            window.ipcRenderer
                .invoke('generateCaption', {
                    name: name.value,
                    tags: [...tags.value],
                })
                .then((c) => {
                    caption.value = c;
                    setTimeout(() => (generatingCaption.value = false), 30 * 1000);
                })
                .catch((e) => {
                    caption.value = 'failed to generate caption: ' + e.toString();
                    console.error(e);
                    generatingCaption.value = false;
                });
        };

        return {
            adding,
            name,
            tags,
            caption,
            tagMatches,
            searchTag,
            selectTag,
            generateCaption,
            generatingCaption,
            allTags,
            imgRef,
            cancel,
            add,
        };
    },
});
</script>
<style>
body[data-bs-theme='dark'] .form-control {
    background-color: rgb(var(--bs-dark-rgb));
    border-color: rgb(var(--bs-primary-rgb));
}
</style>
