/**
 * Created by huangrui on 2017/7/4.
 */
/*
 * 获取数组ID所在项的index
 * 数组 array
 * ID  id
 */
export function getArrayIdIndex(array, id) {
    return array.findIndex((value, index, arr) => {
        return value.id == id
    })
}

/**
 * 判断数据类型
 */
export function typeOf (o) {
    return o == null ? String(o) : ({}).toString.call(o).slice(8, -1).toLowerCase()
}

/**
 * 深度克隆
 * @param  {Object} obj
 * @return {Object} newobj
 */
export function clone (obj) {
    let type = typeOf(obj)
    switch (type) {
    case 'object':
        var cloned = {}
        for (let i in obj) {
            cloned[i] = clone(obj[i])
        }
        return cloned
    case 'array':
        return obj.map(clone)
    default:
        return obj
    }
}

/**
 * 覆盖target中已有的变量，没有的变量不赋值
 */
export function objectMerge (target, ...sources) {
    for (let source of sources) {
        Object.keys(source).forEach(item => {
            if (item in target) {
                target[item] = source[item]
            }
        })
    }
}

export function validatePositiveNum (num) {
    let reg = /^[1-9]\d*$/g
    return reg.test(num)
}

