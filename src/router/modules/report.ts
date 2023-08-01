export default {
  path: "/report",
  redirect: "/report/index",
  meta: {
    name: "ReportDiary",
    icon: "folderUploadLine",
    title: "下发日志上报",
    rank: 20
  },
  children: [
    {
      path: "/report/index",
      name: "Report",
      component: () => import("@/views/report/index.vue"),
      meta: {
        title: "下发日志上报"
      }
    }
  ]
} as RouteConfigsTable;
