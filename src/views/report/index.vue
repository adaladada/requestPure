<script setup lang="ts">
import { reactive } from "vue";
import { reportAppUser } from "@/api/user";
import { message } from "@/utils/message";
defineOptions({
  name: "Report"
});
const pageData: any = reactive({
  formParam: {
    userid: "",
    appid: "",
    dialogVisible: false
  },
  rules: {
    userid: [
      {
        required: true,
        message: "userid不能为空",
        trigger: "blur"
      },
      {
        message: "不能只输入空格",
        whitespace: true,
        trigger: "blur"
      }
    ],
    appid: [
      {
        required: true,
        message: "appid不能为空",
        trigger: "blur"
      },
      {
        message: "不能只输入空格",
        whitespace: true,
        trigger: "blur"
      }
    ]
  }
});

const reportActively = async () => {
  await reportAppUser({
    appid: pageData.formParam.appid,
    userid: pageData.formParam.userid
  }).then(res => {
    if (res.code === "00000") {
      // pageData.formParam = {
      //   appid: pageData.formParam.appid,
      //   userid: pageData.formParam.userid,
      //   dialogVisible: true
      // };
      message("上报成功", { type: "success" });
    } else if (res.code === "A0108") {
      message("appid不存在", { type: "error" });
    }
  });
};
</script>

<template>
  <el-form
    ref="pageData.formParam"
    label-width="80px"
    :model="pageData.formParam"
    :rules="pageData.rules"
  >
    <el-form-item label="appid:" prop="appid">
      <el-col :span="6">
        <el-input
          placeholder="请输入appid"
          v-model="pageData.formParam.appid"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="userid:" prop="userid">
      <el-col :span="6">
        <el-input
          placeholder="请输入userid"
          v-model="pageData.formParam.userid"
        />
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button @click="reportActively()">上报</el-button>
    </el-form-item>
  </el-form>
  <!-- <el-dialog title="上报成功" :model-value="pageData.formParam.dialogVisible">
    <div class="tips">上报成功</div>
  </el-dialog> -->
  <!-- <div>
    <ReDialog v-model="pageData.formParam.dialogVisible"> fff </ReDialog>
  </div> -->
</template>

<style lang="scss" scoped>
.tips {
  font-size: 20px;
}
</style>
