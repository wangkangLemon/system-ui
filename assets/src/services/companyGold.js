import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/company/gold'

class companyGold {
    //获取连锁名称
    getIndrustrySelectList({
        category = '',
        page_size = '',
        page = '',
        keyword = ''
    }) {
        let finalUrl = urlPre + '/search'
        return api.get(finalUrl, {
            category,
            page,
            page_size,
            keyword
        }).then((ret) => {
            return ret.data
        }).catch((err) => {
            return Promise.reject(err)
        })
    }
    //添加白名单企业
    addCompanyRoster({
        comids = ''
    }) {
        let finalUrl = urlPre + '/white/adds'
        return api.get(finalUrl, {
            comids
        }).then((ret) => {
            return ret
        })
    }
    //删除白名单企业
    deleteCompanyRoster({
        comids = ''
        
    }) {
        let finalUrl = urlPre + '/white/deletes'
        return api.get(finalUrl, {
            comids
        }).then((ret) => {
            return ret
        })
    }
    //企业人口查询
    getCompanyUserList({
        page,
        page_size,
        company_id,
        _ispay
    }) {
        let finalUrl = urlPre + '/user'
        return api.get(finalUrl, {
            page,
            page_size,
            company_id,
            _ispay
        }).then((ret) => {
            return ret.data
        })
    }
    //查询白名单列表
    getNoPayList({
        page_size,
      
    }) {
        let finalUrl = urlPre+'/white/search'
        return api.get(finalUrl, {
         page_size,
        }).then((ret) => {
            return ret.data
        })
    }
    //连锁后台通知
    sendNotice({
        company_id,
        pay_cnt,
        unpaid_cnt
    }) {
        let finalUrl = urlPre+'/notice'
        return api.post(finalUrl, {
            company_id,
            pay_cnt,
            unpaid_cnt
        }).then((ret) => {
            return ret
        })
    }
}

export default new companyGold()
