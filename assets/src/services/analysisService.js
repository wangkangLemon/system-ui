/**
 * Created by huangrui on 2017/4/10.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/com'

class AnalysisService {
    // 导出查询
    getExportList ({
        page,
        company_id,
        page_size,
        status = '',
        time_start = '',
        time_end = ''
    }) {
        let finalUrl = `${urlPre}/${company_id}/export/search`
        return api.get(finalUrl, {page, page_size, status, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 下载接口
    exportDownload ({company_id, job_id, name}) {
        let finalUrl = `${urlPre}/${company_id}/export/${job_id}/download`
        return api.downLoad(finalUrl, {}, `${name}.xls`)
    }
}

export default new AnalysisService()
