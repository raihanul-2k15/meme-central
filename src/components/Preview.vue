<template>
    <div class="d-flex w-100 preview position-absolute top-0 start-0 pt-5">
        <span
            class="close-preview position-absolute top-0 end-0 me-2 mt-2 bg-primary rounded-circle text-light text-center lh-base fs-1"
            style="width: 64px; height: 64px"
            title="Close"
            @click="$emit('close')"
        >
            &times;
        </span>

        <div class="w-100 text-center">
            <h4>{{ props.meme.name }}</h4>
            <p>
                <span
                    v-for="(t, i) in props.meme.tags"
                    :key="i"
                    class="badge rounded-pill mx-1"
                    :class="store.getRandomColorClass()"
                >
                    {{ t }}
                </span>
                <span v-if="props.meme.tags.length == 0" class="badge bg-dark mx-1">No Tags</span>
            </p>
            <p class="text-center">Caption: {{ props.meme.caption }}</p>
            <img class="w-50 mh-100 m-2 object-fit-contain" :src="props.meme.path" alt="" />
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, defineComponent, PropType } from 'vue';
import { Meme } from '../env';
import { useMemeStore } from '../store/memeStore';

export default defineComponent({
    name: 'Preview',
    emits: ['close'],
    props: {
        meme: {
            type: Object as PropType<Meme>,
            required: true,
        },
    },
    setup(props) {
        const store = useMemeStore();

        onMounted(() => {});

        return { props, store };
    },
});
</script>

<style>
.preview {
    z-index: 1;
}

.close-preview {
    cursor: pointer;
    user-select: none;
}
</style>
