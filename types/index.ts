export = index;
declare function index(arr: any, iter: any, context: any): any;


declare module "vue/types/vue" {
    interface Vue {
      $worker: any;
    }
  }
