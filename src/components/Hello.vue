<!-- src/components/Hello.vue -->

<template>
    <div>
        <div class="greeting">Hello {{name}}{{exclamationMarks}}</div>
        <button @click="decrement">-</button>
        <button @click="increment">+</button>
        <div>{{JSON.stringify(this.bounds)}} {{JSON.stringify(this.center)}}</div>
        <div>{{JSON.stringify(classes)}}</div>
        <div id="kaartje" style="with:100%; height: 1000px"></div>
        
        <table border="border" id="example-1">
            <tr>
                <td></td>
                <td v-for="field in header"><b>{{field}}</b></td>
            </tr>
            <tr v-for="result in results">
                <td><input type="text" v-model="findItem(result['keyword']).valz" @change="x => kwClassHandler(result['keyword'],x)"></td>
                <td v-for="f in Object.keys(result)"><span :class="f"> {{result[f]}}</span></td>
        </tr>
    </table>
    
    </div>
    
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import * as L from "leaflet";

class P {
    keyz: string;
    valz: string;

constructor(a: string, b: string) {
        this.keyz = a;
        this.valz = b;
    }
    setValue(x: string) {
        this.valz = x;
    }
};

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
            results: this.initialResults,
            hasMap: false,
            initialMap: new Array<L.Map>(),
            markers: {}
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
                //alert(JSON.stringify(this.results))
                //alert(JSON.stringify([this.ulx, this.uly, this.lrx, this.lry]))
                this.kaartje
            }, error => {
                console.error(error);
            });
        },
        points(r: any):Array<[string,string]> {
            return r['points'].split("; ").map((s:string) => [s,r['keyword']])
        },
        clearMap(map: L.Map): number 
        {
            map.eachLayer(l => {   l.remove } )
            
    
            return 1;
        },
        findItem(s: string): P { return this.classes.filter((x:P) => x.keyz==s)[0] || new P('aap', 'noot')},

        kwClassHandler(s: string, t: Event): void {
            var newVal =  (t.target as any).value
            alert(s + ":" + newVal ) 
            this.findItem(s).valz = newVal 
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
        classes(): Array<P> {
            var a = this.results.map((r:any) => { return new P(r['keyword'],"")})
            return a;
        },
        allPoints(): Array<[number,number, string]> {
            //alert(this.results.size)
           if (this.results.length> 0) return this.results.flatMap(this.points).map(function (s: [string,string]) { var a = s[0].split(","); return [Number(a[0]), Number(a[1]), s[1]] } )
           else return [[0,0,'bla'],[1,1,'boe']]
        },

        //allPointsLongLat(): Array<L.LatLng> = { var points = this.allPoints.map( (p: [number,number]) => L.LatLng(p[1],p[0]) ); return points},
        maxLong(): number { var iksen:Array<number> = this.allPoints.map((x: [number,number,string]) => x[0]); return max(iksen) },
        minLong(): number { var iksen:Array<number> = this.allPoints.map((x: [number,number,string]) => x[0]); return min(iksen) },
        maxLat(): number { var yen:Array<number> = this.allPoints.map((x: [number,number,string]) => x[1]); return max(yen) },
        minLat(): number { var yen:Array<number> = this.allPoints.map((x: [number,number,string]) => x[1]); return min(yen) },
        southWest(): L.LatLng { return L.latLng(this.minLat, this.minLong)},
        northEast(): L.LatLng { return L.latLng(this.maxLat, this.maxLong)},
        center():L.LatLng  { return L.latLng((this.minLat + this.maxLat)/2, (this.minLong + this.maxLong)/2)},
        bounds():L.LatLngBounds { return L.latLngBounds(this.southWest, this.northEast)},
    
        //boundingRectangle(): L.Rectangle { return  L.rectangle(this.bounds, {color: "red", weight: 1}) },
        kaartje(): L.Map {
            //var map = new L.Map("kaartje");
//map.setView(new L.LatLng(51.505, -0.09), 13);
//var layer =new L.TileLayer("http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "attribution test" })
//layer.addTo(map);
            //return map;
            	// set up the map
    var map:L.Map; //= new L.Map('kaartje');

    if(this.hasMap)
    {
        map = this.initialMap[0]
    } else
    {
       map = new L.Map('kaartje')
       this.hasMap = true;
       this.initialMap.push(map)
    }

	// create the tile layer with correct attribution
	var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});		
    //var centerx = (this.ulx + this.lrx)/2
    //var centery = (this.uly + this.lry)/ 2
	// start the map in South-East England
    // map.setView(new L.LatLng(centery, centerx),5);
    //var southWest = L.latLng(this.minLat, this.minLong)
    //var northEast = L.latLng(this.maxLat, this.maxLong)
    //var center = L.latLng((this.minLat + this.maxLat)/2, (this.minLong + this.maxLong)/2)
    //var bounds = L.latLngBounds(southWest, northEast)
    
    //alert(JSON.stringify(bounds))
    
    //map.remove()
    //map = new L.Map('kaartje')
    // this.clearMap(map)
    map.setMaxBounds(this.bounds)
    map.setView(this.center, 3)
    
        
    map.addLayer(osm);


    // add rectangle passing bounds and some basic styles
    L.rectangle(this.bounds, {color: "red", weight: 1}).addTo(map);
    if (this.allPoints.length < 1000)
    {
       this.allPoints.forEach(p => {
           var p1 = new L.LatLng(p[1],p[0])
           // console.log(JSON.stringify(p1))
           var marker = L.marker(p1)//.addTo(mymap);
           marker.bindPopup(p[2]).openPopup();
           marker.addTo(map)
       })
    }
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


