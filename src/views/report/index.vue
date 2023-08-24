<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { reportAppUser } from "@/api/user";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import { reportRules } from "./utils/rule";
defineOptions({
  name: "Report"
});

const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  userid: "",
  appid: ""
});

const report = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      reportActively();
    } else {
      return fields;
    }
  });
};

const reportActively = async () => {
  await reportAppUser({
    appid: ruleForm.appid,
    userid: ruleForm.userid
  }).then(res => {
    if (res.code === "00000") {
      message("上报成功", { type: "success" });
      ruleForm.appid = "";
      ruleForm.userid = "";
    } else {
      if (res.code === "A0108") {
        message(res.msg, { type: "error" });
      } else {
        message("上报失败", { type: "error" });
      }
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    report(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div>
    <el-form
      ref="ruleFormRef"
      label-width="80px"
      :model="ruleForm"
      :rules="reportRules"
    >
      <el-form-item label="appid:" prop="appid">
        <el-col :span="6">
          <el-input
            placeholder="请输入appid"
            v-model="ruleForm.appid"
            clearable
          />
        </el-col>
      </el-form-item>
      <el-form-item label="userid:" prop="userid">
        <el-col :span="6">
          <el-input
            placeholder="请输入userid"
            v-model="ruleForm.userid"
            clearable
          />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button @click="report(ruleFormRef)">上报</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped></style>
