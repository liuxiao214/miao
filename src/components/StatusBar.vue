<template>
  <div class="status-bar-container">
    <span class="label">{{ label }}</span>
    <div class="bar-wrapper">
      <div class="bar-value" :style="{ width: barWidth, backgroundColor: barColor }"></div>
    </div>
    <span class="value-text">{{ value.toFixed(0) }} / {{ max }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: String,
  value: Number,
  max: { type: Number, default: 100 },
});

const barWidth = computed(() => `${(props.value / props.max) * 100}%`);

// 根据数值改变颜色
const barColor = computed(() => {
  const percentage = props.value / props.max;
  if (percentage < 0.2) return '#e74c3c'; // red
  if (percentage < 0.5) return '#f1c40f'; // yellow
  return '#2ecc71'; // green
});
</script>

<style scoped>
.status-bar-container {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.label {
  width: 80px;
  font-weight: bold;
}
.bar-wrapper {
  flex-grow: 1;
  height: 20px;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
}
.bar-value {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}
.value-text {
  width: 80px;
  text-align: right;
}
</style>
