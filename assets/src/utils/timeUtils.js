import * as typeUtils from './typeUtils'

/**
 * 获取当前时区与utc时间的间隔
 * @returns {number} 返回单位:秒
 */
export function getTimezonOffset () {
    return new Date().getTimezoneOffset() * 60
}

/**
 * 获取当前的时间戳 单位:秒
 */
export function getUTCTimetamp () {
    return parseInt(Date.now() / 1000) + getTimezonOffset()
}

/**
 * 日期转为字符串
 * @param time 时间戳获取是Date对象
 * @param isUTC 是否是UTC时间
 * @param withoutDate 是否不包含日期 只有时间
 */
export function time2String (time, withoutDate = false, withoutSeconds = true, isUTC) {
    //  如果time是日期类型
    if (typeUtils.isDate(time)) {
        // 转换为时间戳格式 并将单位转为秒
        time = time.getTime() / 1000
    }

    //  如果是utc时间 加上本地时区的差值
    if (isUTC) {
        time += getTimezonOffset()
    }

    //  最后再转为日期格式
    let finalDate = new Date(time * 1000)
    if (withoutDate) {
        //  返回字符串
        return fillZero(finalDate.getHours(), 2) + ':' + fillZero(finalDate.getMinutes(), 2)
    } else if (withoutSeconds) {
        //  返回字符串
        return finalDate.getFullYear() + '-' + fillZero(finalDate.getMonth() + 1) + '-' + fillZero(finalDate.getDate()) +
            ' ' + fillZero(finalDate.getHours(), 2) + ':' + fillZero(finalDate.getMinutes(), 2)
    } else if (!withoutSeconds) {
        //  返回字符串
        return finalDate.getFullYear() + '-' + fillZero(finalDate.getMonth() + 1) + '-' + fillZero(finalDate.getDate()) +
            ' ' + fillZero(finalDate.getHours(), 2) + ':' + fillZero(finalDate.getMinutes(), 2) + ':' + fillZero(finalDate.getSeconds(), 2)
    }
}

/**
 * 获取时间间隔的描述字符串
 * @param time 时间戳
 * @param isUTC 是否是UTC时间(true表示北京时间减去8小时) 默认:true
 */
export function getTimespanDesc (time, isUTC = true) {
    // 当前的时间戳
    let currTimetamp = isUTC ? getUTCTimetamp() : Date.now()
    let timespan = currTimetamp / 1000 - time // 单位:秒

    //  1分钟内
    if (timespan < 60) {
        return '刚刚'
    }

    timespan = timespan / 60 // 单位:分
    //  1小时内
    if (timespan < 60) {
        return parseInt(timespan) + ' 分钟前'
    }

    timespan = timespan / 60 // 单位:时

    let monthSpan = new Date(currTimetamp).getMonth() - new Date(time * 1000).getMonth()

    // 判断你是否在同一个月
    if (timespan < 48 && monthSpan < 1) {
        //  一天还是两天内
        let daySpan = new Date(currTimetamp).getDate() - new Date(time * 1000).getDate()

        if (daySpan < 1) {        // 一天内
            return '今天 ' + time2String(time, true)
        } else if (daySpan < 2) { // 两天内
            return '昨天 ' + time2String(time, true)
        }
    }

    // 如果日期超过了两天(不在一个月或不在一年) 则直接显示创建时间
    return time2String(time, false, isUTC)
}

// 在字符串前面填充0
export function fillZero (orignStr, maxLength = 2) {
    orignStr = orignStr + '' // 将非字符串转为字符串
    let zeroCount = maxLength - orignStr.length
    let zeroStr = ''
    for (let i = 0; i < zeroCount; i++) {
        zeroStr = zeroStr + '0'
    }

    return zeroStr + orignStr
}

// 日期格式化 格式 例如：2017-02-22
export function getNowDate (isHour = 0, tamp = Date.now() / 1000) {
    let newDate = new Date(tamp * 1000)
    if (isHour) {
        return fillZero(newDate.getHours()) + ':' + fillZero(newDate.getMinutes())
    } else {
        return newDate.getFullYear() + '-' + fillZero(newDate.getMonth() + 1) + '-' + fillZero(newDate.getDate())
    }
}

// 获取星期几
export function getWeek (tamp) {
    let day = new Date(tamp).getDay()
    let weekDays = ['日', '一', '二', '三', '四', '五', '六']
    return weekDays[day]
}

/**
 * 日期转字符串
 * @param date
 * @param split 日期分割方式 默认 -
 * @param hashour 是否需要转时分秒
 * @param hasDay 是否有日
 */
export function date2Str (date, split = '-', {hashour = false, hasDay = true} = {}) {
    if (!typeUtils.isDate(date)) {
        return date
    }

    let ret = [date.getFullYear(), fillZero((date.getMonth() + 1), 2)]
    if (hasDay) {
        ret.push(fillZero(date.getDate(), 2))
        ret = ret.join(split)
    }
    if (hashour) {
        let ret2 = [fillZero(date.getHours(), 2), fillZero(date.getMinutes(), 2), fillZero(date.getSeconds(), 2)]
        ret2 = ret2.join(':')
        ret = ret + ' ' + ret2
    }

    return ret
}

// 比较两个日期的大小(不比较具体的时间)
// 传入的参数必须是 Date 类型
export function compareDate (date1, date2) {
    let years = [date1.getFullYear(), date2.getFullYear()]
    let months = [date1.getMonth(), date2.getMonth()]
    let dates = [date1.getDate(), date2.getDate()]

    if (years[0] < years[1]) {
        return -1
    } else if (months[0] < months[1]) {
        return -1
    } else if (dates[0] < dates[1]) {
        return -1
    } else if (years[0] == years[1] && months[0] == months[1] && dates[0] == dates[1]) {
        return 0
    } else {
        return 1
    }
}
// 比较两个时间的大小()
// 传入的参数必须是 Date 类型
export function compareDateTime (date1, date2) {
    let time = [date1.getTime(), date2.getTime()]
    if (time[0] < time[1]) {
        return -1
    } else {
        return 1
    }
}
// 判断是否是闰年
export function leapYear (year) {
    return !(year % (year % 100 ? 4 : 400))
}

export function addDay (date, addCount) {
    return new Date(date.setDate(date.getDate() + addCount))
}

// 格式化日期
export function formatDate (date, fmt) {
    date = new Date(date)
    let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    return fmt
}

// 秒数转换成时分秒
export function timeFormat(time) {
    let second = 0
    let min = 0
    let hour = 0
    let numtime = time
    // let numtime = 0
    if(parseInt(numtime)/60 >= 1){
        min = parseInt(numtime/60)
        if(parseInt(min)/60 >= 1){
            hour = parseInt(min / 60)
            min = parseInt(min % 60)
        }else {
            min = parseInt(min % 60)
        }
        second = parseInt(numtime%60)
    }else {
        second = parseInt(numtime) % 60
    }
    console.log(`${settime(hour)}时${settime(min)}分${settime(second)}秒`)

    return `${settime(hour)}时${settime(min)}分${settime(second)}秒`
}

function settime(time) {
    if(time < 1){
        return '00'
    }else if(time < 10){
        return '0' + time
    }else {
        return time
    }
}


