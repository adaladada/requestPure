<script setup lang="ts">
import { ref, watch, reactive, onMounted } from "vue";
import Card from "@/components/Card/index.vue";
import dayjs from "dayjs";
import { getIdSet, sendLogs } from "@/api/user";

defineOptions({
  name: "Welcome"
});

const pageData: any = reactive({
  message: "",
  selectForm: {
    // appid: "EdmBr03B",
    appid: "",
    // userid: "abc"
    userid: ""
  },
  selectParam: {
    appIdSet: [],
    userIdSet: [],
    idSet: []
  }
});

const map = new Map([
  [0, "log信息"],
  [1, "js错误"]
]);

// 判断是否滑到底，滑到底为true
const isBusy = ref(false);
// 判断是否空页面
const isEmpty = ref(true);
// 数据列表
const dataList = ref([]);
// 目前所在的页数
const page = ref(1);
// 每页展示的条数
const pageSize = 20;
// 判断是否展开
const expand = ref(-1);

const scrollHandle = e => {
  const clientHeight = e.target.clientHeight;
  // 内容可视区域的高度
  const scrollHeight = e.target.scrollHeight;
  // 内容可视区域的高度加上溢出（滚动）的距离
  const scrollTop = e.target.scrollTop;
  // 滚动条中y轴上的滚动距离
  const distance = Math.abs(scrollHeight - scrollTop - clientHeight);
  // console.log(distance);
  if (Math.floor(distance) === 0) {
    console.log(page.value);
    isBusy.value = true;
    // dataList.value = [...dataList.value, ...extra];
    getLog();
    page.value++;
    // isBusy.value = false;
  } else {
    isBusy.value = false;
  }
};

const getLog = async () => {
  await sendLogs({
    pageSize: pageSize,
    pageNum: page.value,
    appid: pageData.selectForm.appid,
    userid: pageData.selectForm.userid,
    content: pageData.message
  }).then(res => {
    const arr = [];
    for (let i = 0; i < res.data.logs.length; i++) {
      let val = res.data.logs[i].msg;
      val = val.replace(
        pageData.message,
        // `<span class='hightlight'>${pageData.message}</span>`
        `<font color="red">${pageData.message}</font>`
        // 原来是要用反引号
      );
      const obj = {
        id: i + 1 + pageSize * (page.value - 1),
        receivedTime: dayjs(res.data.logs[i].timestamp).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        dataType: map.get(res.data.logs[i].type),
        // diary: res.data.logs[i].msg
        diary: val,
        appid: res.data.logs[i].appid,
        userid: res.data.logs[i].userid,
        path: res.data.logs[i].extra["path"],
        stack: res.data.logs[i].extra["stack"],
        userAgent: res.data.logs[i].extra["userAgent"]
      };
      arr.push(obj);
    }
    // isBusy.value = false;
    dataList.value = [...dataList.value, ...arr];
    isBusy.value = false;
    // console.log(dataList.value);
    // pageData.pagination.total = res.data.total;
  });
};

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
        userIdSet: pageData.selectParam.userIdSet,
        idSet: arr
      };
    }
  });
};

function changeSelect() {
  const arr = pageData.selectParam.idSet;
  const brr = pageData.selectParam.appIdSet;
  // console.log(brr);
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

const search = () => {
  dataList.value = [];
  page.value = 1;
  getLog();
};

// 监听搜索框和两个下拉框
watch(
  () => [
    pageData.selectForm.appid,
    pageData.selectForm.userid,
    pageData.message
  ],
  () => {
    if (!pageData.selectForm.appid || !pageData.selectForm.userid) {
      dataList.value = [];
      page.value = 1;
    } else if (pageData.selectForm.appid && pageData.selectForm.userid) {
      isEmpty.value = false;
      search();
    }
  }
);

const popup = async item => {
  // expand.value = !expand.value;
  if (expand.value === item.id) {
    expand.value = -1;
    return;
  }
  expand.value = item.id;
  // maxHeight.value = 300;
};

onMounted(() => {
  isEmpty.value = true;
  getSet();
});
</script>

<template>
  <el-card :shadow="'never'">
    <el-form ref="form" :inline="true">
      <el-form-item label="appid:">
        <el-select
          v-model="pageData.selectForm.appid"
          @change="changeSelect()"
          clearable
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
        <el-select v-model="pageData.selectForm.userid" clearable>
          <el-option
            v-for="(item, index) in pageData.selectParam.userIdSet"
            :key="index"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关键词:">
        <el-input
          placeholder="请输入想要查询的关键词"
          v-model="pageData.message"
          clearable
        />
      </el-form-item>
      <!-- <el-button @click="search">清空条件</el-button> -->
    </el-form>
    <div
      class="container"
      ref="container"
      @scroll="scrollHandle"
      v-if="dataList.length > 0"
    >
      <div
        class="content"
        v-for="item in dataList"
        :key="item.id"
        @click="popup(item)"
      >
        <!-- <div style="width: 100%; height: 1rem">{{ item }}</div> -->
        <Card>
          <template #type> 日志类型: {{ item.dataType }} </template>
          <template #time>
            {{ item.receivedTime }}
          </template>
          <template #diaryID> 日志id:{{ item.id }} </template>
          <template #content>
            <!-- {{ item.diary }} -->
            <span v-html="item.diary" />
          </template>
        </Card>
        <div v-show="expand === item.id" class="extra">
          <div class="extraContent">
            <p>appid: {{ item.appid }}</p>
            <p>userid: {{ item.userid }}</p>
            <p>path: {{ item.path }}</p>
            <p>stack: {{ item.stack }}</p>
            <p>userAgent: {{ item.userAgent }}</p>
          </div>
        </div>
      </div>
      <div class="loading" v-show="isBusy">loading...</div>
    </div>
    <el-empty
      v-else-if="
        (!pageData.selectForm.appid && pageData.selectForm.userid) ||
        (pageData.selectForm.appid && !pageData.selectForm.userid)
      "
      description="要选完两个id才能查看哦~\(≧▽≦)/~"
    />
    <el-empty
      v-else-if="
        pageData.selectForm.appid &&
        pageData.selectForm.userid &&
        pageData.message &&
        dataList.length === 0
      "
      description="啊嘞嘞没有查询到结果呢O^O"
    />
    <el-empty
      v-else-if="
        !pageData.selectForm.appid &&
        !pageData.selectForm.userid &&
        pageData.message
      "
      description="emmm...先选好appid和userid再来查询吧ヾ(❀╹◡╹)ﾉﾞ❀~"
    />
    <el-empty
      v-else-if="
        !pageData.selectForm.appid &&
        !pageData.selectForm.userid &&
        !pageData.message
      "
      description="哎呀, 还什么都么有O_<~"
    />
  </el-card>
</template>

<style lang="scss" scoped>
.container {
  height: 500px;
  width: 1150px;
  margin: 0 auto;
  overflow: auto;
}
.content {
  border: 1px solid rgba(128, 128, 128, 0.272);
  border-radius: 5px;
  width: 100%;
  margin: 0 auto 8.1px auto;
  min-height: 80px;
}
.extra {
  width: 100%;
  margin: 0 auto;
  min-height: 120px;
  overflow: hidden;
  transition: max-height 1s ease-out;
  position: relative;
  float: top;
  top: 50px;
  margin-bottom: 55px;
}
.extraContent {
  padding-left: 12px;
}
.el-input {
  width: 380px;
}
.el-button {
  margin-bottom: 19px;
}
.el-card {
  height: 550px;
}
.hightlight {
  font-weight: bold;
  background-color: yellow;
}
</style>
