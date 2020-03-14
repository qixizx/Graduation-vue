<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :span="6">
            <a-form-item label="标题">
              <a-input placeholder="请输入标题" v-model="queryParam.titile"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="8">
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
          <a @click="handleEdit(record)" v-if="record.sendStatus == 0">编辑</a>

               <a-divider type="vertical" v-if="record.sendStatus == 0"/>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-if="record.sendStatus == 0">
                  <a>删除</a>
                </a-popconfirm>
                <a-divider type="vertical" v-if="record.sendStatus == 0"/>
                <a-popconfirm title="确定发布吗?" @confirm="() => releaseData(record.id)" v-if="record.sendStatus == 0">
                  <a>发布</a>
                </a-popconfirm>
                <a-popconfirm title="确定撤销吗?" @confirm="() => reovkeData(record.id)" v-if="record.sendStatus == 1">
                  <a>撤销</a>
                </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <sysAnnouncement-modal ref="modalForm" @ok="modalFormOk"></sysAnnouncement-modal>
  </a-card>
</template>

<script>
  import SysAnnouncementModal from './modules/SysAnnouncementModal'
  import {doReleaseData, doReovkeData} from '@/api/api'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "SysAnnouncementList",
    mixins: [JeecgListMixin],
    components: {
      SysAnnouncementModal
    },
    data() {
      return {
        description: '系统通告表管理页面',
        // 查询条件
        queryParam: {},
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },

          {
            title: '标题',
            align: "center",
            dataIndex: 'titile'
          },
          {
            title: '消息类型',
            align: "center",
            dataIndex: 'msgCategory',
            customRender: function (text) {
              if (text == '1') {
                return "通知公告";
              } else if (text == "2") {
                return "系统消息";
              } else {
                return text;
              }
            }
          },
          {
            title: '优先级',
            align: "center",
            dataIndex: 'priority',
            customRender: function (text) {
              if (text == 'L') {
                return "低";
              } else if (text == "M") {
                return "中";
              } else if (text == "H") {
                return "高";
              } else {
                return text;
              }
            }
          },
          {
            title: '通告对象',
            align: "center",
            dataIndex: 'msgType',
            customRender: function (text) {
              if (text == 'USER') {
                return "指定用户";
              } else if (text == "ALL") {
                return "全体用户";
              } else {
                return text;
              }
            }
          },
          {
            title: '发布状态',
            align: "center",
            dataIndex: 'sendStatus',
            customRender: function (text) {
              if (text == 0) {
                return "未发布";
              } else if (text == 1) {
                return "已发布";
              } else if (text == 2) {
                return "已撤销";
              } else {
                return text;
              }
            }
          },
          {
            title: '发布时间',
            align: "center",
            dataIndex: 'sendTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/sys/annountCement/list",
          delete: "/sys/annountCement/delete",
          deleteBatch: "/sys/annountCement/deleteBatch",
          releaseDataUrl: "/sys/annountCement/doReleaseData",
          reovkeDataUrl: "sys/annountCement/doReovkeData",
          exportXlsUrl: "sys/annountCement/exportXls",
          importExcelUrl: "sys/annountCement/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      //执行发布操作
      releaseData: function (id) {
        console.log(id);
        var that = this;
        doReleaseData({id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData(1);
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      //执行撤销操作
      reovkeData: function (id) {
        var that = this;
        doReovkeData({id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData(1);
          } else {
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