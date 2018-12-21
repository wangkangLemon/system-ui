
import * as api from '../api'
import config from '../../utils/config'

const urlPre = config.apiHost

class TestSpecialService {
    search({company_id, store_id, status, page, page_size}) {
        let url = `${urlPre}/sys/finance/pricing/company/search`
        return api.get(url, {company_id, store_id, status, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 新建模板
    create ({company_id, store_id, deadline, industry_course_price, speaking_price, lucky_money_price}) {
        let url = `${urlPre}/sys/finance/pricing/company`
        industry_course_price = industry_course_price * 100
        speaking_price = speaking_price * 100
        lucky_money_price = lucky_money_price * 100
        return api.post(url, JSON.stringify({company_id, store_id, deadline, industry_course_price, speaking_price, lucky_money_price})).then((ret) => {
            return ret.data
        })
    }
    // 更新模板
    update (id, {company_id, store_id, deadline, industry_course_price, speaking_price, lucky_money_price}) {
        let url = `${urlPre}/sys/finance/pricing/company/${id}`
        industry_course_price = industry_course_price * 100
        speaking_price = speaking_price * 100
        lucky_money_price = lucky_money_price * 100
        return api.put(url, JSON.stringify({company_id, store_id, deadline, industry_course_price, speaking_price, lucky_money_price})).then((ret) => {
            return ret.data
        })
    }
    // 删除模板
    delete (id) {
        let url = `${urlPre}/sys/finance/pricing/company/${id}`
        return api.del(url).then((ret) => {
            return ret.data
        })
    }
    // 获取数据
    getSpecialById (id) {
        let url = `${urlPre}/sys/finance/pricing/company/${id}`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }
}

export default new TestSpecialService()
