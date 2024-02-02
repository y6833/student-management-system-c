import request from '@/utils/request';

//登录
export function loginInfo(data) {
    return request({
        'url': '/user/user/login',
        'method': 'POST',
        data
    })
}