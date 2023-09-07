<script setup lang="ts"></script>

<template>
  <div>
    <div class="type">
      <slot name="type" />
    </div>
    <div class="time">
      <slot name="time" />
    </div>
    <div class="diaryID">
      <slot name="diaryID" />
    </div>
    <div class="content">
      <slot name="content" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.type {
  color: rgba(0, 119, 255, 0.865);
  font-weight: bold;
  padding-left: 10px;
  padding-top: 5px;
  position: relative;
  float: left;
  width: 200px;
}
.time {
  left: 100px;
  top: 5px;
  color: rgba(128, 128, 128, 0.666);
  position: relative;
  float: left;
}

.diaryID {
  color: rgba(128, 128, 128, 0.666);
  top: 5px;
  right: 80px;
  position: relative;
  float: right;
}
.content {
  top: 37px;
  left: -340px;
  position: relative;
}
</style>
