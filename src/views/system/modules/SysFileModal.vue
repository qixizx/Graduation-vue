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
      <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol" >
        <a-select   v-decorator="[ 'fileType', validatorRules.fileType]" placeholder="请选择类型"  @change="handleTypeChange">
          <a-select-option value="0" >图片</a-select-option>
          <a-select-option value="1">文档</a-select-option>
          <a-select-option value="2">视频</a-select-option>
          <a-select-option value="3">音乐</a-select-option>
        </a-select>
      </a-form-item>

        <a-form-item label="文件" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-upload
            :action="uploadAction"
            listType="picture"
            :data="{'isup':1}"
            :headers="headers"
            :fileList="fileList"
            :beforeUpload="beforeUpload"
            @change="handleChange"
            @remove="handleRemove"
            class="upload-list-inline"
          >
            <a-button >
              <a-icon type="upload" /> upload
            </a-button>
          </a-upload>
         <!-- <a-upload
            :action="uploadAction"
            :multiple="true"
            :fileList="fileList"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <a-button>
              <a-icon type="upload" /> 上传
            </a-button>
          </a-upload>-->
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  export default {
    name: "SysFileModal",
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
        fileList:[],
        confirmLoading: false,
        uploadLoading:false,
        headers:{},
        picUrl: "",
        type: "",
        form: this.$form.createForm(this),
        validatorRules:{
          fileType:{
            rules: [{
              required: true, message: '请选择文件类型!'
            }],
            initialValue: "0"
          },
        },
        url: {
          add: "/common/file/add",
          fileImg: window._CONFIG['domianURL']+"/common/file/uploadImg?parenPath=tpsoft&uploadType=0",
          fileVideo: window._CONFIG['domianURL']+"/common/file/uploadImg?parenPath=tpsoft&uploadType=2",
          fileAudio: window._CONFIG['domianURL']+"/common/file/uploadImg?parenPath=tpsoft&uploadType=3",
          fileDocument: window._CONFIG['domianURL']+"/common/file/uploadImg?parenPath=tpsoft&uploadType=1",
          imgerver: window._CONFIG['domianURL']+"/sys/common/view",
        },
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
    },
    computed:{
      uploadAction:function () {
        if(this.type == "0") {
          return this.url.fileImg;
        }else if(this.type == "1") {
          return this.url.fileDocument;
        }else if(this.type == "2") {
          return this.url.fileVideo;
        }else{
          return this.url.fileImg;
        }

      }
    },

    methods: {
      add () {
        this.picUrl = "";
        this.visible = true;
        this.fileList =[];
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.model.fileType = "0";
      },

      beforeUpload: function(file){
        let type = this.model.fileType;
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
        }
        //TODO 验证文件大小
      },
      handleChange (info) {
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
            this.model.filePath = response.result.filePath;
            this.model.id = response.result.id;
            this.model.sysfile = response.result;
            this.picUrl = "Has no pic url yet";
          }else{
            this.$message.warning(response.message);
          }
        }
        if(info.file.status === 'removed') {
          this.fileList = [];
          this.model.sysfile = [];
        }
      },

      handleTypeChange(value){
        this.model.fileType = value;
        this.type = value;
        if("0"==value){
            this.showImg = true;
            this.showDoc = false;
        }else{
            this.showImg = false;
            this.showDoc = true;
        }
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';

              httpurl+=this.url.add;
              method = 'post';

            let formData = Object.assign(this.model, this.model.sysfile);

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
      close () {
        this.$emit('close');
        this.visible = false;
        console.log("this.fileList"+JSON.stringify(this.fileList));
      },

      handleCancel () {
        this.close()
      },
    }
  }
</script>

<style scoped>
  .upload-list-inline >>> .ant-upload-list-item {
    float: left;
    width: 200px;
    margin-right: 8px;
  }
  .upload-list-inline >>> .ant-upload-animate-enter {
    animation-name: uploadAnimateInlineIn;
  }
  .upload-list-inline >>> .ant-upload-animate-leave {
    animation-name: uploadAnimateInlineOut;
  }
</style>