import request from '@/utils/request';

export function getExamListByExamTypeAndSemesterAndReleId(params){
    return request({
        'url': `/user/examination/getExamListByExamTypeAndSemesterAndReleId`,
        'method': 'GET',
        params
    })
}