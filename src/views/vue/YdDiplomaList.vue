<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="选题id">
              <a-input placeholder="请输入选题id" v-model="queryParam.subjectId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="开题报告id">
              <a-input placeholder="请输入开题报告id" v-model="queryParam.reportId"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="任务书id">
              <a-input placeholder="请输入任务书id" v-model="queryParam.assignmentId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="论文id">
              <a-input placeholder="请输入论文id" v-model="queryParam.thesisId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="用户id">
              <a-input placeholder="请输入用户id" v-model="queryParam.userId"></a-input>
            </a-form-item>
          </a-col>
          </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('毕业设计表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
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
    <ydDiploma-modal ref="modalForm" @ok="modalFormOk"></ydDiploma-modal>
  </a-card>
</template>

<script>
  import YdDiplomaModal from './modules/YdDiplomaModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "YdDiplomaList",
    mixins:[JeecgListMixin],
    components: {
      YdDiplomaModal
    },
    data () {
      return {
        description: '毕业设计表管理页面',
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
            title: '选题id',
            align:"center",
            dataIndex: 'subjectId'
           },
		   {
            title: '开题报告id',
            align:"center",
            dataIndex: 'reportId'
           },
		   {
            title: '任务书id',
            align:"center",
            dataIndex: 'assignmentId'
           },
		   {
            title: '论文id',
            align:"center",
            dataIndex: 'thesisId'
           },
		   {
            title: '用户id',
            align:"center",
            dataIndex: 'userId'
           },
		   {
            title: '成绩',
            align:"center",
            dataIndex: 'grade'
           },
		   {
            title: '0未通过 1 已通过 2优秀生',
            align:"center",
            dataIndex: 'isPass'
           },
		   {
            title: '删除状态（0，正常，1已删除）',
            align:"center",
            dataIndex: 'delFlag'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/graduation/ydDiploma/list",
          delete: "/graduation/ydDiploma/delete",
          deleteBatch: "/graduation/ydDiploma/deleteBatch",
          exportXlsUrl: "graduation/ydDiploma/exportXls",
          importExcelUrl: "graduation/ydDiploma/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
     
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>