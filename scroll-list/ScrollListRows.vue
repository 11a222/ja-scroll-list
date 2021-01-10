<template>
  <ScrollList ref="scrollList"
              :loadMoreTipsShow="true"
              @onRefresh="onRefresh"
              @onLoadMore="onLoadMore"
              v-bind="$attrs"
              v-on="$listeners"
  >
    <template v-for="name in $slots" v-slot:[name]>
      <slot :name="name"/>
    </template>
    <template>
      <div v-for="(item, index) in listData" :key="index">
        <slot :item="item" :index="index"></slot>
      </div>
    </template>
  </ScrollList>
</template>

<script>
  import ScrollList from './ScrollList';
  export default {
    name: "JaScrollListRows",
    props: {
      getList: { // 获取列表的方法（return为promise形式）
        type: Function,
        require: true
      },
      size: { // 分页size
        type: Number,
        default: 20
      },
      listKey: { // 获取列表数据的key 可以为 【body.list】形式
        type: String
      }
    },
    components:{
      ScrollList
    },
    data () {
      return {
        listData: [], // 当前列表数据
        page: 1, // 当前分页
        scrollListRef: null
      }
    },
    mounted () {
      this.scrollListRef = this.$refs.scrollList
      this.scrollListRef.refresh(0); // 0: 刷新成功(无停留), 1: 刷新成功(有停留), 2: 刷新失败(有停留)
    },
    methods: {
      getListData (type) {
        if (type === 'refresh'){
          this.page = 1
        } else if (type === 'more'){
          this.page += 1
        }
        const lastData = this.listData[this.listData.length - 1]
        return this.getList({ page: this.page, size: this.size, lastData: lastData })
                .then(res => {
                  let list = this.listKey === undefined? res: eval('res.' + this.listKey)
                  if (type === 'refresh'){
                    this.listData = list
                  } else if (type === 'more'){
                    this.listData = this.listData.concat(list)
                  }

                  // 已加载所有数据
                  if (list.length < this.size){
                    this.scrollListRef.loadMoreDone(1); // 0: 上拉加载更多, 1: 我是有底线的
                  } else {
                    this.scrollListRef.loadMoreDone(0); // 0: 上拉加载更多, 1: 我是有底线的
                  }
                  return res
                })
      },
      // 下拉刷新
      onRefresh () {
        this.getListData('refresh')
                .then(res => {
                  this.scrollListRef.refreshDone(1); // 0: 刷新成功(无停留), 1: 刷新成功(有停留), 2: 刷新失败(有停留)
                })
                .catch(() => {
                  this.scrollListRef.refreshDone(2); // 0: 刷新成功(无停留), 1: 刷新成功(有停留), 2: 刷新失败(有停留)
                })
      },

      // 上拉加载
      onLoadMore () {
        this.getListData('more')
      }
    },
  }
</script>
