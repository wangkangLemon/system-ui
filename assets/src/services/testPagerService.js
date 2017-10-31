/**
 * 试卷管理
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017-10-31
 * Time: ${TIME}
 */

class TestPagerService {
    search({keyword, status, time_start, time_end, page, page_size}){
        let url = `${urlPre}/testbank/group/search`
        return api.get(url, { page, page_size, keyword, company_id, file_type, time_start, time_end }).then((ret) => {
            return ret.data
        })
    }
}


export default new TestPagerService()