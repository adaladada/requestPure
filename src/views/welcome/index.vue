<script setup lang="ts">
// import { onBeforeMount, reactive } from "vue";
import { reactive } from "vue";
// import message from "@/utils/message";
// import { onMounted } from "vue";
// import { hasAuth } from "@/router/utils";
// import { ref } from "vue";
import { computed } from "vue";
import { PureTable } from "@pureadmin/table";

const pageData: any = reactive({
  formParam: {
    infoForm: {
      msg: ""
    }
  },
  tableParams: {
    mode: "table",
    columns: [
      {
        label: "appid",
        prop: "appid",
        width: "180"
      },
      {
        label: "userid",
        prop: "userid",
        width: "180"
      },
      {
        label: "收到时间",
        prop: "receivedTime",
        width: "180"
      },
      {
        label: "上传时间",
        prop: "reportTime",
        width: "180"
      },
      {
        label: "日志内容",
        prop: "diary"
      }
    ],
    list: [],
    loading: false,
    tableData: [],
    currentData: {},
    pagination: {
      pageSize: 10,
      defaultPageSize: 10,
      currentPage: 1,
      background: true,
      total: 0
    }
  }
});

const getPagination = computed((): any => {
  return pageData.tableParams.mode === "table"
    ? { rowKey: "id", pagination: pageData.tableParams.pagination }
    : {
        rowKey: "id",
        pagination: {
          ...pageData.tableParams.pagination,
          hideOnSinglePage: true
        }
      };
});

defineOptions({
  name: "Welcome"
});
</script>

<template>
  <el-card :shadow="'never'">
    <el-form ref="form" :inline="true">
      <el-form-item label="appid:">
        <el-select />
      </el-form-item>
      <el-form-item label="userid:">
        <el-select />
      </el-form-item>
      <el-form-item label="关键词:">
        <el-input v-model="pageData.formParam.infoForm.msg" />
      </el-form-item>
      <el-button>查询</el-button>
    </el-form>
    <pure-table
      :data="pageData.tableParams.list"
      :columns="pageData.tableParams.columns"
      row-key="id"
      border
      stripe
      :header-row-class-name="'table-header'"
      v-bind="getPagination"
    />
  </el-card>
</template>

<style lang="scss" scoped>
.el-input {
  width: 380px;
}

.el-button {
  margin-bottom: 19px;
}
</style>
