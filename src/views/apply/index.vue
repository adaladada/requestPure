<script setup lang="ts">
import { reactive } from "vue";
import { getAppid } from "@/api/user";
import { message } from "@/utils/message";

defineOptions({
  name: "Apply"
});

const pageData: any = reactive({
  formParam: {
    appName: "",
    appid: "",
    dialogVisible: false
  },
  rules: {
    appName: [
      {
        required: true,
        message: "请输入appName",
        trigger: "blur"
      },
      {
        min: 4,
        max: 50,
        message: "长度在4到50个字符之间",
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

const applyID = async () => {
  // appname长度4-50
  await getAppid({
    appName: pageData.formParam.appName
  }).then(res => {
    if (res.code === "00000") {
      // message("appid申请成功", { type: "success" });
      pageData.formParam = {
        appName: pageData.formParam.appName,
        appid: res.data.appid,
        dialogVisible: true
      };
    } else {
      message(res.msg, { type: "error" });
    }
  });
};
</script>

<template>
  <div>
    <el-form ref="form" :model="pageData.formParam" :rules="pageData.rules">
      <el-form-item label="appid申请:" prop="appName">
        <el-col :span="8">
          <el-input
            placeholder="请输入appName"
            v-model="pageData.formParam.appName"
          />
        </el-col>
        <el-button @click="applyID()">申请</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="申请成功" :model-value="pageData.formParam.dialogVisible">
      <div class="tips">
        为
        {{ pageData.formParam.appName }} 申请的appid:
        {{ pageData.formParam.appid }}
      </div>
      <!-- <br /> -->
      <div class="submit">
        <el-button @click="pageData.formParam = { dialogVisible: false }">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.el-button {
  margin-left: 15px;
}
.el-form {
  padding-top: 15px;
  padding-left: 10px;
}

.tips {
  font-size: 20px;
  // color: red;
}
.submit {
  padding-top: 30px;
}
</style>
