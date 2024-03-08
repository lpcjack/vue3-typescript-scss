<template>
    <el-popover trigger="focus" :width="256">
        <template #reference>
            <!-- 使用图标代替按钮 -->
            <el-button  v-model="props" class="background"></el-button>
        </template>
        <div  class="el-icon-picker">
            <!-- 遍历显示表情图标 -->
            <span v-for="emoji in emojiArr[0].iconArr" :key="emoji.icon" @click="selectIcon(emoji.icon)">
                {{ emoji.icon }}
            </span>
        </div>
    </el-popover>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, ref} from 'vue';

// 导入表情数据
import { emojiArr } from "../assets-others/emojidata.ts";

const props = defineProps({
    modelValue: String // 接收一个 v-model
})

const emits = defineEmits(['update:modelValue', 'select-icon']);

// 选中表情的方法
const selectIcon = (emoji: string) => {
    emits('update:modelValue', emoji); // 通过 v-model 将选中的表情传递给父组件
    emits('select-icon', emoji); // 发出 select-icon 事件，父组件可以监听并处理
}

const close = ref(true)
const onclose = () => {
    close.value = !close.value
}
</script>

<style scoped>
.el-icon-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}
.el-icon-picker span {
    cursor: pointer;
}
.background{
    background: url("@/assets/image/theme/home/svg/smile.svg") center;
    background-size: contain;
    border-radius: 15px;
    cursor: pointer;
}
.background:hover{
    color: #3A434A;
}
</style>

