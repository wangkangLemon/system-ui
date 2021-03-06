/**
 * Created by huanghuixin on 2017/3/30.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/sales'

class SalesService {
    // 获取总览信息
    getAmount () {
        return api.get(urlPre, {}, false).then((ret) => {
            return ret.data
        })
    }

    // 工业分析数据
    // today为今日，yesterday为昨日，week为本周，month为本月
    getIndustryAnalysis ({type}) {
        let finalUrl = urlPre + '/stat/ent/search'
        return api.get(finalUrl, {type}, false).then((ret) => {
            return ret.data
        })
    }

    // 药品分析 type如上
    getDrugAnalysis ({type}) {
        let finalUrl = urlPre + '/stat/product/search'
        return api.get(finalUrl, {type}, false).then((ret) => {
            return ret.data
        })
    }

    /* eslint-disable camelcase  */
    // 获取药品列表
    getProductList ({enterprise_id = '', time_start = '', time_end = '', keyword = '', deleted = '', start = 1, length = 15}) {
        let finalUrl = urlPre + '/product/search'
        return api.get(finalUrl, {
            enterprise_id, // 工业id
            time_start, // 开始时间
            time_end, // 结束时间
            deleted, // 删除状态  0为正常，1已删除，不赋值则表示未选择
            keyword, // 药品名称
            start, // 第几页
            length // 每页显示大小
        }, false).then((ret) => {
            return ret.data
        })
    }

    // 获取流水记录
    getHistory ({enterprise_id = '', product_id = '', time_start = '', time_end = '', status = '', username = '', start = 1, length = 15}) {
        let finalUrl = urlPre + '/history/search'
        return api.get(finalUrl, {
            enterprise_id, // 工业id
            product_id, // 药品id
            time_start, // 开始时间
            time_end, // 结束时间
            status, //  支付状态 0为待确认，1为待支付，2为已完成，3为已关闭，不赋值则表示未选择
            username, // 姓名
            start, // 第几页
            length // 每页显示大小
        }).then((ret) => {
            return ret.data
        })
    }
}

export default new SalesService()
