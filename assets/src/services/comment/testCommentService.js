import * as api from '../api'
import config from '../../utils/config'

const urlPre = config.apiHost + '/sys/course/comment'

class TestCommentService {
    search({course_name, course_type, user_name, status, time_start, time_end, page, page_size}) {
        let url = `${urlPre}/search`
        return api.get(url, {course_name, course_type, user_name, status, time_start, time_end, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 删除评论
    updateCommentStatus (commentId, status) {
        let url = `${urlPre}/${commentId}`
        return api.put(url, JSON.stringify({status: status})).then((ret) => {
            return ret.data
        })
    }
    batch ({
        comment_id,
        status
    }) {
        let url = `${urlPre}/batch`
        return api.put(url, JSON.stringify({ comment_id, status })).then(ret => {
            xmview.showTip('success', ret.message || `批量${status === 1 ? '驳回' : '通过'}成功`)
        })
    }
}

export default new TestCommentService()
