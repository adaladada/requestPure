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
  expands: [],
  pagination: {
    pageSize: 10,
    pageSizes: [5, 10, 20, 50, 100],
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
  const brr = pageData.selectParam.appIdSet;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]["appid"] === pageData.selectForm.appid) {
      pageData.selectParam = {
        appIdSet: brr,
        userIdSet: arr[i]["userid"],
        idSet: arr
      };
    }
  }
}

function getRowKey(row) {
  return row.id;
}

/** 点击行展开/关闭，需要搭配row-key和expand-row-keys使用 */
function clickRowHandle(row) {
  if (pageData.expands.includes(row.id)) {
    pageData.expands.pop(row.id);
  } else {
    pageData.expands.push(row.id);
  }
}

const search = async () => {
  await sendLogs({
    pageSize: pageData.pagination.pageSize,
    pageNum: pageData.pagination.currentPage,
    appid: pageData.selectForm.appid,
    userid: pageData.selectForm.userid,
    content: pageData.message
  }).then(res => {
    const arr = [];
    for (let i = 0; i < res.data.logs.length; i++) {
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
    pageData.message = "";
    pageData.selectForm = {
      appid: "",
      userid: ""
    };
  });
};

// 监听分页器
watch(
  () => [pageData.pagination.pageSize, pageData.pagination.currentPage],
  search,
  { deep: true, immediate: true }
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
  <div>
    <el-card :shadow="'never'">
      <el-form ref="form" :inline="true">
        <el-form-item label="appid:">
          <el-select
            v-model="pageData.selectForm.appid"
            @change="changeSelect()"
          >
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
        :row-key="getRowKey"
        :expand-row-keys="pageData.expands"
        @row-click="clickRowHandle"
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
  </div>
</template>

<style lang="scss" scoped>
.el-input {
  width: 380px;
}

.el-button {
  margin-bottom: 19px;
}
</style>
