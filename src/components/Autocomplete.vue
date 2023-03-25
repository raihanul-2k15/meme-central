<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch, inject } from 'vue';
import useDetectOutsideClick from '../composables/useDetectOutsideClick';

export default defineComponent({
    name: 'Autocomplete',
    props: {
        inputClass: String,
        containerClass: String,
        optionClass: String,
        placeholder: String,
        options: {
            type: Array,
            required: true,
        },
    },
    emits: ['select', 'input', 'enter'],
    setup(props, context) {
        const term = ref('');
        const show = ref(false);
        watch(term, (v) => {
            context.emit('input', v);
            show.value = true;
        });

        const select = (item) => {
            context.emit('select', item);
            term.value = '';
            show.value = false;
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') show.value = false;
            if (term.value == '') return;
            if (e.key === 'Enter') {
                context.emit('enter', term.value);
                term.value = '';
                show.value = false;
            }
        };
        const handleFocus = () => {
            show.value = true;
        };

        const containerRef = ref();
        useDetectOutsideClick(containerRef, () => (show.value = false));

        return { props, term, select, show, handleKeyDown, handleFocus, containerRef };
    },
});
</script>

<template>
    <div ref="containerRef" class="dropdown-container">
        <input
            class="form-control form-control-sm"
            :class="props.inputClass"
            type="text"
            :placeholder="props.placeholder"
            v-model="term"
            @keydown="handleKeyDown"
            @focus="handleFocus"
        />

        <div v-if="show && props.options.length > 0" :class="'select-container ' + props.containerClass">
            <div
                v-for="item in props.options"
                :class="'select-item cursor-pointer user-select-none ' + props.optionClass"
                @click="select(item)"
            >
                <slot name="item" :item="item"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dropdown-container {
    position: relative;
}

.select-container {
    width: 100%;
    position: absolute;
    border: 1px solid cyan;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    background-color: rgb(var(--bs-light-rgb));
}

body[data-bs-theme='dark'] .select-container {
    background-color: rgb(var(--bs-dark-rgb));
}

.select-item {
    padding: 2px;
}

.select-item:hover {
    background-color: #007bff;
}
</style>
