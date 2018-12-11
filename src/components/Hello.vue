<!-- src/components/Hello.vue -->

<template>
  <div>
    <div class="greeting">Hello {{name}}{{exclamationMarks}}</div>
    <button @click="decrement">-</button>
    <button @click="increment">+</button>
    <div>{{JSON.stringify(this.bounds)}} {{JSON.stringify(this.center)}}</div>
    <div><h3>Keywords:</h3>{{JSON.stringify(this.distinctKeywords)}}</div>
    <div><h3>Keyword classes:</h3>{{JSON.stringify(this.distinctKeywordClasses)}}</div>
    <div id="kaartje" style="with:100%; height: 1000px"></div>

    <table border="border" id="example-1">
      <tr>
        <td></td>
        <td v-bind:key="field" v-for="field in header">
          <b>{{field}}</b>
        </td>
      </tr>
      <tr v-bind:key="result['keyword_id']" v-for="result in results">
        <td>
          <input
            type="text"
            x-v-model="findItem(result['keyword']).valz"
            v-model="markerClasses[result['keyword']]"
            @change="x => kwClassHandler(result['keyword'],x)"
          >
        </td>
        <td v-bind:key="f" v-for="f in Object.keys(result)">
          <span :class="f">{{result[f]}}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<!--
https://stackoverflow.com/questions/23567203/leaflet-changing-marker-color



So this is one of the top hits in Google for styling Leaflet Icon, but it didn't have a solution that worked without third parties, and I was having this problem in React as we needed dynamic colours for our routes and icons.

The solution I came up with was to use Leaflet.DivIcon html attribute, it allows you to pass a string which is evaluated into a DOM element.

So for example I created a marker style follows:


const myCustomColour = '#583470'

createIconWithColour(colour: string): L.DivIcon
{ const markerHtmlStyles = `
  background-color: ${colour};
  width: 3rem;
  height: 3rem;
  display: block;
  left: -1.5rem;
  top: -1.5rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`

  const icon = L.DivIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
   html: `<span style="${markerHtmlStyles}" />`

   return icon
 })

newMarker = L.marker(lat, long], {
  icon: myIcon
});

createIcon()

-->

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
}

const testje = function(x: string): string {
  return `http://localhost:8080/hercules/DSDD?query=select * from integratie.keywords where lemma='${x}' or keyword='${x}'`;
};
const testje1 = function(x: string): string {
  return `http://localhost:8080/hercules/DSDD?query=select max(keywords.lemma) as lemma, 
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
`;
};

const max = function(x: Array<number>): number {
  var maxie = x.reduce(function(a, b) {
    return Math.max(a, b);
  });
  return maxie;
};

const min = function(x: Array<number>): number {
  var minnie = x.reduce(function(a, b) {
    return Math.min(a, b);
  });
  return minnie;
};

export default Vue.extend({
  props: ["name", "initialEnthusiasm", "initialResults"],
  data() {
    return {
      enthusiasm: this.initialEnthusiasm,
      results: this.initialResults,
      hasMap: false,
      initialMap: new Array<L.Map>(),
      markerClasses: {}
    };
  },
  methods: {
    increment() {
      this.enthusiasm++;
    },
    decrement() {
      if (this.enthusiasm > 1) {
        this.enthusiasm--;
      }
      this.getData();
    },
    getData() {
      axios({ method: "GET", url: testje1(this.name) }).then(
        result => {
          this.results = result.data.results;
          //this.shuffleArray(this.results); // is dit niet dom??
          //alert(JSON.stringify(this.results))
          //alert(JSON.stringify([this.ulx, this.uly, this.lrx, this.lry]))
          this.kaartje;
        },
        error => {
          console.error(error);
        }
      );
    },
    points(r: any): Array<[string, string]> {
      return r["points"].split("; ").map((s: string) => [s, r["keyword"]]);
    },
    clearMap(map: L.Map): number {
      map.eachLayer(l => {
        l.remove;
      });

      return 1;
    },
    findItem(s: string): P {
      return (
        this.classes.filter((x: P) => x.keyz == s)[0] || new P("aap", "noot")
      );
    },

    kwClassHandler(s: string, t: Event): void {
      var newVal = (t.target as any).value;
      //alert(s + ":" + newVal )
      //this.findItem(s).valz = newVal;
      Vue.set(this.markerClasses, s, newVal);
    },
    
    distinctly(a: Array<string>): Array<string> {
      let s: any = {}
      a.forEach(x => s[x] = 1)
      return Object.keys(s);
    },

    shuffleArray(array: Array<any>): void {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    },
    createIconWithColour(colour: string): L.DivIcon { 
        const markerStyle = `
  background-color: ${colour};
  width: 1rem;
  height: 1rem;
  display: block;
  left: -1.5rem;
  top: -1.5rem;
  position: relative;
  border-radius: 1rem 1rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`

    const icon:L.DivIcon = new L.DivIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    // labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerStyle}" />`})

    return icon
    },
  },
  computed: {
    exclamationMarks(): string {
      return Array(this.enthusiasm + 1).join("!");
    },

    header(): Array<string> {
      if (this.results.length > 0) return Object.keys(this.results[0]);
      else return [];
    },

    classes(): Array<P> {
      var a = this.results.map((r: any) => {
        return new P(r["keyword"], "");
      });
      return a;
    },

    allPoints(): Array<[number, number, string]> {
      //alert(this.results.size)
      if (this.results.length > 0)
        return this.results
          .flatMap(this.points)
          .map(function(s: [string, string]) {
            var a = s[0].split(",");
            return [Number(a[0]), Number(a[1]), s[1]];
          });
      else return [[0, 0, "bla"], [1, 1, "boe"]];
    },
    sampleOfAllpoints(): Array<[number, number, string]> {
      var copy = this.allPoints.map((x: [number, number, string]) => x);
      this.shuffleArray(copy);
      return copy.slice(0, Math.min(300, copy.length));
    },
    maxLong(): number {
      var iksen: Array<number> = this.allPoints.map(
        (x: [number, number, string]) => x[0]
      );
      return max(iksen);
    },

    minLong(): number {
      var iksen: Array<number> = this.allPoints.map(
        (x: [number, number, string]) => x[0]
      );
      return min(iksen);
    },
    maxLat(): number {
      var yen: Array<number> = this.allPoints.map(
        (x: [number, number, string]) => x[1]
      );
      return max(yen);
    },
    minLat(): number {
      var yen: Array<number> = this.allPoints.map(
        (x: [number, number, string]) => x[1]
      );
      return min(yen);
    },
    southWest(): L.LatLng {
      return L.latLng(this.minLat, this.minLong);
    },
    northEast(): L.LatLng {
      return L.latLng(this.maxLat, this.maxLong);
    },
    center(): L.LatLng {
      return L.latLng(
        (this.minLat + this.maxLat) / 2,
        (this.minLong + this.maxLong) / 2
      );
    },
    bounds(): L.LatLngBounds {
      return L.latLngBounds(this.southWest, this.northEast);
    },
    distinctKeywords() : Array<string>  {
        return this.distinctly(this.results.map( (r: any) => r['keyword']))
    },

    distinctKeywordClasses(): Array<string> {
      var s: any = {};
      this.results.forEach((r: any) => {
        var kw = r['keyword'];
        if (kw in this.markerClasses) {
          var c: string = (this.markerClasses as any)[kw] as string; // Huh? Hoe kan dit netter???
          s[c] = 1;
        } else s[kw] = 1;
      });
      return Object.keys(s);
    },

    iconMap(): { [key:string]: L.DivIcon}  {
      var s = this.distinctKeywordClasses;
      console.log(JSON.stringify(s))
      var l = s.length
      var increment = 255 / l
      var colorMap: { [key:string]: L.DivIcon} = {}
      var b = 0

      for (var i=0; i < l; i++)
      {
          var colour = `hsl(${b},75%,75%)`
          console.log(colour)
          colorMap[s[i]] = this.createIconWithColour(colour)
          b = Math.floor(b+increment)
      }
    
      return colorMap
    },

    kaartje(): L.Map {
      
      /*
      type test = {
          type: 'test',
          testvar: number
      }|{
          type: 'other',
          othertestvar: string
      }

        function isString(v : any): v is string {
            return typeof v === 'string'
        }


      let a = {} as test;
        if (isString(a)) {
            a.
        }
    if (a.type === 'test') {
        a.
    } else {
        a.
    }
     */ 
      
      // set up the map
      var map: L.Map;

      if (this.hasMap) {
        map = this.initialMap[0];
        map.remove();
        (document.getElementById('kaartje')!).setAttribute('class',"")


        map = new L.Map("kaartje");
        this.hasMap = true;
        this.initialMap[0] = map;
      } else {
        map = new L.Map("kaartje");
        this.hasMap = true;
        this.initialMap.push(map);
      }

      // create the tile layer with correct attribution
      var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      var osmAttrib =
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
      var osm = new L.TileLayer(osmUrl, {
        minZoom: 8,
        maxZoom: 12,
        attribution: osmAttrib
      });


      map.setMaxBounds(this.bounds);
      map.setView(this.center, 9);

      map.addLayer(osm);

      // add rectangle passing bounds and some basic styles
      L.rectangle(this.bounds, { color: "red", weight: 1 }).addTo(map);
      
      var markerGroup: Array<L.Marker> = []  

      this.sampleOfAllpoints.forEach(p => {
        var p1 = new L.LatLng(p[1], p[0])
        var marker = L.marker(p1, {icon: this.iconMap[p[2]]})
        marker.bindPopup(p[2]).openPopup()
        markerGroup.push(marker)
        marker.addTo(map)
      });
      
      var layer = new L.LayerGroup(markerGroup)
      

      return map;
    }
  }
});
</script>


<!--
<style lang="scss">
.greeting {font-size: 20px;}
</style>
-->


