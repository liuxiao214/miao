<template>
  <div class="selection-container">
    <h1>选择你的身份</h1>
    <p>你的身份将决定你的初始资源和挑战。</p>
    <div class="selection-grid">
      <button @click="selectCharacter('student')">
        <span class="icon">🧑‍🎓</span>
        <h2>学生党</h2>
        <p>时间充裕，但预算有限。</p>
        <p>初始资金: $500</p>
      </button>
      <button @click="selectCharacter('worker')">
        <span class="icon">🧑‍💻</span>
        <h2>上班族</h2>
        <p>经济独立，但缺少陪伴时间。</p>
        <p>初始资金: $2000</p>
      </button>
      <button @click="selectCharacter('child')">
        <span class="icon">👧</span>
        <h2>小朋友</h2>
        <p>时间超多，但没多少钱。</p>
        <p>初始资金: $100</p>
      </button>
      <button @click="selectCharacter('senior')">
        <span class="icon">👵</span>
        <h2>退休老人</h2>
        <p>时间和金钱都比较均衡。</p>
        <p>初始资金: $1500</p>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../store/game';

const gameStore = useGameStore();

function selectCharacter(type) {
  if (type === 'student') {
    gameStore.player.money = 500;
  } else if (type === 'worker') {
    gameStore.player.money = 2000;
  } else if (type === 'child') {
    gameStore.player.money = 100;
  } else if (type === 'senior') {
    gameStore.player.money = 1500;
  }
  gameStore.setGameState('pet_selection');
}
</script>

<style scoped>
.selection-container {
  text-align: center;
}
.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

button {
  padding: 20px;
  border: 2px solid #555;
  border-radius: 15px;
  background-color: #3c3c3c;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

button:hover {
  transform: translateY(-5px);
  border-color: #777;
}

.icon {
  font-size: 36px;
  display: block;
  margin-bottom: 10px;
}

h2 {
  margin: 0 0 5px 0;
  color: #2ecc71;
}

p {
  margin: 0;
  font-size: 14px;
  color: #ccc;
}
</style>
