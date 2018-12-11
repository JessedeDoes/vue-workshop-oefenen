<!-- src/components/EditGrouping.vue -->

<template>
  <div style="background-color: lightblue">
    <div>Terms: {{JSON.stringify(this.terms)}}</div>
    <div>Grouping: {{JSON.stringify(this.grouping)}}</div>
    <div>Group names: {{JSON.stringify(this.groups)}}</div>
    <div>Group assignments: {{JSON.stringify(this.groupOf)}}</div>
    <button @click="increment()">add group</button>
    <!-- <button @click="decrement()">remove last group</button> -->
    <h3>groups: {{this.nGroups}} edits: {{ this.nEdits }} </h3>
    <div v-bind:key="id" v-for="id in Object.keys(groups)">
      {{ id }} :
      <input @change="edit()" type="text" v-model="groups[id]">
    </div>
    <div style="column-count: 4">
      <table>
    <tr v-for="term in terms" v-bind:key="term">
      <td>{{ term }}</td> <td>
        <!--
        <select @change="edit()" v-model="groupOf[term]" size="2"><option style="overflow: hidden; border:1px solid #000; display: inline-block; width:8em;" 
        v-bind:key="id" v-for="id in Object.keys(groups)">{{ groups[id] }}</option></select>
        -->
        <button :style="{backgroundColor: (groupOf[term]==id)?'lightblue':'lightgrey'}" @click="groupOf[term]=id; edit()" v-bind:key="id" v-for="id in Object.keys(groups)">{{ groups[id] }}</button>
        </td>
    </tr>
    </table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import * as L from "leaflet";

export default Vue.extend({
  props: ["terms"],
  data() {
    return {
      assignedGrouping: {},
      nGroups: 2,
      nEdits: 0,
      groups: {"g1": "?", "g2": "?"},
      groupOf: {}
    };
  },
  methods: {
    increment() {
      this.nGroups++;
      var newName = "g" + (this.nGroups)
      if (!(newName in this.groups))
        (this.groups as any)[newName] = "??";
        this.computedGroups()
    },
    
    edit() {
      this.nEdits++;
    },
    decrement() {
      this.nGroups--;
    }
  },
  computed: {
    computedGroups(): any { return this.groups }
  }
});
</script>

<!--
<style lang="scss">
.greeting {font-size: 20px;}
</style>
-->
