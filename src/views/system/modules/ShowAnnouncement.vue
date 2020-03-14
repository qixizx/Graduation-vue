<template>
  <a-modal
    width="60%"
    height="60%"
    :visible="visible"
    :bodyStyle ="bodyStyle"
    @cancel="handleCancel"
    destroyOnClose
    :footer="null">

    <a-card style="width: 100%;height: 100%" class="daily-article" :loading="loading">
      <div>
        <a-card-meta
          :title="record.titile"
          :description="'发布人：'+record.sender + ' 发布时间： ' + record.sendTime"/>
        <a-divider />
        <span v-html="record.msgContent" class="article-content"></span>
      </div>

      <div style="height: 300px;margin-bottom: 8px;overflow: auto;">
        <div v-for= "(item,index) in listReply">
          <a-card-meta
            :title="'回复内容：' + item.content"
            :description="'回复人：'+item.createBy + ' 回复时间： ' + item.createTime + ' 回复标题： ' + item.title">
          </a-card-meta>
        </div>
      </div>
      <div>
        <div style="width: 100%">
           <a-textarea v-model="textReply" placeholder="Basic usage" :rows="4" />
        </div>
        <div style="margin-top: 8px">
           <a-button type="primary" @click="replyAction()">回复</a-button>
        </div>
      </div>


    </a-card>

  </a-modal>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {frozenBatch} from '@/api/api'
  import {getAction,httpAction} from '@/api/manage'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"


  export default {
    name: "SysAnnouncementModal",
    mixins:[JeecgListMixin],
    components: {
    },
    data () {
      return {
        title:"通知消息",
        record: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        visible: false,
        loading: false,
        bodyStyle:{
          padding: "0",
          height:(window.innerHeight*0.8)+"px",
          "overflow-y":"auto"
        },
        textReply:"",
        user: {},
        model:{},
        listReply:[],
        url: {
          list: "/benz/meSysAnnounceMent/list",
          listDealer: "/benz/meDealerFile/listDealer",
          add: "/benz/meSysAnnounceMent/add",
          init: "/benz/meDealerUser/dealerByUserName"
        },
      }
    },
    created () {
      this.init()
    },
    methods: {
      detail (record) {
        this.visible = true;
        this.record = record;
        this.init();
        this.loadDate();

        console.log(this.record)
        console.log(this.user)
      },
      init(){
        getAction(this.url.init, {}).then((res) => {
           this.user = res
        })
      },
      handleCancel () {
        this.visible = false;
      },
      replyAction(){
        console.log(this.record)
        console.log(this.user)
        const that = this;
        // 触发表单验证
        let httpurl = '';
        let method = '';

        httpurl+=this.url.add;
        method = 'post';

        console.log(that.record.anntId)
        that.model.anntId = that.record.anntId;
        that.model.anntSendId = that.record.id;
        that.model.title = that.record.titile;
        that.model.userId = that.record.userId;
        that.model.dealerNum = that.user.dealerNum;
        that.model.dealerName = that.user.dealerName;
        that.model.content = that.textReply;

        let formData = Object.assign(that.model, {});

        console.log(formData)
        httpAction(httpurl,formData,method).then((res)=>{
          if(res.success){
            that.$message.success("回复成功");
            that.textReply = "";
            that.loadDate();
          }else{
            that.$message.warning(res.message);
          }
        }).finally(() => {
        })
      },
      loadDate(){
        const that = this;
        var params = {};//查询条件
        params.anntId = that.record.anntId;
        params.anntSendId = that.record.id;
        params.userId = that.record.userId;
        params.dealerNum = that.user.dealerNum;
        params.dealerName = that.user.dealerName;
        getAction(that.url.list, params).then((res) => {
          console.log(res.result.records)
          that.listReply = res.result.records;
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .daily-article {
  .article-button {
    font-size: 1.2rem !important;
  }
  .ant-card-body {
    padding: 18px !important;
  }
  .ant-card-head {
    padding: 0 1rem;
  }
  .ant-card-meta {
    margin-bottom: 1rem;
  }
  .article-content {
  p {
    word-wrap: break-word;
    word-break: break-all;
    text-overflow: initial;
    white-space: normal;
    font-size: .9rem !important;
    margin-bottom: .8rem;
  }
  }
  }
</style>