import request from '@/utils/request';




//获取课表数据集合
export function getscheduleWorkListByStudentId(params){
    return request({
        'url': `/user/schedule/getscheduleWorkListByStudentId`,
        'method': 'GET',
        params
    })
}
