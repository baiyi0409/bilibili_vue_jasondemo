/**
 * 整个项目api的统一管理
 */
// 导入request 进行axios请求
import request from './request';

//请求首页左侧表格的数据
export default {
    getTableData() {
        return request({
            url: "/home/getTableData",
            method: "get",
            mock:false
        })
    },
    getCountData() {
        return request({
            url:"/home/getCountData",
            method:"get",
        })
    },
    getChartData() {
        return request({
            url: "/home/getChartData",
            method:"get",
        })
    },
    getUserData(data) {
        return request({
            url:"user/getUserData",
            method:"get",
            data,
        })
    },
    deleteUser(data){
        return request({
            url:"/user/deleteUser",
            method:"get",
            data
        })
    },
    addUser(params) {
        return request({
            url: '/user/addUser',
            method: 'post',
            data: params
        })
    },
    editUser(data){
        return request({
            url:"/user/editUser",
            method:"post",
            data,
        })
    },
    getMenu(params){
        return request({
            url:"/permission/getMenu",
            method:"post",
            data:params
        })
    }
}
