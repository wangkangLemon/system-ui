import Vue from 'vue'
let SidePannelConstructor = Vue.extend(require('./main.vue'))
let instance
var SidePannel = function (options) {
    if (!instance) {
        instance = new SidePannelConstructor({
            data: options
        })
    }
    if (options.content) {
        instance.$slots.default = [options.content]
    }
    instance.vm = instance.$mount()
    instance.vm.$el.style.height = (document.documentElement.clientHeight - 56) + 'px'
    document.body.appendChild(instance.vm.$el)
    instance.vm.isActive = true
    return instance.vm
}

export default SidePannel
