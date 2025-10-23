import {defineStore} from 'pinia'
import {ref,watch} from 'vue'

function initState(){
    return {
        isCollapse: false,
        tags:[
            {
                path:'/home',
                name:'home',
                label:'首页',
                icon:'home'
            },
        ],
        currentMenu:null,
        menuList:[],
        token:'',
        routerList:[]
    }

}

export const useAllDataStore = defineStore('allData',()=>{
    //ref state
    //computed getters
    //function actions
    const state = ref(initState())

    // 进行数据持久化
    watch(state, newObj => {
        //不存在token，也就是没登录过
        if (!newObj.token) return
        localStorage.setItem('store', JSON.stringify(newObj))
    }, {
        deep: true,
    })
    
    function selectMenu(val){
        if (val.name === 'home') {
            state.value.currentMenu = null;
        }else{
            state.value.currentMenu = val;
            let index = state.value.tags.findIndex(item => item.name === val.name);
            index === -1 ? state.value.tags.push(val) : "";
        }
    }

    function updateTags(tag){
        let index = state.value.tags.findIndex(item => item.name == tag.name)
        state.value.tags.splice(index, 1);
    }

    function updateMenuList(val){
        state.value.menuList = val;
    }

    function addMenu(router,type){
        if(type === 'refresh'){
            if(JSON.parse(localStorage.getItem('store'))){
                state.value = JSON.parse(localStorage.getItem('store'))
                state.value.routerList = [];
            }else{
                return;
            }
        }
        
        const menu = state.value.menuList;
        const module = import.meta.glob(`../views/**/*.vue`);
        const routeArr = [];
        console.log("module", module);
        console.log("menu", menu);
        menu.forEach(item => {
            if(item.children){
                item.children.forEach(val =>{
                    let url = `../views/${val.url}.vue`;
                    val.component = module[url];
                    routeArr.push(val);
                })
            }else{
                let url = `../views/${item.url}.vue`;
                item.component = module[url];
                routeArr.push(item);
            }
        })

        //相当于重置路由
        //其实应该使用赋值的方式，而不是对数组进行处理操作
        state.value.routerList = [];
        let routers = router.getRoutes();
        routers.forEach(item => {
            //默认的路由无需处理
            if(item.name == 'main' || item.name == 'login' || item.name == '404'){
                return;
            }else{
                router.removeRoute(item.name)
            }
        });

        routeArr.forEach(item =>{
            state.value.routerList.push(router.addRoute("main",item));
        })
        console.log("state.value.routerList", state.value.routerList);
        console.log("state.value.routeArr", routeArr);
    }

    function clean(){
        state.value.routerList.forEach((item)=>{
            //打印出来里面具有一个方法removeRoute，这里是执行这个方法
            if (item) item();
        });
        state.value = initState();
        localStorage.removeItem('store')
    }

    return{
        state,
        selectMenu,
        updateTags,
        updateMenuList,
        addMenu,
        clean
    };
})