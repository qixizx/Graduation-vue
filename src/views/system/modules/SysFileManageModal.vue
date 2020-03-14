<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"

    @cancel="handleCancel"
    :okButtonProps="{ props: {disabled: true} }"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="名称">
          <a-input placeholder="请输入名称" v-decorator="['originalName', validatorRules.originalName]" :readOnly="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="类型">
          <a-input placeholder="请输入类型" v-decorator="['fileType_dictText', validatorRules.fileType_dictText]" :readOnly="disableSubmit" />
        </a-form-item>
        <a-form-item label="文件" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload v-if="this.model.fileType_dictText == '图片'"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
          >
            <img :src="getAvatarView()" alt="图片" style="width: 100%;"/>
          </a-upload>
          <div v-else-if="this.model.fileType_dictText == '文档'">
            <a :href="getAvatarView1()" download="">{{this.model.originalName}}</a>
          </div>
          <div v-else-if="this.model.fileType_dictText == '视频'">
            <video :src="getAvatarView()" controls="controls" style="width: 100%;">您的浏览器不支持video标签！</video>
          </div>
          <div v-else-if="this.model.fileType_dictText == '音频'">
            <audio :src="getAvatarView()" controls="controls" style="width: 100%;">您的浏览器不支持audio标签！</audio>
          </div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建人">
          <a-input placeholder="请输入创建人" v-decorator="['createBy', validatorRules.createBy]" :readOnly="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建时间">
          <a-input placeholder="请输入创建时间" v-decorator="['createTime', validatorRules.createTime]" :readOnly="disableSubmit" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { getAction } from '@/api/manage'
  import JDate from '@/components/jeecg/JDate'
  import JEditor from '@/components/jeecg/JEditor'
  import SelectUserListModal from "./SelectUserListModal";

  export default {
    components: { JEditor, JDate, SelectUserListModal},
    name: "SysFileManageModal",
    data () {
      return {
        title:"操作",
        visible: false,
        disableSubmit:false,
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
          originalName:{rules: [{ required: true, message: '请输入名称!' }]},
          fileType_dictText:{rules: [{ required: true, message: '请输入类型!' }]},
          createBy:{rules: [{ required: true, message: '请输入创建人!' }]},
        },
        url: {
          queryByIds: "/common/file/edit",
          imgerver: window._CONFIG['domianURL']+"/sys/common/view",
          urlDownload: window._CONFIG['domianURL']+"/sys/common/download",
         /* add: "/sys/annountCement/add",
          edit: "/common/file/edit",*/
        },
        userType:false,
        userIds:[],
        model:{},
        selectedUser:[],
        disabled:false,
        filePath:''
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
        this.model = {}
        this.disable = false;
        this.visible = true;
        this.getUser(record);
      },
      getUser(record){
        this.model = Object.assign({}, record);
        // 指定用户
        if(record&&record.msgType === "USER"){
          this.userType =  true;
          this.userIds = record.userIds;
          getAction(this.url.queryByIds,{userIds:this.userIds}).then((res)=>{
            if(res.success){
              for(var i=0;i<res.result.length;i++){
                this.selectedUser.push(res.result[i].realname);
              }
              this.$refs.UserListModal.edit(res.result,this.userIds);
            }
          });
        }
        this.$nextTick(() => {
          this.form.initialValue(pick(this.model,'originalName','fileType_dictText','filePath','createBy','createTime',))
        });
      },
      close () {
        this.$emit('close');
        this.selectedUser = [];
        this.visible = false;
      },
      handleCancel () {
        this.visible = false;
        this.$emit('close');
        this.resetUser();
      },
      resetUser (){
        this.userType =  false;
        this.userIds = [];
        this.selectedUser = [];
        this.disabled = false;
        this.$refs.UserListModal.edit(null,null);
      },
      selectUserIds() {
        this.$refs.UserListModal.add(this.selectedUser,this.userIds);
      },
      getAvatarView(){
        return this.url.imgerver +"/"+ this.model.filePath;
      },
      getAvatarView1(){
        return this.url.urlDownload +"/"+ this.model.filePath;
      }
    }
  }
</script>

<style scoped>

</style>