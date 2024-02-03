import request from '@/utils/request';
//通过id获取学生
export function getStuByRoleId(id) {
    return request({
        'url': `/user/student/getStuByRoleId/${id}`,
        'method': 'GET',
    })
}

//修改学生
export function updatastudent(data) {
    return request({
        'url': '/user/student/updata',
        'method': 'POST',
        data
    })
}