import request from '@/utils/request';


export function getSubRank(params){
    return request({
        'url': '/user/score/getSubRank',
        'method': 'GET',
        params
    })
}

export function getProposal(params){
    return request({
        'url': '/user/score/getProposal',
        'method': 'GET',
        params
    })
}