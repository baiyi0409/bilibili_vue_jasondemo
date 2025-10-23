<template>
    <div class="tags">
        <el-tag v-for="(tag,index) in tags" 
        :key="tag.name"
        :closable="tag.name != 'home'"
        :effect="route.name === tag.name ? 'dark':'plain'"
        @click="handleMenu(tag)"
        @close="handleClose(tag,index)"
        >
        {{tag.label}}
        </el-tag>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute,useRouter } from 'vue-router';
//拿到pinia中的数据
//@ts-ignore
import { useAllDataStore } from '@/stores'
const store = useAllDataStore();
const tags = computed(() => store.state.tags)

const route = useRoute();
const router = useRouter();
const handleMenu = (tag:any)=>{
    router.push(tag.name);
    store.selectMenu(tag)
}

const handleClose = (tag:any,index:any) =>{
    store.updateTags(tag)
    // 如果点击的关闭的是最后一个标签
    if (tag.name !== route.name) 
        return
    
    if (index === store.state.tags.length) {
        // store.selectMenu(tags.value[index - 1])
        router.push(tags.value[index - 1].name)
    }
    else {
        // 跳转到当前自己的索引下
        // store.selectMenu(tags.value[index])
        router.push(tags.value[index].name)
    }
}

</script>

<style scoped lang="less">
.tags{
    margin: 20px 0 0 20px;
}
.el-tag{
    margin-right: 10px;
}
</style>