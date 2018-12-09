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
const testje1 = function(x: string): string { return `http://localhost:8080/hercules/DSDD?query=select max(keywords.lemma) as lemma, 
    max(keywords.keyword) as keyword, 
    max(keywords.definition) as definition, 
    string_agg(distinct location_area, ', ') as area,
    string_agg(distinct location_place, ', ') as place, 
    string_agg(distinct kloeke_new,', ') as kloeke 
from integratie.keywords keywords, integratie.union_table union_table where (keywords.keyword='${x}' or keywords.lemma='${x}') and   
 union_table.lemma_id=keywords.lemma_id and union_table.keyword=keywords.keyword_org group by keywords.lemma_id, keyword_id;
`}

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
             axios({ method: "GET", "url": testje1(this.name)}).then(result => {
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


