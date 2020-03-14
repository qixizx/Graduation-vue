<template>
  <a-modal
    title="详情"
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
          label="标题">
          <a-input v-decorator="['title', {}]"  disabled="true"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="内容">
          <a-textarea style="border:1px solid #d9d9d9;height: 150px" v-decorator="['content', {}]" disabled="true"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发送类型">
          <j-dict-select-tag :triggerChange="true" dictCode="msgType" v-decorator="[ 'sendType', {}]"  disabled="true">
          </j-dict-select-tag>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="指定经销商">
          <a-input v-model="dealer" disabled="true" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="收件人">
          <a-textarea style="border:1px solid #d9d9d9;height: 150px" v-decorator="['receiveAddress', {}]" disabled="true"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { getAction } from '@/api/manage'

  export default {
    name: "SysMessageMasterDetail",
    data () {
      return {
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
        dealer:""
      }
    },
    created () {
    },
    methods: {
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        const that = this;
        getAction('/benz/meDealerInfo/queryByIds',{userIds:record.sendObject}).then((res)=> {
          console.log(res)
          if(res.success){
            res.result.forEach(function(item) {
              that.dealer+=item.dealerName+",";
            })
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'receiveAddress', 'sendObject', 'sendType', 'content', 'title'))
            //时间格式化
          });
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.close();
      },
      handleCancel () {
        this.close();
      },
    }
  }
</script>

<style lang="less" scoped>

</style>