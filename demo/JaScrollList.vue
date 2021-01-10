<template>
  <ScrollList class="scroll-list"
              ref="scrollList"
              @onRefresh="onRefresh"
              @onLoadMore="onLoadMore"
              @onRefreshState="onRefreshState"
              @onLoadMoreState="onLoadMoreState">
      <!--    <div slot="refresh-1" class="ja-pull-refresh">-->
      <!--      <span>下拉可以刷新</span>-->
      <!--    </div>-->
    <div class="bank-box">
      <div class="bank-list" v-for="item in listData" :key="item.id">
        <div class="bank-icon"></div>
        <span class="bank-name">{{item}}</span>
      </div>
    </div>
      <!--    <div slot="loadMore-2" class="ja-more-tip">-->
      <!--      <span>我在加载中</span>-->
      <!--    </div>-->
  </ScrollList>
</template>

<script>
  import { ScrollList } from './ScrollList'
  export default {
    components:{ScrollList},
    data () {
      return {
        listData: [],
      }
    },
    mounted () {
      this.$refs.scrollList.refresh();// 主动触发下拉刷新
    },
    methods: {
      // 下拉刷新
      onRefresh () {
        console.log('下拉刷新')
        // 这是全是静态数据,延时1600毫秒，给用户一个刷新的感觉，如果是接口数据的话，直接调接口即可
        setTimeout(() => {
          this.listData = ['招商银行', '民生银行', '平安联名', '兴业银行', '上海银行', '交通银行', '光大银行', '全部银行'];
          this.$refs.scrollList.refreshDone(1, '刷新成功啦');// 0: 刷新完成, 1: 刷新成功, 2: 刷新失败
        }, 1600)
      },

      // 上拉加载
      onLoadMore () {
        // 这是全是静态数据,延时1600毫秒，给用户一个刷新的感觉，如果是接口数据的话，直接调接口即可
        setTimeout(() => {
          this.listData = [...this.listData, ...this.listData];
          if(this.listData.length > 20){
            this.$refs.scrollList.loadMoreDone(1, '-- 我是有底线的呀 --');// 0: 上拉加载更多, 1: 我是有底线的
          }else{
            this.$refs.scrollList.loadMoreDone(0);// 0: 上拉加载更多, 1: 我是有底线的
          }
        }, 1000)
      },
      // 下拉状态改变
      onRefreshState(state){
        console.log("onRefreshState", state)
      },
      // 上拉状态改变
      onLoadMoreState(state){
        console.log("onLoadMoreState", state)
      },
    },
  }
</script>

<style scoped>
  .scroll-list {
    height: 100%;
  }

  .bank-box {
    display: flex;
    flex-wrap: wrap;
    padding: 2px 7px 42px 7px;
    background-color: #fff;
  }

  .bank-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 98px;
    margin: 40px 42px 0 42px;
  }

  .bank-icon {
    width: 56px;
    height: 56px;
    margin: 0 22px 18px;
  }

  .bank-name {
    display: flex;
    align-items: center;
    width: 110px;
    height: 24px;
    line-height: 24px;
    font-size: 24px;
    color: #333;
  }
</style>
