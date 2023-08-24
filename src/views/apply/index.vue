<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { getAppid } from "@/api/user";
import { message } from "@/utils/message";
import type { FormInstance } from "element-plus";
import { applyRules } from "./utils/rule";

defineOptions({
  name: "Apply"
});

const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  appName: "",
  appid: ""
});

const dialogVisible = ref(false);

const apply = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log(valid);
      applyID();
    } else {
      return fields;
    }
  });
};

function close() {
  dialogVisible.value = false;
  ruleForm.appName = "";
}

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    apply(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});

const applyID = async () => {
  // appname长度4-50
  await getAppid({
    appName: ruleForm.appName
  }).then(res => {
    if (res.code === "00000") {
      // message("appid申请成功", { type: "success" });
      ruleForm.appid = res.data.appid;
      dialogVisible.value = true;
    } else {
      message(res.msg, { type: "error" });
    }
  });
};
</script>

<template>
  <div>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="applyRules">
      <el-form-item label="appid申请:" prop="appName">
        <el-col :span="8">
          <el-input
            placeholder="请输入appName"
            v-model="ruleForm.appName"
            clearable
          />
        </el-col>
        <el-button @click="apply(ruleFormRef)">申请</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="申请成功" v-model="dialogVisible">
      <!-- :visible="dialogVisible"不行 -->
      <div class="tips">
        为
        {{ ruleForm.appName }} 申请的appid:
        {{ ruleForm.appid }}
      </div>
      <div class="submit">
        <el-button @click="close"> 确认 </el-button>
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
.el-dialog {
  width: 300px;
  height: 200px;
}
</style>
