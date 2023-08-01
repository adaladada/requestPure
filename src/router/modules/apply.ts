export default {
  path: "/apply",
  redirect: "/apply/index",
  meta: {
    name: "ApplyId",
    icon: "folderUploadLine",
    title: "appid申请",
    rank: 15
  },
  children: [
    {
      path: "/apply/index",
      name: "Apply",
      component: () => import("@/views/apply/index.vue"),
      meta: {
        title: "appid申请"
      }
    }
  ]
} as RouteConfigsTable;
