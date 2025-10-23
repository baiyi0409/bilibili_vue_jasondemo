<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input placeholder="请输入用户名" v-model="formInline.keyword">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-dialog v-model="dialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="35%"
            :before-close="handleClose">
            <!--需要注意的是设置了:inline="true"，
                会对el-select的样式造成影响，我们通过给他设置一个class=select-
		        在css进行处理-->
            <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="formUser.name" placeholder="请输入姓名" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="年龄" prop="age">
                            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <!-- 使用:inline="true"会对select造成影响，此时长度应该设置最大 -->
                        <el-form-item label="性别" prop="sex" style="width: 80%;">
                            <el-select v-model="formUser.sex" placeholder="请选择" class="select-clean">
                                <el-option label="男" :value="1" />
                                <!-- 注意这里的 :value 表示绑定一个表达式即所谓的"1" 其实代表的是number类型1 -->
                                <el-option label="女" :value="0" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">

                        <el-form-item label="出生日期" prop="birth">
                            <el-date-picker v-model="formUser.birth" type="date" placeholder="请输入"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="地址" prop="addr">
                        <el-input v-model="formUser.addr" placeholder="请输入地址" />
                    </el-form-item>
                </el-row>
                <el-row style="justify-content: flex-end">
                    <el-form-item>
                        <el-button type="primary" @click="handleCancel">取消</el-button>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column v-for="item in tableLabel" :key="item.prop" :prop="item.prop" :label="item.label"
                :width="item.width" />
            <el-table-column fixed="right" label="操作" min-width="120">
                <template #="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                        编辑
                    </el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layiout="prev,pager,next" size="small" class="pager" :total="config.total"
            @current-change="handleChange">
        </el-pagination>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted,nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';

//@ts-ignore
const { proxy } = getCurrentInstance();
const tableLabel = reactive([
    {
        prop: "name",
        label: "姓名",
    },
    {
        prop: "age",
        label: "年龄",
    },
    {
        prop: "sex",
        label: "性别",
    },
    {
        prop: "birth",
        label: "出生日期",
        width: 200,
    },
    {
        prop: "addr",
        label: "地址",
        width: 400,
    },
])
const tableData = ref([] as any[]);
const formInline = reactive({
    keyword: '',
})

const config = reactive({
    name: '',
    total: 0,
    page: 1
})

const handleSearch = () => {
    config.name = formInline.keyword
    getUserData(config);
}

const getUserData = async (query?: any) => {
    const data = await proxy.$api.getUserData(query);
    //数据加工
    tableData.value = data.list.map((item: any) => {
        return {
            ...item,
            sex: item.sex === '1' ? '女' : '男'
        }
    });
    config.total = data.count;
}

const handleChange = (page: any) => {
    config.page = page
    getUserData(config);
}

const handleDelete = (row: any) => {
    ElMessageBox.confirm("你确定要删除吗?").then(async () => {
        await proxy.$api.deleteUser({ id: row.id });
        ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success'
        })
        getUserData()
    })
}

const action = ref('add')
const dialogVisible = ref(false)
const formUser = reactive({
    sex:1
})
//表单校验规则
const rules = reactive({
    name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
    age: [
        { required: true, message: "年龄是必填项", trigger: "blur" },
        { type: "number", message: "年龄必须是数字" },
    ],
    sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
    birth: [{ required: true, message: "出生日期是必选项" }],
    addr: [{ required: true, message: '地址是必填项' }]
})

const handleAdd = () => {
    action.value = "add";
    //打开对话窗
    dialogVisible.value = true;
}

const handleClose = () => {
    dialogVisible.value = false;
    proxy.$refs['userForm'].resetFields();
}

const handleCancel = () => {
    dialogVisible.value = false;
    proxy.$refs['userForm'].resetFields();
}

//日期处理
const timeFormat = (time:Date) =>{
    var time = new Date(time);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    function add(m:any) {
        return m < 10 ? "0" + m : m;
    }
    return year + "-" + add(month) + "-" + add(date);
}

const onSubmit = async() => {
    //先校验
    proxy.$refs['userForm'].validate(async (vaild:any) => {
        //校验
        if(vaild){
            let res = null;
            //这里无论是新增或者是编辑，我们都要对这个日期进行一个格式化
            //如果不是1997-01-02这种格式，使用timeFormat方法进行格式化
            formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth)
                ? formUser.birth
                : timeFormat(formUser.birth)
            //新增
            if(action.value === 'add'){
                res = await proxy.$api.addUser(formUser)
            }
            //编辑
            else
            {
                res = await proxy.$api.editUser(formUser)
            }

            if(res){
                dialogVisible.value = false;
                proxy.$refs['userForm'].resetFields();
                getUserData();
            }

        }else{
            ElMessage({
                showClose:true,
                message:'请输入正确的内容',
                type:'error'
            })
        }
    })
}

const handleEdit = (val:any) =>{
    action.value = 'edit';
    dialogVisible.value = true;
    //字符串转化
    //对象更新赋值操作
    //等价于
    // formUser.id = val.id;
    // formUser.name = val.name;
    // formUser.sex = '1';
    nextTick(()=>{
        Object.assign(formUser,{...val,sex:''+val.sex})
    })
}

onMounted(() => {
    getUserData()
})
</script>

<style scoped lang="less">
.user-header {
    display: flex;
    justify-content: space-between;
}

.table {
    position: relative;
    height: 520px;

    .el-table {
        width: 100%;
        height: 500px;
    }

    .pager {
        position: absolute;
        right: 10px;
        bottom: 30px;
    }
}

.select-clearn {
    display: flex;
}
</style>