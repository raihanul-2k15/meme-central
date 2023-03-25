<template>
    <div class="position-relative">
        <div v-show="selected == null" class="list-container" id="listCt">
            <div v-for="(m, i) in filteredMemes" :key="m.id" class="card meme-thumbnail" @click="selectMeme(i)">
                <span
                    class="meme-delete-btn position-absolute top-0 end-0 me-2 mt-2 bg-danger border border-light rounded-circle text-light text-center lh-lg"
                    style="width: 32px; height: 32px"
                    title="Delete"
                    @click="
                        ($event) => {
                            $event.stopPropagation();
                            deleteMeme(m);
                        }
                    "
                >
                    &times;
                </span>

                <div style="height: 200px">
                    <img class="object-fit-contain w-100 h-100" :src="m.path" alt="" />
                </div>

                <div class="card-body">
                    <h6>{{ m.name }}</h6>
                    <p class="card-text">
                        <span
                            v-for="(t, i) in m.tags"
                            :key="i"
                            class="badge rounded-pill mx-1"
                            :class="store.getRandomColorClass()"
                        >
                            {{ t }}
                        </span>
                        <span v-if="m.tags.length == 0" class="badge bg-dark mx-1">No Tags</span>
                    </p>
                </div>
            </div>
            <div v-if="filteredMemes.length == 0" class="w-100 pt-5 text-center">No memes to show</div>
        </div>

        <Preview v-if="selected" :meme="selected" @close="selected = null" />
    </div>
</template>

<script lang="ts">
import Preview from './Preview.vue';
import { storeToRefs } from 'pinia';
import { onMounted, onBeforeUnmount, ref, computed, defineComponent } from 'vue';
import { Meme } from '../env';
import { useMemeStore } from '../store/memeStore';

export default defineComponent({
    name: 'Home',
    components: { Preview },
    setup() {
        const store = useMemeStore();
        const { memes } = storeToRefs(store);
        const filteredMemes = computed(() => memes.value);
        const selected = ref<Meme | null>(null);

        const selectMeme = (i) => {
            selected.value = memes.value[i];
        };
        const deleteMeme = (meme) => {
            store.remove(meme);
        };

        onMounted(() => {
            store.load();
        });

        return {
            memes,
            store,
            filteredMemes,
            selected,
            selectMeme,
            deleteMeme,
        };
    },
});
</script>

<style>
.list-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 8px;
}

.meme-thumbnail {
    display: flex;
    position: relative;
    height: 280px;
    padding: 8px;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
}

.meme-thumbnail:hover {
    background-color: #007bff;
}
.meme-thumbnail .meme-delete-btn {
    z-index: -1;
}

.meme-thumbnail:hover .meme-delete-btn {
    z-index: 1;
}
</style>
