<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <!-- 主表单区域 -->
      <a-form :form="form">
        <a-row>
          <a-col :span="12" :gutter="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="name">
              <a-input placeholder="请输入name" v-decorator="['name', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" :gutter="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="address">
              <a-input placeholder="请输入address" v-decorator="['address', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12" :gutter="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="level">
              <a-input placeholder="请输入level" v-decorator="['level', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" :gutter="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="nick">
              <a-input placeholder="请输入nick" v-decorator="['nick', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="客户订单" :key="refKeys[0]" :forceRender="true">
          <j-editable-table
            :ref="refKeys[0]"
            :loading="tpsoftOrderTable.loading"
            :columns="tpsoftOrderTable.columns"
            :dataSource="tpsoftOrderTable.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"/>
        </a-tab-pane>
      </a-tabs>

    </a-spin>
  </a-modal>
</template>

<script>

  import moment from 'moment'
  import pick from 'lodash.pick'
  import { FormTypes } from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'

  export default {
    name: 'TpsoftCustomerModal',
    mixins: [JEditableTableMixin],
    data() {
      return {
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
        },
        refKeys: ['tpsoftOrder', ],
        activeKey: 'tpsoftOrder',
        // 客戶訂單
        tpsoftOrderTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: 'orderCode',
              key: 'orderCode',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: 'orderName',
              key: 'orderName',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: 'orderNumber',
              key: 'orderNumber',
              type: FormTypes.inputNumber,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: 'customerId',
              key: 'customerId',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
          ]
        },
        url: {
          add: "/demo/tpsoftCustomer/add",
          edit: "/demo/tpsoftCustomer/edit",
          tpsoftOrder: {
            list: '/demo/tpsoftCustomer/queryTpsoftOrderByMainId'
          },
        }
      }
    },
    methods: {
 
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'name', 'address', 'level', 'nick', ))
          // 时间格式化
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.tpsoftOrder.list, params, this.tpsoftOrderTable)
        }
      },
 
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        //时间格式化
        return {
          ...main, // 展开
          tpsoftOrderList: allValues.tablesValue[0].values,
        }
      }
    }
  }
</script>

<style scoped>
</style>