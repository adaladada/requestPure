<script setup lang="ts">
import { reactive } from "vue";
defineOptions({
  name: "Apply"
});

const pageData: any = reactive({
  formParam: {
    appid: ""
  }
});
</script>

<template>
  <el-form ref="formParam" :model="pageData.formParam">
    <el-form-item
      label="appid申请:"
      prop="appid"
      :rules="[{ required: true, message: 'appName不能为空', trigger: 'blur' }]"
    >
      <el-col :span="8">
        <el-input
          placeholder="请输入appName"
          v-model="pageData.formParam.appid"
        />
      </el-col>
      <el-button>申请</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.el-button {
  margin-left: 15px;
}
</style>
