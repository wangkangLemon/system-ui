<template>
	<div>
		<el-input placeholder="搜索连锁" v-model="filterText" style="margin-bottom: 10px;" @change='search'>
		</el-input>
		<el-tree :data="data" show-checkbox node-key="id" ref="tree" :props="defaultProps" @check-change="handleNodeClick" @node-expand="handleNodeExpand" :highlight-current="selectable" :filter-node-method="filterNode">
		</el-tree>
	</div>

</template>

<script>
	import departmentService from '../../../services/departmentService'
	import companyService from '../../../services/companyService'
	export default {
		props:['text'],
		data() {
			return {
				type: 2,
				pageSize: 15,
				filterText: '',
				data: [],
				defaultProps: {
					children: 'children',
					label: 'label'

				},
				selectable: true, //是否可选中,
				company_id: '',
				department_id: '',
				parentId: []
			}
		},
		watch: {
			defaultCheck(val) {
				console.log(val)
			},
			text:function(val){
				if(val==false){
					this.filterText=''
					
				}
			}
		},
		activated() {
			this.data = []
			this.fetchData()
		},
		created() {
			this.fetchData()
		},
		//		watch: {
		//			filterText(val) {
		//				this.$refs.tree.filter(val);
		//			}
		//		},
		methods: {
			search(val) {
				this.data = []
				this.fetchData(val)
			},
			fetchData(val) {
				return companyService.getIndrustrySelectList({
					category: this.type,
					page_size: this.pageSize,
					page: parseInt(this.data.length / this.pageSize) + 1,
					keyword: val
				}).then((ret) => {
					console.log(ret)
					ret.data.forEach((v) => {
						this.data.push({
							data: v,
							id: v.id,
							label: v.name,
							value: v.id,
							children: v.has_children ? null : [{
								label: '正在加载',
								value: -1,
							}] //是否最终菜单？点箭头触发请求
						})
						this.parentId.push(v.id)

					})
				})
			},
			filterNode(value, data) {
				if(!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			handleNodeClick(data, Node, store) {
				console.log(this.parentId)
				let newData=[]
				let arr1 = this.parentId
				let arr = data.data.id
				console.log(arr)
				let arr3=false
					arr1.forEach(function(items,j){
						if(arr===items){
							arr3=true
						}else{
							newData.push(items)
						}
					})
					if(!arr3){
						this.$emit('closeMain', [arr, Node])
					}
			},
			handleNodeExpand(data, node, store) {
				console.log(node)
				if(node.level == 1) {
					this.company_id = data.value
					this.department_id = 0
				} else if(node.level == 2) {
					this.department_id = data.value
				} else if(node.level == 3) {
					this.department_id = data.value
				}
				return departmentService.getDepartmentTwo({
					page_size: this.pageSize,
					company_id: this.company_id,
					department_id: this.department_id
				}).then((ret) => {
					let arr = []
					if(ret.data !== null) {
						ret.data.forEach(v => {
							arr.push({
								data: v,
								id: v.id,
								label: v.name,
								value: v.id,
								children: !v.has_children ? null : [{
									label: '正在加载',
									value: -1,
								}] //是否最终菜单？点箭头触发请求
							})

						})
						node.data.children = arr
					} else {
						node.data.children = []
					}

				})
			}

		},
	}
</script>

<style>

</style>