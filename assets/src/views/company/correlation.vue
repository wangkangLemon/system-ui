<template>
	<div class="company-operate-container">
		<el-dialog title="选择连锁" :visible.sync="dialogFormVisible">
			<div>
				<operateTree v-on:closeMain='showMsgFromChild' ref='trees' :text='message'>
				</operateTree>
				<el-button type="primary" @click='loadMore'>点击加载更多</el-button>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="confirm">确 定</el-button>
			</div>
		</el-dialog>
		<el-form>
			<el-form-item prop="user_number" label="关联连锁门店" :label-width="formLabelWidth">
				<div class="collection" @click="openPushTypeDialog">
					<el-tag class="u-course-tag" v-for='item in nameArray'>
						{{item.name}}
					</el-tag>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import companyService from '../../services/companyService'
	import operateTree from '../component/tree/operateTree.vue'
	export default {
		components: {
			operateTree
		},
		data() {
			return {
				message:'',
				ids: [],
				nameArray: [],
				companyID: '',
				formLabelWidth: '120px',
				user_number: '',
				chainStores: '',
				dialogFormVisible: false,
				form: {
					company_id: '',
					ids: [],
					node: ''
				},
				sign: {
					department_number: '', // 门店数量
					user_number: '', // 店员数量
					signatory: '', // 签约人
					sign_time: '', // 签约日期
					expire_time: '' // 合同到期日
				}

			}
		},
		methods: {
			loadMore() {
				console.log(this.$refs.trees)
				this.$refs.trees.fetchData();
			},
			cancel() {
				this.dialogFormVisible = false
				this.editcompany()
			},
			showMsgFromChild(data) {
				if(data[1] == true) {
					this.nameArray.push(data[0])
					this.form.ids.push(data[0])
					console.log(this.form.ids)
				} else {
					this.form.ids.remove(data[0])
					console.log(this.form.ids)
				}
			},
			confirm() {
				this.nameArray = unique(this.nameArray)
				this.form.ids = unique(this.form.ids)
				this.dialogFormVisible = false
				this.form.company_id = this.companyID
				companyService.corporate(this.form).then(() => {
					xmview.showTip('success', '关联成功')
				}).then(() => {
					this.$router.push({
						name: 'company-index'
					})
				}).catch(err => {
					this.message=false
					this.$router.push({
						name: 'company-index'
					})
					this.editcompany()
				})
			},
			openPushTypeDialog() {
				this.dialogFormVisible = true
				this.editcompany()

			},
			editcompany() {
				this.companyID = this.$route.query.id
				this.form.ids = []
				xmview.setContentLoading(false)
				if(this.companyID == undefined) {
					this.sign = {
						department_number: '', // 门店数量
						user_number: '', // 店员数量
						signatory: '', // 签约人
						sign_time: '', // 签约日期
						expire_time: '' // 合同到期日
					}
					this.form = {
						category: '', // 类型
						name: '', // 名称
						contact: '', // 联系人
						mobile: '', // 联系人手机
						tel: '', // 电话
						email: '', // 联系人邮箱
						fax: '', // 传真
						province: '', // 省
						city: '', // 市
						area: '', // 区
						address: '', // 地址
						zip: '', // 邮编
						url: '', // 企业网址
						description: '', // 企业介绍
					}
					return false
				}
				companyService.editCompany(this.companyID).then((ret) => {
					this.sign.department_number = ret.sign.department_number
					this.nameArray = ret.linkedInfos
					this.companyID = this.companyID
				})
			}
		},
		activated() {
			this.editcompany()
			
		}

	}
	//去掉重复元素
	function unique(arr) {
		console.log(arr)
		var result = [];
		for(var i = 0; i < arr.length; i++) {
			if(result.indexOf(arr[i]) == -1) {
				result.push(arr[i])
			}
		}
		return result;

	}
	//去掉数组中某个元素
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if(index > -1) {
			this.splice(index, 1);
		}
	};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
	.company-operate-container {
		height: 200px;
		background: #fff;
		padding: 20px 200px;
		.addForm {
			.tip {
				text-align: center;
				border-top: 1px solid #ddd;
				color: #ff0000;
				line-height: 50px;
			}
		}
		.dialog-footer {
			text-align: center;
		}
	}
	
	.collection {
		align-items: center;
		min-height: 36px;
		border-radius: 4px;
		padding: 3px 30px 3px 10px;
		border: 1px solid #bfcbd9;
	}
	
	.u-course-tag {
		margin-right: 10px;
		background-color: rgba(32, 160, 255, .1);
		display: inline-block;
		padding: 0 10px;
		height: 32px;
		line-height: 30px;
		font-size: 12px;
		color: #20a0ff;
		border-radius: 4px;
		box-sizing: border-box;
		border: 1px solid rgba(32, 160, 255, .2);
		white-space: nowrap;
		&:last-child {
			margin-right: 0;
		}
	}
</style>