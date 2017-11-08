<script>
    import { Dialog } from 'element-ui'
    import Popup from 'element-ui/src/utils/popup'

    export default {
        name: 'NestedDialog',
        mixins: [Dialog, Popup],
        props: {
            appendToBody: {
                type: Boolean,
                default: true
            }
        },
        mounted() {
            if (this.appendToBody) {
                document.body.appendChild(this.$el)
            }
        }
    }
</script>
