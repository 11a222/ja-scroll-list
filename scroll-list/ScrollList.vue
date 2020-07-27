<template>
  <div class="ja-scroll-list">
    <div class="ja-scroll-moudle"
         ref="refreshMoudle"
         @scroll="onScroll($event)"
         @touchstart="touchStart($event)"
         @touchmove="touchMove($event)"
         @touchend="touchEnd($event)"
    >
      <div class="ja-refresh-moudle"
           :style="{transform: `translate3d(0, ${top}px, 0)`,
           marginTop: `-${refreshHeight}px`,
           transition: transitionTime,}"
      >
        <div ref="pullRefresh" class="ja-refresh-header" :style="{height: refreshHeight + 'px'}">
          <!--          '1': '下拉刷新',-->
          <!--          '2': '释放刷新',-->
          <!--          '3': '刷新中...',-->
          <!--          '4': '刷新完成',// 无动画-->
          <!--          '5': '刷新成功',// 有收起动画-->
          <!--          '6': '刷新失败',// 有收起动画-->
          <slot :name="`refresh-${dropDownInfo.state}`">
            <div class="ja-pull-refresh">
              <div style="margin-right: 8px;">
                <IconLoadding v-if="dropDownInfo.state == 3"/>
                <div v-if="dropDownInfo.state == 1 || dropDownInfo.state == 2">
                  <IconArrow :type="dropDownInfo.state == 1?'bottom':'top'" />
                </div>
              </div>
              <span>{{dropDownInfo.tips[dropDownInfo.state]}}</span>
            </div>
          </slot>
        </div>
        <div ref="listDom" class="ja-list-content">
          <slot name="default"></slot>
        </div>
        <div ref="jaMoreTip" class="ja-load-more">
          <slot :name="`loadMore-${pullUpInfo.state}`">
            <div v-if="pullUpInfo.show" class="ja-more-tip">
              <!--  1:上拉加载更多, 2:加载中……, 3:我是有底线的-->
              <span>{{pullUpInfo.tips[pullUpInfo.state]}}</span>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import IconLoadding from './IconLoadding';
  import IconArrow from './IconArrow';
  export default {
    name: 'DownPullRefresh',
    components:{IconLoadding, IconArrow},
    props: {
      // onRefresh: {type: Function},// 下拉回调
      // onLoadMore: {type: Function},// 触底回调
      refreshTips:{type: Object, require: false},// 下拉提示文字
      loadMoreTips:{type: Object, require: false},// 上拉提示文字
      refreshOffset:{type: Number, require: false},// 下拉刷新的触发距离
      lodeMoreOffset:{type: Number, require: false, default: 20},// 上拉距离底部的触发距离
    },
    data () {
      return {
        defaultOffset: 70, // 下拉刷新需要的距离
        refreshHeight: 70,// 刷新区域高度
        top: 0,
        scrollIsToTop: 0,// 当前滚动的位置
        startY: 0,
        startTouch: false, // 是否正在拖动
        beforeScrollTop: 0,// 记录上一次滚动的位置

        dropDownInfo: {
          state: 1, // 1:下拉刷新, 2:释放刷新, 3:刷新中..., 4:刷新完成, 5:刷新成功, 6:刷新失败
          isDropDown: false, // 是否下拉
          isRefreshing: false, // 是否正在刷新
          tips:{
            '1': '下拉刷新',
            '2': '释放刷新',
            '3': '刷新中...',
            '4': '刷新完成',// 无动画
            '5': '刷新成功',// 有收起动画
            '6': '刷新失败',// 有收起动画
          }
        },
        pullUpInfo: {
          state: 1, // 1:上拉加载更多, 2:数据加载中., 3:我是有底线的
          show: false,// 是否显示
          isLoading: false, // 是否正在加载
          tips:{
            '1': '上拉加载更多',
            '2': '数据加载中..',
            '3': '我是有底线的!',
          }
        },
      }
    },
    mounted(){
      // 获取不同手机的物理像素（dpr）,以便适配rem
      this.refreshHeight = this.$refs.pullRefresh.children[0].clientHeight || this.refreshHeight;
      this.defaultOffset = this.refreshOffset || this.refreshHeight;// 属性传值 或 刷新区域的高度
      console.log("this.defaultOffset",this.refreshHeight, this.defaultOffset)

      this.initLoadMore();// 判断是否显示加载更多
    },
    computed: {
      // 下拉松开后的动画
      transitionTime(){
        let refreshState = this.dropDownInfo.state;
        if(refreshState == 1 && !this.startTouch){// 手指松开的时候回弹动画
          return 'all 100ms';
        }else if(refreshState == 3 || refreshState == 5 || refreshState == 6 ){// '3': '刷新中...', '5': '刷新成功', '6': '刷新失败',
          return 'all 200ms';
        }else{
          return '';
        }
      },
    },
    methods: {
      // 判断是否显示加载更多
      initLoadMore(){
        let show = this.$refs.listDom.clientHeight > this.$refs.refreshMoudle.clientHeight;
        this.pullUpInfo.show = show;
        show && (this.pullUpInfo.state = 1);// 1:上拉加载更多, 2:数据加载中., 3:我是有底线的
        // console.log("listDom",this.$refs.listDom.clientHeight, this.$refs.refreshMoudle.clientHeight)
      },
      /**
       * 触摸开始，手指点击屏幕时
       * @param {object} e Touch 对象包含的属性
       */
      touchStart (e) {
        this.startTouch = true;// 开始拖动
        let startScrollTop = this.$refs.refreshMoudle.scrollTop;// 开始滚动的位置
        this.startY = e.targetTouches[0].pageY + startScrollTop;
      },
      /**
       * 触摸结束，手指离开屏幕时
       * @param {object} e Touch 对象包含的属性
       */
      touchEnd (e) {
        this.startTouch = false;// 松开手指
        this.pullUpInfo.isLoading = false;// 上拉加载状态
        if (this.dropDownInfo.isDropDown && !this.dropDownInfo.isRefreshing) {
          if (this.dropDownInfo.state == 2) {//下拉刷新状态
            // do refresh
            this.refresh()
            this.dropDownInfo.isRefreshing = true
          } else {
            // cancel refresh
            this.dropDownInfo.isRefreshing = false
            this.dropDownInfo.isDropDown = false
            this.dropDownInfo.state = 1
            this.top = 0
          }
        }else if(this.top <= 10){
          this.top = 0;
        };
      },
      /**
       * 接触点改变，滑动时
       * @param {object} e Touch 对象包含的属性
       */
      touchMove (e) {
        if(this.dropDownInfo.isRefreshing )return;// 刷新中，不执行操作
        // this.scrollIsToTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop // safari 获取scrollTop用window.pageYOffset
        let scrollIsToTop = this.$refs.refreshMoudle.scrollTop;
        this.scrollIsToTop = scrollIsToTop;
        // console.log("this.$refs.refreshMoudle",this.$refs.refreshMoudle)
        if (e.targetTouches[0].pageY >= this.startY) {
          // 下拉
          this.dropDownInfo.isDropDown = true
          if (scrollIsToTop == 0 && !this.dropDownInfo.isRefreshing) {
            let defaultOffset = this.defaultOffset;
            // 拉动的距离
            let diff = e.targetTouches[0].pageY - this.startY;
            if(diff > defaultOffset){// 超过默认高度后，下拉量变为实际的0.25倍
              diff = (diff - defaultOffset) * 0.3 + defaultOffset;
            }
            const top = diff + (this.dropDownInfo.state === 3 ? defaultOffset : 0);//刷新中
            this.top = top;
            if (top >= defaultOffset) {
              this.dropDownInfo.state !=2 && (this.dropDownInfo.state = 2);// 1:下拉可以刷新, 2:松开立即刷新, 3:正在刷新数据中...
            } else {
              this.dropDownInfo.state != 1 && (this.dropDownInfo.state = 1);// 1:下拉可以刷新, 2:松开立即刷新, 3:正在刷新数据中...
            }
          }
          // 去掉会导致ios无法刷新
          e.cancelable && e.preventDefault();// 是否可以取消默认事件 && 取消默认事件
        } else {
          this.dropDownInfo.isDropDown = false
          this.dropDownInfo.state = 1
        }
      },
      // 监听滚动事件
      onScroll(e){
        // console.log("e.scrollTop", e.target.scrollTop);
        this.$emit('onScroll', e)
        let afterScrollTop = e.target.scrollTop,
          delta = afterScrollTop - this.beforeScrollTop;
        if (delta === 0) return false;// 未滚动
        console.log('滚动方向', delta > 0 ? "down" : "up");
        if(delta > 0){// 向下滚动
          this.scrollToTheEnd();
        }else{// 向上滚动

        }
        this.beforeScrollTop = afterScrollTop;
      },
      // 判断滚动条是否到底
      scrollToTheEnd () {
        let innerHeight = this.$refs.listDom.clientHeight + this.$refs.jaMoreTip.clientHeight;//列表总高度
        // console.log('innerHeight',innerHeight,this.$refs.listDom)
        // 变量scrollTop是滚动条滚动时，距离顶部的距离
        let scrollTop = this.$refs.refreshMoudle.scrollTop;// 滚动位置
        // let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        // 变量scrollHeight是滚动条的总高度
        let scrollHeight = this.$refs.refreshMoudle.clientHeight;//列表容器高度
        // let scrollHeight = document.documentElement.clientHeight || document.body.scrollHeight
        // console.log('距底部距离', innerHeight - (scrollTop + scrollHeight))
        // 滚动条到底部的条件
        if (scrollTop + scrollHeight >= innerHeight - this.lodeMoreOffset) {
          // 1:上拉加载更多, 2:数据加载中., 3:我是有底线的
          if (this.pullUpInfo.state !== 2 &&
            this.pullUpInfo.state !== 3 &&
            !this.pullUpInfo.isLoading) {
            // alert(1)
            console.log("已经触底")
            this.pullUpInfo.state = 2
            this.pullUpInfo.isLoading = true
            this.$emit('onLoadMore', this.loadMoreDone)
          }
        }
      },

      // 加载数据完成
      loadMoreDone (state = 0) {
        // 1:上拉加载更多, 2:数据加载中., 3:我是有底线的
        if(state == 0){// 上拉加载更多
          this.pullUpInfo.state = 1
        }else if(state == 1){// 我是有底线的
          this.pullUpInfo.state = 3
        }
      },

      // 刷新
      refresh () {
        this.dropDownInfo.state = 3
        this.top = this.refreshHeight
        this.$emit('onRefresh', this.refreshDone)
      },

      //  刷新完成
      refreshDone (state = 1) {
        //   '1': '下拉刷新',
        //   '2': '释放刷新',
        //   '3': '刷新中...',
        //   '4': '刷新完成',// 无动画
        //   '5': '刷新成功',// 有收起动画
        //   '6': '刷新失败',// 有收起动画
        if(state == 0){// 刷新完成
          this.dropDownInfo.state = 4;
          this.topRetract();// 直接收起
        }else if(state == 1){// 刷新成功
          this.dropDownInfo.state = 5;
          this.topAnimate();// 提示后显示收起动画
        }else if(state == 2){// 刷新失败
          this.dropDownInfo.state = 6;
          this.topAnimate();// 提示后显示收起动画
        }
      },
      // 直接收起
      topRetract(){
        this.dropDownInfo.isRefreshing = false
        this.dropDownInfo.isDropDown = false
        this.top = 0;// 收起刷新
        this.dropDownInfo.state = 1;// 修改状态
        this.$nextTick(()=>{
          this.initLoadMore();// 判断是否显示加载更多
        })
      },
      // 提示后显示收起动画
      topAnimate(){
        this.$refs.refreshMoudle.scrollTo(0,0);
        setTimeout(()=>{// 显示刷新成功800ms
          this.top = 0;// 收起刷新
          setTimeout(()=>{
            this.dropDownInfo.isRefreshing = false
            this.dropDownInfo.isDropDown = false
            this.dropDownInfo.state = 1;// 收起动画结束后再改状态
            this.$nextTick(()=>{
              this.initLoadMore();// 判断是否显示加载更多
            })
          }, 300)
        }, 800)
      },
    },
    watch: {
      'dropDownInfo.state'(val) {// 下拉状态改变
        this.$emit('onRefreshState', val)
      },
      'pullUpInfo.state'(val) {// 上拉状态改变
        this.$emit('onLoadMoreState', val)
      },
      'refreshTips'(val){// 下拉提示文字 - props改变后更新
        let tips = {...this.dropDownInfo.tips, ...val};
        this.dropDownInfo.tips = tips;
      },
      'loadMoreTips'(val){// 上拉提示文字 - props改变后更新
        let tips = {...this.pullUpInfo.tips, ...val};
        this.pullUpInfo.tips = tips;
      },
    },
  }
</script>

<style scoped>
  .ja-scroll-list{
    height: 100%;
    overflow: hidden;
  }
  .ja-scroll-moudle{
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .ja-refresh-moudle {
    width: 100%;
    height: 100%;
    margin-top: -100px;
    -webkit-overflow-scrolling: touch; /* ios5+ */
    transition: all 0ms;
  }

  .ja-refresh-moudle .ja-pull-refresh,
  .ja-refresh-moudle .ja-more-tip{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70px;
    width: 100%;
    color: #a9a9a9;
    transition-duration: 200ms;
    font-size: 14px;
  }
</style>
