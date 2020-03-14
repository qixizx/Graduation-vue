<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="专业名称">
              <a-input placeholder="请输入专业名称" v-model="queryParam.major"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="所属院系">
<!--              <a-input placeholder="请输入所属院系" v-model="queryParam.facultyId"></a-input>-->
              <j-dict-select-tag v-model="queryParam.facultyId"
                                 placeholder="请输入所属院系"
                                 dict-code="yd_faculty_info,faculty,id,del_flag = '0'">
              </j-dict-select-tag>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
<!--        <a-col :md="6" :sm="8">
            <a-form-item label="专业描述">
              <a-input placeholder="请输入专业描述" v-model="queryParam.recommend"></a-input>
            </a-form-item>
          </a-col>-->
<!--          <a-col :md="6" :sm="8">
            <a-form-item label="删除状态（0，正常，
1已删除）">
              <a-input placeholder="请输入删除状态（0，正常，
1已删除）" v-model="queryParam.delFlag"></a-input>
            </a-form-item>
          </a-col>-->
          </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
<!--              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('专业信息表')">导出</a-button>
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
                <a href="javascript:;" @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <router-link :to="{path:'./YdClassInfoList',query:{id:record.id}}">查看班级</router-link>
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
    <ydMajorInfo-modal ref="modalForm" @ok="modalFormOk"></ydMajorInfo-modal>
  </a-card>
</template>

<script>
  import YdMajorInfoModal from './modules/YdMajorInfoModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'
  export default {
    name: "YdMajorInfoList",
    mixins:[JeecgListMixin],
    components: {
      YdMajorInfoModal
    },
    data () {
      return {
        description: '专业信息表管理页面',
        // 表头
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
            title: '专业名称',
            align:"center",
            width:200,
            dataIndex: 'major'
           },
		   {
            title: '所属院系',
            align:"center",
            width:160,
            dataIndex: 'faculty'
           },
		   {
            title: '专业描述',
            align:"center",
            dataIndex: 'recommend'
           },
/*		   {
            title: '删除状态（0，正常，1已删除）',
            align:"center",
            dataIndex: 'delFlag'
           },*/
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:120,
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/graduation/ydMajorInfo/list",
          delete: "/graduation/ydMajorInfo/delete",
          deleteBatch: "/graduation/ydMajorInfo/deleteBatch",
          exportXlsUrl: "graduation/ydMajorInfo/exportXls",
          importExcelUrl: "graduation/ydMajorInfo/importExcel",
       },
     queryParam:{
       major:'',
       facultyId:'',
      }
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    created () {
      if(this.$route.query.id!='' && this.$route.query.id !=undefined){
        this.queryParam.facultyId=this.$route.query.id;
      }
    },
    methods: {
      searchReset() {
        this.queryParam = {}
        this.loadData(1);
      },
      loadData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        if(this.$route.query.id!='' && this.$route.query.id !=undefined){
          this.queryParam.facultyId=this.$route.query.id;
          this.$route.query.id='';
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>