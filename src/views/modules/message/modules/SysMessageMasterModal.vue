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
          label="标题">
          <a-input placeholder="请输入标题" v-decorator="['title', {rules: [{ required: true, message: '请输入标题!' }]}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发送类型">
          <j-dict-select-tag @change='selectType' :triggerChange="true" dictCode="msgType" v-decorator="[ 'sendType', {rules: [{ required: true, message: '请选择类型!' }]}]" placeholder="请输入发送类型">
          </j-dict-select-tag>
        </a-form-item>
        <a-form-item v-if="emailInfo"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="内容">
          <j-editor v-decorator="[ 'content', {} ]" triggerChange></j-editor>
        </a-form-item>
        <a-form-item v-if="smsInfo"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="内容">
          <a-textarea style="border:1px solid #d9d9d9;height: 150px" v-decorator="['content', {}]"/>
        </a-form-item>

        <a-form-item label="附件类型" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="emailInfo">
          <a-select placeholder="请选择类型"  @change="handleTypeChange" v-decorator="['fileType', {}]">
            <a-select-option value="0">图片</a-select-option>
            <a-select-option value="1">文档</a-select-option>
            <a-select-option value="2">视频</a-select-option>
            <a-select-option value="4">压缩包</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="emailInfo">
          <a-upload
            :action="uploadAction"
            listType="picture"
            :data="{'isup':1}"
            :headers="tokenHeader"
            :fileList="fileList"
            :beforeUpload="beforeUpload"
            @change="handleFileUpload"
            class="upload-list-inline"
          >
            <a-button >
              <a-icon type="upload" /> upload
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="指定经销商">
          <a-select
            mode="multiple"
            style="width: 100%"
            placeholder="请选择经销商"
            v-model="selectedUser"
            @dropdownVisibleChange="selectUserIds">
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import JEditor from '@/components/jeecg/JEditor'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  export default {
    name: "SysMessageMasterModal",
    components: {JEditor},
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
          add: "/message/sysMessageMaster/add",
          edit: "/message/sysMessageMaster/edit",
          queryByDealer: "/benz/meDealerUser/queryByDealer",
          queryByIds: "/benz/meDealerInfo/queryByIds",
          //file
          fileImg: window._CONFIG['domianURL']+"/common/file/uploadImg?parenPath=tpsoft&uploadType=0",
          fileVideo: window._CONFIG['domianURL']+"/common/file/uploadImg?parenPath=tpsoft&uploadType=2",
          fileAudio: window._CONFIG['domianURL']+"/common/file/uploadImg?parenPath=tpsoft&uploadType=3",
          fileZip: window._CONFIG['domianURL']+"/common/file/uploadImg?parenPath=tpsoft&uploadType=4",
          fileDocument: window._CONFIG['domianURL']+"/common/file/uploadImg?parenPath=tpsoft&uploadType=1",
        },
        userIds:[],
        selectedUser:[],
        dealerNum:'',
        emailInfo:false,
        smsInfo:false,
        //文件上传相关
        type: "",
        tokenHeader:{},
        fileList:[],
        filePath:"",
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.tokenHeader = {"X-Access-Token":token}
    },
    computed: {
      uploadAction: function(){
        if(this.type == "0") {
          return this.url.fileImg;
        }else if(this.type == "1") {
          return this.url.fileDocument;
        }else if(this.type == "2") {
          return this.url.fileVideo;
        }else if(this.type == "4") {
          return this.url.fileZip;
        }else{
          return this.url.fileImg;
        }
      }
    },
    methods: {
      selectType(value){
        if(value=='email'){
          this.emailInfo = true;
          this.smsInfo = false;
        }else{
          this.emailInfo = false;
          this.smsInfo = true;
        }
      },
      add () {
        this.userIds = [];
        this.selectedUser = [];
        this.dealerNum = '';
        this.edit({});
      },
      edit (record) {
        // console.log(record);
        if(JSON.stringify(record) != "{}"){
          this.userIds = record.sendObject;
          getAction(this.url.queryByIds,{userIds:this.userIds}).then((res)=>{
            if(res.success){
              for(var i=0;i<res.result.length;i++){
                this.selectedUser.push(res.result[i].dealerName);
                this.dealerNum = record.sendObject;
              }
            }
          });
        }
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'receiveAddress','sendObject','sendType','content','title','fileType'))
          if(this.model.sendType=='email'){
            this.emailInfo = true;
            this.smsInfo = false;
          }else{
            this.emailInfo = false;
            this.smsInfo = true;
          }
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
            formData.source = "meClub"
            formData.sendObject = this.dealerNum;
            formData.filePath = this.filePath;
            formData.fileType = this.type;
            this.filePath = "";
            //时间格式化
            ////通过dealerNum和type 去拿手机号或者邮箱
            let params = {};
            params.sendType = formData.sendType;
            params.dealerNums = this.dealerNum;
            console.log(params);
            getAction(this.url.queryByDealer, params).then((res) => {
                formData.receiveAddress = res;
                console.log(formData)
                //清空一下经销商信息
                this.userIds = [];
                this.selectedUser = [];
                this.dealerNum = '';
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
                  that.$emit('ok');
                })
            })
          }
        })
      },
      handleCancel () {
        this.close();
        this.userIds = [];
        this.selectedUser = [];
      },
      selectUserIds() {
      },
      // 子modal回调
      choseUser:function(userList){
        this.selectedUser = [];
        this.userIds = [];
        for(var i=0;i<userList.length;i++){
          this.selectedUser.push(userList[i].dealerName);
          this.userIds += userList[i].id+","
          this.dealerNum += userList[i].dealerNum+","
        }
      },

      //文件上传相关
      handleTypeChange(value){
        this.type = value;
      },
      beforeUpload: function(file){
        console.log(file)
        if(file.size >= 10240000){
          this.$message.warning('文件过大');
          return false;
        }
        let type = this.type;
        if(type == undefined){
          this.$message.warning('请先选择文件类型');
          return false;
        }
        var fileType = file.type;
        if(type == "0") {
          if (fileType.indexOf('image') < 0) {
            this.$message.warning('请上传图片');
            return false;
          }
        }else if(type == "1"){
          if (fileType.indexOf('application') < 0 && fileType.indexOf('text') < 0) {
            this.$message.warning('请上传文档');
            return false;
          }
        }else if(type == "2"){
          if (fileType.indexOf('video') < 0) {
            this.$message.warning('请上传视频');
            return false;
          }
        }else if(type == "4"){
          if (fileType.indexOf('application/x-zip-compressed') < 0) {
            this.$message.warning('请上传压缩包');
            return false;
          }
        }
        //TODO 验证文件大小
      },
      handleFileUpload (info) {
        let fileList = [...info.fileList];
        if (info.file.status === 'uploading') {
          fileList = fileList.slice(-1);
          fileList = fileList.map((file) => {
            if (file.response) {
              file.url = file.response.url;
            }
            return file;
          });
          this.fileList = fileList

          return
        }
        if (info.file.status === 'done') {
          var response = info.file.response;
          this.uploadLoading = false;
          console.log(response);
          if(response.success){
            this.filePath = response.result.filePath;
            this.picUrl = "Has no pic url yet";
          }else{
            this.$message.warning(response.message);
          }
        }
        if(info.file.status === 'removed') {
          this.fileList = [];
        }
      },

    }
  }
</script>

<style lang="less" scoped>

</style>