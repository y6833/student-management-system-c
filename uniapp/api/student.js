import request from '@/utils/request';
//通过id获取学生
export function getStuByRoleId(id) {
    return request({
        'url': `/user/student/getStuByRoleId/${id}`,
        'method': 'GET',
    })
}