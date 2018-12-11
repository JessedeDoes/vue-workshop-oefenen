<!-- src/components/EditGrouping.vue -->

<template>
  <div>
    <div>{{JSON.stringify(this.terms)}}</div>
    <div>{{JSON.stringify(this.grouping}}</div> 
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import axios from "axios"
import * as L from "leaflet"

export default Vue.extend({
    props: ["terms"],
    data() {
      return {
        grouping: {"1" : terms }
      };
    },
    methods: {
       
    },
    computed: {
    }
  }
});
</script>

<!--
<style lang="scss">
.greeting {font-size: 20px;}
</style>
-->
