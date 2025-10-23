import Mock from 'mockjs';
import homeApi from './mockData/home'
import userApi from './mockData/user'
import menuApi from './mockData/permission'
//使用流程
//1.在对应的mockData中定义请求数据，例如home.js
//2.在mock.js中引入,并进行mock配置，例如Mock.mock("/api/home/getTableData","get",homeApi.getTableData);
//3.在api.js中进行方法定义，因为已经把api.js中的方法进行了暴露，实际上api.js中的方法就是请求接口，本质就是接口和方法的对应
//4.在对应的组件中获取api，并使用暴露的方法获取数据

Mock.mock("/api/home/getTableData","get",homeApi.getTableData);
Mock.mock("/api/home/getCountData","get",homeApi.getCountData);
Mock.mock("/api/home/getChartData","get",homeApi.getChartData);

//因为使用的是get方法，并传递了参数，需要用正则表达式进行匹配
//简单理解为GET /api/user/getUserData?name=xxx
//user.js里面是getUserList
Mock.mock(RegExp('^/api/user/getUserData(\\?.*)?$'),"get",userApi.getUserList); 
Mock.mock(RegExp('^/api/user/deleteUser(\\?.*)?$'),"get",userApi.deleteUser); 
Mock.mock('/api/user/addUser',"post",userApi.createUser); 
Mock.mock('/api/user/editUser',"post",userApi.updateUser); 

Mock.mock('/api/permission/getMenu', "post", menuApi.getMenu);