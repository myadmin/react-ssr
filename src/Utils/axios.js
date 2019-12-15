import axios from 'axios';

const baseUrl = 'http://localhost:9093'
const Axios = axios.create({
    baseUrl,
    timeout: 3000,
});

Axios.interceptors.request.use(config => {
    config.headers = Object.assign(config.method === 'get' ? {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
    } : {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }, config.headers);

    if (config.method === 'get') {
        const contentType = config.headers['Content-Type'];
        if (contentType) {
            if (contentType.includes('multipart')) { // 类型 'multipart/form-data;'
                // config.data = data;
            } else if (contentType.includes('json')) { // 类型 'application/json;'
                // 服务器收到的raw body(原始数据) "{name:"nowThen",age:"18"}"（普通字符串）
                config.data = JSON.stringify(config.data);
            } else { // 类型 'application/x-www-form-urlencoded;'
                // 服务器收到的raw body(原始数据) name=nowThen&age=18
                config.data = Qs.stringify(config.data);
            }
        }
    }
    console.log('config', config);
    return Promise.resolve(config);
}, error => {
    return Promise.reject(error);
});

export default Axios;