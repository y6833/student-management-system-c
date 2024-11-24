
import request from '@/utils/request';

//修改用户
export function updataUser(data) {
    return request({
        'url': '/user/user/updataUser',
        'method': 'POST',
        data
    })
}