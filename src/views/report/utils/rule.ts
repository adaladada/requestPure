import type { FormRules } from "element-plus";
import { reactive } from "vue";

export const reportRules = reactive(<FormRules>{
  appid: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("appid不能为空"));
        } else {
          callback();
        }
      },
      required: true,
      trigger: "blur"
    }
  ],
  userid: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("userid不能为空"));
        } else {
          callback();
        }
      },
      required: true,
      trigger: "blur"
    }
  ]
});
