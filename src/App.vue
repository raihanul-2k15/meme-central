<script setup lang="ts">
import { ref } from 'vue';
import Home from './components/Home.vue';
import Add from './components/Add.vue';

const page = ref('all');
</script>

<template>
    <ul class="nav nav-pills nav-justified">
        <li class="nav-item">
            <a class="nav-link" :class="{ active: page == 'all' }" @click="page = 'all'" href="#">My Memes</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" :class="{ active: page == 'add' }" @click="page = 'add'" href="#">Add Meme</a>
        </li>
    </ul>

    <Home v-show="page == 'all'" />
    <Add v-show="page == 'add'" />
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
