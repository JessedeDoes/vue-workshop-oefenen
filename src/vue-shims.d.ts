// src/vue-shims.d.ts

declare module 'ol';
declare module 'vuelayers';

declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}
