<template>
    <div class="header">
        <div class="l-content">
            <el-button size="small" @click="handleCollapse">
                <component class="icons" is="menu" />
            </el-button>
            <el-breadcrumb separator="/" class="bread">
                <el-breadcrumb-item :to="{ path:'/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-if="current" :to="current.path">{{current.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="r-content">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img src="@/assets/images/user.png" 
                    alt="" 
                    class="user">
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item @click="handleLoginOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref,computed} from 'vue';
//@ts-ignore
import { useAllDataStore } from '@/stores';
import {useRouter} from 'vue-router';

const getImageUrl = (user:any) => {
    return new URL(`@/assets/images/${user}.jpg`, import.meta.url).href;
};

const store = useAllDataStore();
const handleCollapse= () =>{
    store.isCollapse = !store.isCollapse;
};

const router = useRouter();
const handleLoginOut =() =>{
    store.clean();
    //跳转到登录界面
    router.push('/login')
}

const current = computed(() => store.state.currentMenu)
</script>

<style scoped lang="less">
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #333;
}

.icons{
    width: 20px;
    height: 20px;
}

.l-content{
    display: flex;
    align-items: center;
    .el-button{
        margin-right: 20px;
    }
}

.r-content{
    .user{
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
}

.bread {
  :deep(.el-breadcrumb__inner) {
    color: #fff !important;
  }
  :deep(.el-breadcrumb__separator) {
    color: #fff;
  }
}
 
</style>