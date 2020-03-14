<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="12">
            <a-form-item label="创建人">
              <a-input placeholder="请输入创建人姓名" v-model="queryParam.createBy"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="类型">
              <a-select v-model="queryParam.fileType" placeholder="请选择类型查询">
                <a-select-option value="">请选择类型查询</a-select-option>
                <a-select-option value="0">图片</a-select-option>
                <a-select-option value="1">文档</a-select-option>
                <a-select-option value="2">视频</a-select-option>
                <a-select-option value="3">音乐</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleModalVisible(true)" type="primary" icon="plus">新增</a-button>
    </div>
    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
            <!--  <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>-->
       <!--   <a-divider type="vertical" />-->
                <a @click="handleDetail(record)">详情</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a >删除</a>
                </a-popconfirm>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
   <!-- <sys-file-modal ref="modalForm" @ok="modalFormOk"></sys-file-modal>-->
   <sys-file-manage-modal ref="modalForm" @ok="modalFormOk"></sys-file-manage-modal>


    <a-modal destroyOnClose
      title="操作"
      :width="800"
      :visible="visibleCreateModal"
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

  </a-card>
</template>

<script>
  /*import SysFileModal from './modules/SysFileModal'*/
  import {frozenBatch} from '@/api/api'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SysFileManageModal from './modules/SysFileManageModal'
  import { httpAction } from '@/api/manage'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  export default {
    name: "SysFileManage",
    mixins:[JeecgListMixin],
    components: {
      /*SysFileModal,*/
      SysFileManageModal
    },
    data(){
      return{
        description:"文件管理",
        visibleCreateModal:false,
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '名称',
            align:"center",
            dataIndex: 'originalName'
          },
          {
            title: '类型',
            align:"center",
            dataIndex: 'fileType_dictText'
          },
          {
            title: '路径',
            align:"center",
            dataIndex: 'filePath'
          },
          {
            title: '创建人',
            align:"center",
            dataIndex: 'createBy'
          },
          {
            title: '创建时间',
            align:"center",
            dataIndex: 'createTime',
            sorter: true
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: { customRender: 'action' },
          }
        ],

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
          list: "/common/file/list",
          delete: "/common/file/delete",
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
    computed: {
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

      //添加逻辑
      handleModalVisible(isVisible) {
        this.visibleCreateModal = isVisible;
        this.fileList =[];
        this.form.resetFields();
        this.model.fileType = "0";
      },

      beforeUpload: function(file){
        console.log("fileType"+this.model.fileType);
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
                this.visibleCreateModal = false;
              }else{
                that.$message.warning(res.message);
              }
              this.loadRuleData();
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })

      },
      close () {
        this.$emit('close');
        this.visibleCreateModal = false;
      },

      handleCancel () {
        this.close()
      },

    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>