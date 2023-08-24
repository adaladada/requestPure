import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const REGEXP_PWD = /^.{4,50}$/;

const applyRules = reactive(<FormRules>{
  appName: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          console.log("???");
          callback(new Error("请输入appName"));
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error("appName长度应在4-50之间"));
        } else {
          callback();
        }
      },
      trigger: "blur",
      required: true
    }
  ]
});

export { applyRules };
