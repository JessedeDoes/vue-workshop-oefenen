<!-- src/components/Hello.vue -->

<template>
    <div>
        <div class="greeting">Hello {{name}}{{exclamationMarks}}</div>
        <button @click="decrement">-</button>
        <button @click="increment">+</button>
        <div id="kaartje" style="with:100%; height: 1000px"></div>
        
        <table border="border" id="example-1">
            <tr>
                <td v-for="field in header"><b>{{field}}</b></td>
            </tr>
            <tr v-for="result in results">
                <td v-for="f in Object.keys(result)"><span :class="f"> {{result[f]}}</span></td>
        </tr>
    </table>
    
    </div>
    
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import * as L from "leaflet";
//import 'ol/ol.css';

import VueLayers from 'vuelayers'
//import 'vuelayers/lib/style.css' // needs css-loader

Vue.use(VueLayers)

// or individual components

// kijk ook eens naar: https://gist.github.com/bertt/4956504

import { Map, TileLayer, OsmSource, Geoloc} from 'vuelayers'
//import 'vuelayers/lib/style.css' // needs css-loader
//Vue.use(XYZSource)
//Vue.use(View)
Vue.use(Map)
Vue.use(TileLayer)
Vue.use(OsmSource)
Vue.use(Geoloc)

//import Map f,rom 'ol/Map';
//import View from 'ol/View';
//import TileLayer from 'ol/layer/Tile';
//import XYZSource from 'ol/source/XYZ';

const testje = function(x: string): string { return `http://localhost:8080/hercules/DSDD?query=select * from integratie.keywords where lemma='${x}' or keyword='${x}'` }
const testje1 = function(x: string): string { return `http://localhost:8080/hercules/DSDD?query=select max(keywords.lemma) as lemma, 
    string_agg(distinct keywords.dictionary, ',') as dict,
    max(keywords.keyword) as keyword, 
    max(keywords.definition) as definition, 
    string_agg(distinct location_area, ', ') as area,
    string_agg(distinct location_subarea, ', ') as subarea,
    string_agg(distinct provincie, ', ') as provincie,
    string_agg(distinct streek, ', ') as streek,
    string_agg(distinct location_place, ', ') as place, 
    string_agg(distinct kloeke_new,', ') as kloeke,
    string_agg(distinct lng %7C%7C ',' %7C%7C lat, '; ') as points 
from integratie.keywords keywords, integratie.union_table union_table, integratie.kloeke_cumul coords 
where (keywords.keyword='${x}' or keywords.lemma='${x}') and   
 union_table.lemma_id=keywords.lemma_id and union_table.keyword=keywords.keyword_org and coords.kloeke_code1=union_table.kloeke_new 
 group by keywords.lemma_id, keyword_id;
`}

const max = function(x: Array<number>): number {
   var maxie = x.reduce(function(a, b) {return Math.max(a, b);});
  return maxie;
}

const min = function(x: Array<number>): number {
   var minnie = x.reduce(function(a, b) {return Math.min(a, b);});
  return minnie;
}

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
                alert(JSON.stringify([this.ulx, this.uly, this.lrx, this.lry]))
                alert(this.kaartje)
            }, error => {
                console.error(error);
            });
        },
        points(r: any):Array<string> {
            return r['points'].split("; ")
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
        }, 
        allPoints(): Array<[number,number]> {
           return this.results.flatMap(this.points).map(function (s: string) { var a = s.split(","); return [Number(a[0]), Number(a[1])] } )
        },
        ulx():number { var iksen:Array<number> = this.allPoints.map((x: [number,number]) => x[0]); return min(iksen) },
        lrx(): number { var iksen:Array<number> = this.allPoints.map((x: [number,number]) => x[0]); return max(iksen) },
        uly(): number { var yen:Array<number> = this.allPoints.map((x: [number,number]) => x[1]); return min(yen) },
        lry(): number { var yen:Array<number> = this.allPoints.map((x: [number,number]) => x[1]); return max(yen) },
        kaartje(): L.Map {
            //var map = new L.Map("kaartje");
//map.setView(new L.LatLng(51.505, -0.09), 13);
//var layer =new L.TileLayer("http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "attribution test" })
//layer.addTo(map);
            //return map;
            	// set up the map
	var map = new L.Map('kaartje');

	// create the tile layer with correct attribution
	var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});		

	// start the map in South-East England
	map.setView(new L.LatLng(51.3, 0.7),9);
    map.addLayer(osm);
    return map;
        }
        //bbox(): Array<[number, number]> = { return [[.1,.2]]}
        //bbox(): ((number,number), (number,number)) =  { return ((this.ulx, this.uly), (this.lrx, this.lry)) }
    }
});
</script>


<!--
<style lang="scss">
.greeting {font-size: 20px;}
</style>
-->


