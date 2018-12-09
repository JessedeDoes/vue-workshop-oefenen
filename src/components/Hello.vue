<!-- src/components/Hello.vue -->

<template>
    <div>
        <div class="greeting">Hello {{name}}{{exclamationMarks}}</div>
        <button @click="decrement">-</button>
        <button @click="increment">+</button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

const testje = "http://localhost:8080/hercules/DSDD?query=select * from integratie.lemmata where lemma='aarzelen'"

export default Vue.extend({
    props: ['name', 'initialEnthusiasm', 'initialResults'],
    data() {
        return {
            enthusiasm: this.initialEnthusiasm,
            results: this.initialResults
        }
    },
    methods: {
        increment() { this.enthusiasm++; },
        decrement() {
            if (this.enthusiasm > 1) {
                this.enthusiasm--;
            }
        },
        getData()
        {
             axios({ method: "GET", "url": testje}).then(result => {
                this.results = result.data.results;
            }, error => {
                console.error(error);
            });
        }
    },
    computed: {
        exclamationMarks(): string {
            return Array(this.enthusiasm + 1).join('!');
        }
    }
});
</script>

<style>
.greeting {
    font-size: 20px;
}
</style>
