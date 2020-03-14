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
          label="选题时间开始">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'selectStartTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="选题时间结束">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'selectEndTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="临时开放选题">
          <a-input placeholder="请输入临时开放选题" v-decorator="['isSelect', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开题报告开始">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'reportStartTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开题报告结束">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'reportEndTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="临时开放开题报告">
          <a-input placeholder="请输入临时开放开题报告" v-decorator="['isReport', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="论文提交开始">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'thesisStartTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="论文提交结束">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'thesisEndTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="临时开放论文提交">
          <a-input placeholder="请输入临时开放论文提交" v-decorator="['isThesis', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="老师id">
          <a-input placeholder="请输入老师id" v-decorator="['teacherId', {}]" />
        </a-form-item>
		
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "YdStageModal",
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

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/graduation/ydStage/add",
          edit: "/graduation/ydStage/edit",
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
          this.form.setFieldsValue(pick(this.model,'isSelect','isReport','isThesis','teacherId','delFlag'))
		  //时间格式化
          this.form.setFieldsValue({selectStartTime:this.model.selectStartTime?moment(this.model.selectStartTime):null})
          this.form.setFieldsValue({selectEndTime:this.model.selectEndTime?moment(this.model.selectEndTime):null})
          this.form.setFieldsValue({reportStartTime:this.model.reportStartTime?moment(this.model.reportStartTime):null})
          this.form.setFieldsValue({reportEndTime:this.model.reportEndTime?moment(this.model.reportEndTime):null})
          this.form.setFieldsValue({thesisStartTime:this.model.thesisStartTime?moment(this.model.thesisStartTime):null})
          this.form.setFieldsValue({thesisEndTime:this.model.thesisEndTime?moment(this.model.thesisEndTime):null})
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
            formData.selectStartTime = formData.selectStartTime?formData.selectStartTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.selectEndTime = formData.selectEndTime?formData.selectEndTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.reportStartTime = formData.reportStartTime?formData.reportStartTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.reportEndTime = formData.reportEndTime?formData.reportEndTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.thesisStartTime = formData.thesisStartTime?formData.thesisStartTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.thesisEndTime = formData.thesisEndTime?formData.thesisEndTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
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