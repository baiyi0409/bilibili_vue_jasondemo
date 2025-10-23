import { createRouter,createWebHashHistory } from "vue-router";
//路由规则
const routes = [
    {
        path:'/',
        name:'main',
        component:()=>import('@/views/Main.vue'),
        redirect:'/home',
        children:[]
        // children: [
        //     {
        //         path:'home',
        //         name:'home',
        //         component:()=>import('@/views/Home.vue'),
        //     },
        //     {
        //         path:'user',
        //         name:'user',
        //         component:()=>import('@/views/User.vue'),
        //     },
        //     {
        //         path:'mall',
        //         name:'mall',
        //         component:()=>import('@/views/Mall.vue'),
        //     },
        // ]
    },
    {
        path:'/login',
        name:'login',
        component:()=>import('@/views/Login.vue'),
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404.vue')
    }
]

//配置路由
const router = createRouter(
    {
        //设置路由模式
        history:createWebHashHistory(),
        routes
    }
);

//向外暴露
export default router;