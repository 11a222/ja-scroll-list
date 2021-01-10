<template>
  <div class="arrow-box"
       :class="type"
       :style="{fontSize: size, height: size, width: size}">
    <i class="arrow1"></i>
    <i class="arrow2"></i>
    <i class="line"></i>
  </div>
</template>

<script>
  export default {
    name: "Arrow",
    props:{
      type:{
        type: String,
        default: 'top'
      },
      size:{
        type: String,
        default: '18px'
      },
    }
  }
</script>

<style scoped>
  .arrow-box{
    position: relative;
    transition: all 300ms;
  }
  .line{
    height: 0.8em;
    width: 0.11em;
    border-radius: 1em;
    background: #2F86F6;
    position: absolute;
    left: 0.43em;
    top: 0.2em;
  }
  .arrow1, .arrow2{
    position: absolute;
    content: '';
    border-radius: 1em;
    height: 0.6em;
    width: 0.12em;
    background: #2F86F6;
  }
  .arrow1 {
    left: 0.11em;
    transform: rotate(40deg);
    transform-origin: bottom left;
  }
  .arrow2 {
    right: 0.11em;
    transform: rotate(-40deg);
    transform-origin: bottom right;
  }
  .top{
    transform: rotate(0deg);
  }
  .bottom{
    transform: rotate(180deg);
  }
  .right{
    transform: rotate(90deg);
  }
  .left{
    transform: rotate(270deg);
  }
</style>
