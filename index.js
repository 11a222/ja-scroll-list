import ScrollList from './scroll-list/ScrollList';
// Vue.js 的插件应当有一个公开方法 install 。第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象
ScrollList.install = Vue => Vue.component(ScrollList.name, ScrollList);//注册组件
export default ScrollList;
