/**
 * Created by huanghuixin on 2017/4/10.
 */

// 题目类型 0-判断 1-单选 2-多选
class TestingFactory {
    // 最全的原始数据
    getOrignData () {
        return {
            description: void 0, // 题目
            score: void 0, // 分数
            image: void 0, // 图片
            explain: void 0, // 答案详解
            options: [{ // 选项
                sort: 0,
                description: '',
                correct: '' // 是否正确答案 正确为1
            }]
        }
    }

    /**
     * 获取题目设置
     * @param type 0-判断 1-单选 2-多选
     */
    getTestingSet (type) {
        let data = this.getOrignData()
        if (type == 0) {
            delete data.options
            data.correct = void 0
            return data
        } else if (type == 1 || type == 2) {
            return data
        }
    }
}

export default new TestingFactory()
