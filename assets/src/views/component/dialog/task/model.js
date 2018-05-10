export default class Task {
    getTabs (keys = Task.keys) {
        return this.getTabList().filter(tab => keys.includes(tab.type))
    }
    /**
     * 根据传入的selectedData来初始化每个tab的selected
     * @param  {Array} keys         [键]
     * @param  {Array} selectedData [需要初始化的选中的数据]
     * selectedData = [
     *     {
     *         type: 'course',
     *         selected: [{a: 1},{a: 2}]
     *     }
     * ]
     */
    initTabs (keys = Task.keys, selectedData = []) {
        let tabList = this.getTabs(keys)
        if (selectedData.length) {
            tabList.forEach(tab => {
                let data = selectedData.filter(sel => sel.type === tab.type)[0].selected
                tab.selected = data
            })
        }
        return tabList
    }
    // 如果会改变其中的值，需写在实例方法中，否则会共用，共用会导致意料不到的问题
    getTabList () {
        return [
            {
                label: '课程',
                value: 1,
                type: 'course',
                childType: ['public', 'private'],
                selected: [],
                component: 'CourseTransfer'
            },
            {
                label: '试卷',
                value: 2,
                type: 'exam',
                selected: [],
                component: 'ExamTransfer'
            },
            {
                label: '练习',
                value: 3,
                type: 'practice',
                selected: [],
                component: 'PracticeTransfer'
            }
        ]
    }
}
Task.keys = ['course', 'exam', 'practice']
