<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
      
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专业名称">
          <a-input placeholder="请输入专业名称" v-decorator="['major', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所属院系">
<!--          <a-input placeholder="请输入所属院系" v-decorator="['facultyId', {}]" />-->
          <j-dict-select-tag v-decorator="['facultyId', {}]"
                             placeholder="请输入所属院系"
                             :trigger-change="true"
                             dict-code="yd_faculty_info,faculty,id,del_flag = '0'">
          </j-dict-select-tag>
<!--          <j-search-select-tag
            v-decorator="['facultyId', {}]"
            dict="yd_faculty_info,faculty,id"
            :async="true">
          </j-search-select-tag>-->

        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专业描述">
<!--          <a-input placeholder="请输入专业描述" v-decorator="['recommend', {}]" />-->
          <a-textarea
            placeholder="请输入专业描述"
            v-decorator="['recommend', {}]"
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-item>

		
      </a-form>
    </a-spin>

    <template slot="footer"><!--自定义按钮 方便显示详情界面-->
      <div  v-show="!disableSubmit">
        <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
          <a-button style="margin-right: .8rem">取消</a-button>
        </a-popconfirm>
        <a-button @click="handleOk" type="primary" :loading="confirmLoading">提交</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import JSearchSelectTag from "../../../components/dict/JSearchSelectTag";

  export default {
    name: "YdMajorInfoModal",
    components: {JSearchSelectTag},
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        disableSubmit:false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/graduation/ydMajorInfo/add",
          edit: "/graduation/ydMajorInfo/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'major','facultyId','recommend','delFlag'))
		  //时间格式化
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            
            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>