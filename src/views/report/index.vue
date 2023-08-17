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
      message("上报成功", { type: "success" });
      pageData.formParam.appid = "";
      pageData.formParam.userid = "";
    } else {
      message(res.msg, { type: "error" });
    }
  });
};
</script>

<template>
  <div>
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
  </div>
</template>

<style lang="scss" scoped></style>
