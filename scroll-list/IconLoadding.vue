<template>
  <div class="loadding-box" :style="{fontSize: size}">
    <div class="loader" :style="{borderLeftColor: color}"></div>
  </div>
</template>

<script>
  export default {
    name: "loadding",
    props:{
      size: {
        type: String,
        default: '18px',

      },
      color: {
        type: String,
        default: '#2F86F6'
      }
    },
    data() {
      return {}
    },
  }
</script>

<style scoped>
  .loadding-box .loader {
    position: relative;
    /*text-indent: -9999em;*/
    border: 0.1em solid;
    border-color:  rgba(255, 255, 255, 0.3);
    -webkit-animation: load 600ms infinite linear;
    animation: load 600ms infinite linear;
  }
  .loadding-box .loader,
  .loadding-box .loader:after {
    border-radius: 50%;
    width: 1em;
    height: 1em;
  }
  @keyframes load {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
