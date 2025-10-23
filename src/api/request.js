import axios from "axios";
import { ElMessage } from 'element-plus';
import config from '@/config'

const service = axios.create({
    baseURL: config.baseApi,
    timeout: 5000
})


// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应(请求之后)拦截器
service.interceptors.response.use(
    (res) => {
        //console.log('✅ 原始响应:', res);
        //console.log('✅ res.data:', res.data)
        const { code, data, msg } = res.data;
        if (code === 200) {
            console.log("请求成功，数据为：", data);
            return data;
        } else {
            const NETWORK_ERROR = '网络请求错误'
            ElMessage.error(msg || NETWORK_ERROR);
            return Promise.reject(msg || NETWORK_ERROR)
        }
    }
);

function request(options){
    options.method = options.method || "get";
    //get和post都传data的设置
    if(options.method.toLowerCase() === 'get'){
        options.params = options.data;
    }
    //mock数据开关设置
    let isMock = config.mock;
    if(typeof options.mock !== 'undefined'){
        isMock = options.mock;
    }
    //针对环境的处理
    if(config.env === 'prod'){
        service.defaults.baseURL = config.baseApi;
    }else{
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
    }
    return service(options);
}

export default request;