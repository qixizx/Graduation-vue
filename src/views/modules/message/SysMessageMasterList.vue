<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="标题">
              <a-input placeholder="标题" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="内容">
              <a-input placeholder="内容" v-model="queryParam.content"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="发送类型">
              <j-dict-select-tag dictCode="msgType" v-model="queryParam.sendType" placeholder="选择类型">
              </j-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;display: flex;justify-content: space-between;align-items: center">
        <div>
          <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 10px"> 批量操作 <a-icon type="down" /></a-button>
          </a-dropdown>
        </div>
        <div>
          <a-button @click="handleAdd" type="primary" icon="plus" style="margin-right: 10px"></a-button>
        </div>
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
          <a-popconfirm title="确定发送吗?" @confirm="() => handleSend(record.id)" v-if="record.sendFlag == 0">
             <a>发送</a>
            </a-popconfirm>
          <a-divider type="vertical" v-if="record.sendFlag == 0"/>
          <a @click="messageDetail(record)">详情</a>
          <a-divider type="vertical" v-if="record.sendFlag == 0"/>
          <a-dropdown v-if="record.sendFlag == 0">
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleEdit(record)">编辑</a>
              </a-menu-item>
                <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <sysMessageMaster-modal ref="modalForm" @ok="modalFormOk"></sysMessageMaster-modal>
    <sys-message-master-detail ref="detailForm"></sys-message-master-detail>
  </a-card>
</template>

<script>
  import SysMessageMasterModal from './modules/SysMessageMasterModal'
  import SysMessageMasterDetail from './modules/SysMessageMasterDetail'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { putAction } from '@/api/manage'

  export default {
    name: "SysMessageMasterList",
    mixins:[JeecgListMixin],
    components: {
      SysMessageMasterModal,SysMessageMasterDetail
    },
    data () {
      return {
        description: '消息主表管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },
          {
            title: '标题',
            align:"center",
            dataIndex: 'title'
          },
          {
            title: '内容',
            align:"center",
            dataIndex: 'content'
          },
          {
            title: '发送类型',
            align:"center",
            dataIndex: 'sendType_dictText'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/message/sysMessageMaster/list",
          delete: "/message/sysMessageMaster/delete",
          deleteBatch: "/message/sysMessageMaster/deleteBatch",
          exportXlsUrl: "message/sysMessageMaster/exportXls",
          importExcelUrl: "message/sysMessageMaster/importExcel",
          send: "/message/sysMessageMaster/edit",
       },
        messageDetail:function(record){
          this.$refs.detailForm.edit(record);
          this.$refs.detailForm.disableSubmit = true;
        },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      handleSend: function (id) {
        var that = this;
        let params = {};
        params.id = id;
        params.sendFlag = '1';
        putAction(this.url.send, params).then((res) => {
          if(res.success){
            that.$message.success("发送成功");
            that.loadData();
          }else{
            that.$message.warning(res.message);
          }
        });
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>