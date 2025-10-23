import { createApp } from 'vue';
import App from './App.vue';
// 引入全局样式
import '@/assets/less/index.less';
//引入路由
//@ts-ignore
import router from './router';
//引入element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入pinia
import { createPinia } from 'pinia';
const pinia = createPinia();
//引入mockjs
//@ts-ignore
import '@/api/mock.js';
//全局挂载api request
//@ts-ignore
import api from '@/api/api';
//@ts-ignore
import {useAllDataStore} from '@/stores';

function isRoute(to:any){
    let res = router.getRoutes();
    let resFil = res.filter((item:any) => item.path === to.path);
    return resFil.length > 0;
}

//使用路由守卫
router.beforeEach((to:any,from:any,) => {
    // to: 即将进入的路由
    // from: 当前离开的路由
    // next: 必须调用，否则页面卡住！
    if(to.path !== '/login' && !store.state.token){
        return {
            name:'login'
        }
    }
    if(!isRoute(to)){
        return {
            name:'404'
        }
    }
});

const app = createApp(App);
//app.use(ElementPlus);
app.use(ElementPlus,
{
    locale: zhCn //国际化配置
});
app.use(pinia);
const store = useAllDataStore();
store.addMenu(router,'refresh');
app.use(router);

app.config.globalProperties.$api = api;

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
