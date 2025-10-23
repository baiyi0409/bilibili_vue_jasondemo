<template>
    <el-aside :width="width">
        <el-menu 
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="activeMenu"
        background-color="#545c64"
        text-color="#fff">
            <h3 v-show="!isCollapse">通用后台管理系统</h3>
            <h3 v-show="isCollapse">后台</h3>
            <!-- 没有子菜单 -->
            <el-menu-item
            v-for="item in noChildren" 
            :index="item.path" 
            :key="item.path"
            @click="handleMenu(item)">
                <component :is="item.icon" class="icons" />
                <span>{{ item.label }}</span>
            </el-menu-item>
            <!-- 有子菜单 -->
            <el-sub-menu
            v-for="item in hasChildren" 
            :index="item.path" 
            :key="item.path"
            >
                <template #title>
                    <component :is="item.icon" class="icons" />
                    <span style="margin-left: 10px">{{ item.label }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item v-for="(subItem) in item.children" 
                    :index="subItem.path" 
                    :key="subItem.path"
                    @click="handleMenu(subItem)">
                        <component :is="subItem.icon" class="icons" />
                        <span>{{ subItem.label }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>

<script setup lang="ts">
import { ref,computed } from 'vue';
//@ts-ignore
import { useAllDataStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';
// const list = ref([
//     {
//         path:'/home',
//         name:'home',
//         label:'首页',
//         icon:'house',
//         url:'Home'
//     },
//     {
//         path:'/mall',
//         name:'mall',
//         label:'商品管理',
//         icon:'ShoppingBag',
//         url:'Mall'
//     },
//     {
//         path: '/user',
//         name: 'user',
//         label: '用户管理',
//         icon: 'user',
//         url: 'User'
//     },
//     {
//         path: 'other',
//         label: '其他',
//         icon: 'location',
//         children: [
//             {
//                 path: '/page1',
//                 name: 'page1',
//                 label: '页面1',
//                 icon:'setting',
//                 url:'Page1'
//             },
//             {
//                 path: '/page2',
//                 name: 'page2',
//                 label: '页面2',
//                 icon:'setting',
//                 url:'Page2'
//             }
//         ]
//     }
// ]);

const list = computed(() => store.state.menuList)

const noChildren = computed(()=>list.value.filter(item=>!item.children));
const hasChildren = computed(()=>list.value.filter(item=>item.children));

const store = useAllDataStore();
const isCollapse = computed(()=>store.isCollapse);
const width = computed(()=>store.isCollapse ? '64px' : '180px');

const router = useRouter();
const route = useRoute();
const handleMenu =(item:any)=>{
    router.push(item.path);
    store.selectMenu(item);
}

const activeMenu = computed(() => route.path)

</script>

<style lang="less" scoped>
.icons {
    width: 18px;
    height: 18px;
    margin-right: 5px;
}

.el-menu{
    border-right:none;
    h3{
        line-height: 48px;
        color: #fff;
        text-align: center;
    }
}

.el-aside{
    height: 100vh;
    background-color: #545c64;
}

</style>