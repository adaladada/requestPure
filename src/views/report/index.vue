<script setup lang="ts">
import { reactive } from "vue";
defineOptions({
  name: "Report"
});
const pageData: any = reactive({
  formParam: {
    userid: "",
    appid: ""
  },
  // ruleForm: {
  //   userRule: "",
  //   appRule: ""
  // },
  rules: {
    userid: [
      {
        required: true,
        message: "userid不能为空",
        trigger: "blur"
      }
    ],
    appid: [
      {
        required: true,
        message: "appid不能为空",
        trigger: "blur"
      }
    ]
  }
});
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
      <el-button>上报</el-button>
    </el-form-item>
  </el-form>
</template>
