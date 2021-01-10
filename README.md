## 功能介绍

## 安装
~~~
npm install ja-scroll-list --save
~~~
##版本更新
>1.1.0 新增 ScrollListRows 组件


## 引入
~~~
import { ScrollList, ScrollListRows } from 'ja-scroll-list';
~~~

## 快速使用
~~~
import { ScrollList } from 'ja-scroll-list';// 引入ja-scroll-list
<ScrollList ref="scrollList" @onRefresh="onRefresh" @onLoadMore="onLoadMore">
   <div class="bank-list" v-for="item in 20">
      <span class="bank-name">{{item}}</span>
   </div>
</ScrollList>
~~~
## demo
~~~
<template>
  <ScrollList 
        class="scroll-list"
        ref="scrollList"
        @onRefresh="onRefresh"
        @onLoadMore="onLoadMore"
  >
    <div class="bank-list" v-for="(item, index) in listData" :key="index">
      <span class="bank-name">{{item}}</span>
    </div>
  </ScrollList>
</template>

<script>
  import ScrollList from 'ja-scroll-list';// 引入ja-scroll-list
  export default {
    name: "JaScrollList",
    components:{
      ScrollList
    },
    data () {
      return {
        listData: [],
      }
    },
    mounted() {
      this.$refs.scrollList.refresh();// 主动触发下拉刷新
    },
    methods: {
      // 下拉刷新
      onRefresh () {
        console.log('下拉刷新')
        // 这是全是静态数据,延时1600毫秒，给用户一个刷新的感觉，如果是接口数据的话，直接调接口即可
        setTimeout(() => {
          this.listData = ['招商银行', '民生银行', '平安联名', '兴业银行', '上海银行', '交通银行', '光大银行', '全部银行'];
          this.$refs.scrollList.refreshDone(1);// 0: 刷新完成, 1: 刷新成功, 2: 刷新失败
        }, 1600)
      },

      // 上拉加载
      onLoadMore () {
        // 这是全是静态数据,延时1600毫秒，给用户一个刷新的感觉，如果是接口数据的话，直接调接口即可
        setTimeout(() => {
          this.listData = [...this.listData, ...this.listData];
          if(this.listData.length > 20){
            this.$refs.scrollList.loadMoreDone(1);// 0: 上拉加载更多, 1: 我是有底线的
          }else{
            this.$refs.scrollList.loadMoreDone(0);// 0: 上拉加载更多, 1: 我是有底线的
          }
        }, 1000)
      },
    },
  }
</script>

<style scoped>
  .scroll-list {
    height: 100%;
  }
  .bank-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100px;
    margin: 20px 0px;
    font-size: 24px;
  }
</style>

~~~


## 配置说明
| 参数   | 类型   | 默认  | 描述        |
| -------| ------ |  ------- | ---------|
| onRefresh| Function | | 下拉刷新回调|
| onLoadMore| Function | 返回{refreshDone:function, loadMoreDone: functon} | 上拉加载更多回调|
| onScroll| Function | 返回{refreshDone:function, loadMoreDone: functon} |  | 列表滚动事件回调(返回列表对象dom)|
| onRefreshState| Function |  | 下拉刷新控件状态改变回调|
| onLoadMoreState| Function |  | 上拉加载更多控件状态改变回调|


## API说明
| 参数   | 类型   | 参数1  | 参数2  | 描述        |
| -------| ------ |   ------- |  ------- | ---------|
| refresh| Function() | 无 |  无 | 主动触发下拉刷新|
| refreshDone| Function(state, tip) | state: 0: 刷新完成, 1: 刷新成功, 2: 刷新失败 | tip: '自定义' | 关闭下拉刷新|
| loadMoreDone| Function(state, tip) | state: 0: 上拉加载更多, 1: 我是有底线的 | tip: '自定义'  | 下拉刷新控件状态改变回调|

## 下拉刷新 -- 插槽说明
~~~
  <div slot="refresh-1">
    <span>下拉刷新</span>
  </div>
  <div slot="refresh-2">
    <span>释放刷新</span>
  </div>
  <div slot="refresh-3">
    <span>刷新中...</span>
  </div>
  <div slot="refresh-4">
    <span>刷新完成(无停留)</span>
  </div>
  <div slot="refresh-5">
    <span>刷新成功(有停留)</span>
  </div>
  <div slot="refresh-5">
    <span>刷新失败(有停留)</span>
  </div>
~~~

## 上拉加载更多 -- 插槽说明
~~~
  <div slot="loadMore-1">
    <span>上拉加载更多</span>
  </div>
  <div slot="loadMore-2">
    <span>数据加载中..</span>
  </div>
  <div slot="loadMore-3">
    <span>我是有底线的!</span>
  </div>
~~~
