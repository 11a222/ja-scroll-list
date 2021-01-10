<template>
  <div class="page">
    <PageHeader></PageHeader>
    <ScrollListRows class="scroll-list"
                    ref="scrollList"
                    listKey="body"
                    vueKey="id"
                    :size="20"
                    :autoRefresh="false"
                    :getList="getList">
      <div slot="refresh-1" class="ja-pull-refresh">
        <span>下拉可以刷新</span>
      </div>
      <div slot-scope="{ item }" class="bank-box">
        <div class="bank-list">
          <div class="bank-icon"></div>
          <span class="bank-name">{{item}}</span>
        </div>
      </div>
      <div slot="loadMore-2" class="ja-more-tip">
        <span>我在加载中</span>
      </div>
    </ScrollListRows>
  </div>
</template>

<script>
  import PageHeader from '@/components/common/PageHeader';
  import { ScrollListRows } from 'ja-scroll-list';
  console.log('ScrollListRows', ScrollListRows)
  export default {
    name: "JaScrollList",
    components:{
      PageHeader,
      ScrollListRows
    },
    data () {
      return {}
    },
    mounted() {
      this.$refs.scrollList.refresh();// 主动触发下拉刷新
    },
    methods: {
      getList (parm) {
        console.log('parm', parm)
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const listData = ['招商银行', '民生银行', '平安联名', '兴业银行', '上海银行', '交通银行', '光大银行', '全部银行'];
            resolve({
              body: listData
            })
          }, 1600)
        })
      }
    },
  }
</script>

<style scoped>
  .page{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
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
