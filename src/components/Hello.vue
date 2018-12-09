<!-- src/components/Hello.vue -->

<template>
    <div>
        <div class="greeting">Hello {{name}}{{exclamationMarks}}</div>
        <button @click="decrement">-</button>
        <button @click="increment">+</button>
        <table border="border" id="example-1">
            <tr>
                <td v-for="field in header"><b>{{field}}</b></td>
            </tr>
            <tr v-for="result in results">
                <td v-for="cell in result">{{cell}}</td>
        </tr>
</table>
    </div>
    
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

const testje = function(x: string): string { return `http://localhost:8080/hercules/DSDD?query=select * from integratie.keywords where lemma='${x}' or keyword='${x}'` }

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
            this.getData()
        },
        getData()
        {
             axios({ method: "GET", "url": testje(this.name)}).then(result => {
                this.results = result.data.results;
                alert(JSON.stringify(this.results))
            }, error => {
                console.error(error);
            });
        }
    },
    computed: {
        exclamationMarks(): string {
            return Array(this.enthusiasm + 1).join('!');
        },
        header(): Array<string> {
            if (this.results.length > 0)
                return  Object.keys(this.results[0]);
                else return []
        } 
    }
});
</script>


