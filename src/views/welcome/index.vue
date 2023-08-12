<script setup lang="ts">
import { onMounted, watch, reactive, ref } from "vue";
import { PureTable } from "@pureadmin/table";
import { getIdSet, sendLogs } from "@/api/user";
import dayjs from "dayjs";

const pageData: any = reactive({
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
  // tableParams: {
  //   mode: "table",
  //   loading: false
  // },
  pagination: {
    pageSize: 1,
    pageSizes: [1, 5, 10, 20, 50],
    // defaultPageSize: 1,
    currentPage: 1,
    background: true,
    total: 0
  }
});

const dataList = ref([]);

const columns: TableColumnList = [
  {
    type: "expand",
    slot: "expand"
  },
  {
    label: "收到时间",
    prop: "receivedTime",
    width: "160",
    sortable: true
  },
  {
    label: "类型",
    prop: "dataType",
    width: "70"
  },
  {
    label: "日志内容",
    prop: "diary"
  }
];

// const getPagination = computed((): any => {
//   return pageData.tableParams.mode === "table"
//     ? { rowKey: "id", pagination: pageData.pagination }
//     : {
//         rowKey: "id",
//         pagination: {
//           ...pageData.pagination,
//           hideOnSinglePage: true
//         }
//       };
// });

const getSet = async () => {
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
  const arr = pageData.selectParam.idSet;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]["appid"] === pageData.selectForm.appid) {
      pageData.selectParam = {
        userIdSet: arr[i]["userid"]
      };
    }
  }
}

const search = async () => {
  // console.log(pageData.tableParams.pagination.pageSize);
  await sendLogs({
    pageSize: pageData.pagination.pageSize,
    pageNum: pageData.pagination.currentPage,
    appid: pageData.selectForm.appid,
    userid: pageData.selectForm.userid,
    content: pageData.message
  }).then(res => {
    const arr = [];
    for (let i = 0; i < res.data.logs.length; i++) {
      // console.log(res.data.logs[i].timestamp);
      const obj = {
        id: i,
        // 要自己给row加个id，row其实就是search函数里面的obj
        // 它本身是没有id的
        // 不加id的话，点一个行就会所有行都展开，然后关其他行会导致所有行都关不上
        receivedTime: dayjs(res.data.logs[i].timestamp).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        dataType: res.data.logs[i].type,
        diary: res.data.logs[i].msg,
        appid: res.data.logs[i].appid,
        userid: res.data.logs[i].userid,
        path: res.data.logs[i].extra["path"],
        stack: res.data.logs[i].extra["stack"],
        userAgent: res.data.logs[i].extra["userAgent"]
      };
      arr.push(obj);
    }
    dataList.value = arr;
    pageData.pagination.total = res.data.total;
    // pageData.pagination = {
    //   pageSize: pageData.pagination.pageSize,
    //   defaultPageSize: pageData.pagination.defaultPageSize,
    //   currentPage: pageData.pagination.currentPage,
    //   background: pageData.pagination.background,
    //   total: num
    // };
    // pageData.tableData = {
    //   dataList: arr
    // };
    // console.log(pageData.tableData.dataList);
  });
};

watch(
  () => [pageData.pagination.pageSize, pageData.pagination.currentPage],
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
  getSet();
});

defineOptions({
  name: "Welcome"
});
</script>

<template>
  <el-card :shadow="'never'">
    <el-form ref="form" :inline="true">
      <el-form-item label="appid:">
        <el-select v-model="pageData.selectForm.appid" @change="changeSelect()">
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
      :columns="columns"
      :data="dataList"
      border
      stripe
      :pagination="pageData.pagination"
    >
      <template #expand="{ row }">
        <div class="m-4">
          <p class="mb-2">appid: {{ row.appid }}</p>
          <p class="mb-2">userid: {{ row.userid }}</p>
          <p class="mb-2">path: {{ row.path }}</p>
          <p class="mb-2">stack: {{ row.stack }}</p>
          <p class="mb-2">userAgent: {{ row.userAgent }}</p>
        </div>
      </template>
    </pure-table>
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
