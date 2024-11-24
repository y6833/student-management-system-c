import request from '@/utils/request'

// 获取考试详情
export const getExamDetails = (examId, studentId) => {
  return request({
    url: '/exam-detail/get-exam-details',
    method: 'get',
    params: {
      examId,
      studentId
    }
  })
}

// 获取错题详情
export const getWrongQuestions = (examId, studentId) => {
  return request({
    url: '/exam-detail/wrong-questions',
    method: 'get',
    params: {
      examId,
      studentId
    }
  })
}

// 获取进步分析
export const getProgressAnalysis = (examId, studentId) => {
  return request({
    url: '/exam-detail/progress-analysis',
    method: 'get',
    params: {
      examId,
      studentId
    }
  })
}

// 获取班级对比
export const getClassComparison = (examId) => {
  return request({
    url: '/exam-detail/class-comparison',
    method: 'get',
    params: { examId }
  })
}

// 获取学习建议
export const getStudyAdvice = (examId, studentId) => {
  return request({
    url: '/exam-detail/study-advice',
    method: 'get',
    params: {
      examId,
      studentId
    }
  })
}
