<script setup lang="ts">
// import { onBeforeMount, reactive } from "vue";
// import message from "@/utils/message";
// import { onMounted } from "vue";
// import { hasAuth } from "@/router/utils";
// import { ref } from "vue";
import { computed, onMounted, watch, reactive } from "vue";
import { PureTable } from "@pureadmin/table";
import { getIdSet, sendLogs } from "@/api/user";
// import { func } from "vue-types";
// import { getIdSet } from "@/api/user";

const pageData: any = reactive({
  // formParam: {
  //   infoForm: {
  //     msg: ""
  //   }
  // },
  // 检索关键词
  message: "",
  selectForm: {
    appid: "",
    userid: ""
  },
  selectParam: {
    appIdSet: [],
    userIdSet: [],
    idSet: []
  },
  tableParams: {
    mode: "table",
    columns: [
      {
        label: "收到时间",
        prop: "receivedTime",
        width: "120"
      },
      {
        label: "类型",
        prop: "type",
        width: "120"
      },
      {
        label: "日志内容",
        prop: "diary"
      },
      {
        label: "appid",
        prop: "appid",
        width: "120"
      },
      {
        label: "userid",
        prop: "userid",
        width: "120"
      }
    ],
    loading: false,
    tableData: [],
    pagination: {
      pageSize: 10,
      defaultPageSize: 10,
      currentPage: 1,
      background: true,
      total: 1000
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

const _loadData = async () => {
  await getIdSet().then(res => {
    if (res.code === "00000") {
      const arr = res.data.idArray;
      // 获取所有的appid
      const appArr = [];
      for (let i = 0; i < arr.length; i++) {
        appArr.push(arr[i]["appid"]);
      }
      pageData.selectParam = {
        appIdSet: appArr,
        idSet: arr
      };
    }
  });
};

function changeSelect() {
  for (const item in pageData.selectParam.idSet) {
    if (item["appid"] === pageData.selectForm.appid) {
      pageData.selectParam.userid = item["userid"];
    }
  }
}

// function handleSizeChange(val) {
//   // console.log(pageData.tableParams.pagination.pageSize);
//   // pageData.pagination.pageSize = val;
// }

// function handleCurrentPage(val) {
//   // pageData.pagination.currentPage = val;
// }

const search = async () => {
  await sendLogs({
    pageSize: pageData.tableParams.pagination.pageSize,
    pageNum: pageData.tableParams.pagination.currentPage,
    appid: pageData.selectForm.appid,
    userid: pageData.selectForm.userid,
    content: pageData.message
  }).then(res => {
    console.log(typeof res.data);
  });
};

watch(
  () => [
    pageData.tableParams.pagination.pageSize,
    pageData.tableParams.pagination.currentPage
  ],
  search,
  { deep: true, immediate: true }
  // async () => {
  //   console.log(
  //     pageData.tableParams.pagination.pageSize,
  //     pageData.tableParams.pagination.currentPage
  //   );
  //   await sendLogs({
  //     // pageSize: newPageSize,
  //     pageSize: 1,
  //     // pageNum: newCurrentPage,
  //     pageNum: 1,
  //     appid: pageData.selectForm.appid,
  //     // appid: "eDlpdZMY",
  //     userid: pageData.selectForm.userid,
  //     content: pageData.message
  //   }).then(res => {
  //     if (res.code === "00000") {
  //       console.log(typeof res.data);
  //     }
  //   });
  // },
  // 看来是因为第二个参数没写对才报错的
  // { deep: true, immediate: true }
  // async function handler(
  //   [newPageSize, newCurrentPage],
  //   [oldPageSize, oldCurrentPage]
  // ) {
  //   // console.log(typeof newPageSize);
  //   await sendLogs({
  //     // pageSize: newPageSize,
  //     pageSize: 1,
  //     // pageNum: newCurrentPage,
  //     pageNum: 1,
  //     appid: pageData.selectForm.appid,
  //     // appid: "eDlpdZMY",
  //     userid: pageData.selectForm.userid,
  //     content: pageData.message
  //   }).then(res => {
  //     if (res.code === "00000") {
  //       console.log(typeof res.data);
  //       // pageData.tableParams = {
  //       //   tableData: res.data.logs
  //       // };
  //       // pageData.tableParams.pagination = {
  //       //   total: res.data.total
  //       // };
  //     }
  //   });
  // },
  // {
  //   immediate: true
  // }
);

onMounted(() => {
  _loadData();
});

defineOptions({
  name: "Welcome"
});
</script>

<template>
  <el-card :shadow="'never'">
    <el-form ref="form" :inline="true">
      <el-form-item label="appid:">
        <el-select v-model="pageData.selectForm.appid" @change="changeSelect">
          <el-option
            v-for="(item, index) in pageData.selectParam.appIdSet"
            :key="index"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="userid:">
        <el-select v-model="pageData.selectForm.userid">
          <el-option
            v-for="(item, index) in pageData.selectParam.userIdSet"
            :key="index"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关键词:">
        <el-input v-model="pageData.message" />
      </el-form-item>
      <el-button @click="search()">查询</el-button>
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
