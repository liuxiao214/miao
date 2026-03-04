<template>
  <div id="app-container">
    <!-- 温馨的背景 -->
    <div class="background-gradient"></div>

    <!-- 角色选择场景 -->
    <CharacterSelection v-if="gameStore.gameState === 'character_selection'" />

    <!-- 宠物选择场景 -->
    <PetSelection v-else-if="gameStore.gameState === 'pet_selection'" />

    <!-- 首次购物场景 -->
    <InitialShopping v-else-if="gameStore.gameState === 'initial_shopping'" />

    <!-- 主游戏场景 -->
    <div v-else-if="gameStore.gameState === 'playing' && gameStore.pet" class="main-game-ui">
      <div class="top-bar">
        <div class="pet-info">
          <h1>{{ gameStore.pet.name }}</h1>
          <span>({{ items[gameStore.pet.breed]?.name || gameStore.pet.breed }})</span>
        </div>
        <div class="game-stats">
          <span>☀️ Day: {{ gameStore.gameTime.day }} | ⏰ {{ gameStore.gameTime.hour }}:00</span>
          <span>💰 ${{ gameStore.player.money }}</span>
        </div>
      </div>

      <div class="status-bars">
        <StatusBar label="❤️ 健康" :value="gameStore.pet.health" />
        <StatusBar label="😊 心情" :value="gameStore.pet.happiness" />
        <StatusBar label="🍲 饱腹" :value="gameStore.pet.hunger" />
        <StatusBar label="⚡️ 精力" :value="gameStore.pet.energy" />
      </div>

      <div class="action-buttons">
        <button @click="openBackpack('food')"><span class="icon">🍖</span>喂食</button>
        <button @click="openBackpack('toy')"><span class="icon">🎾</span>玩耍</button>
        <button @click="openBackpack('health')"><span class="icon">🩹</span>医疗</button>
        <button @click="openBackpack(null)"><span class="icon">🎒</span>背包</button>
        <button @click="gameStore.setGameState('shopping')"><span class="icon">🛒</span>商店</button>
        <button @click="gameStore.reset()" class="reset-btn"><span class="icon">🔄</span>重新开始</button>
      </div>
    </div>

    <!-- 浮层场景 -->
    <div class="modal-overlay" v-if="gameStore.gameState === 'shopping' || gameStore.gameState === 'backpack'">
      <Shop v-if="gameStore.gameState === 'shopping'" />
      <Backpack v-if="gameStore.gameState === 'backpack'" />
    </div>

  </div>
</template>

<script setup>
import { watch } from 'vue';import { useGameStore } from './store/game';
import { items } from './game/config/items'; // 引入物品配置

// Components
import StatusBar from './components/StatusBar.vue';import CharacterSelection from './views/CharacterSelection.vue';
import PetSelection from './views/PetSelection.vue';
import InitialShopping from './views/InitialShopping.vue';
import Shop from './views/Shop.vue';
import Backpack from './views/Backpack.vue';

const gameStore = useGameStore();

// 监听游戏阶段的变化，当进入'playing'阶段时，启动游戏主循环
watch(() => gameStore.gameState, (newState) => {
  if (newState === 'playing') {
    // 每5秒钟，让游戏时间流逝一小时
    // 注意：为了防止重复创建，我们先清除旧的定时器
    if (window.gameLoop) clearInterval(window.gameLoop);
    window.gameLoop = setInterval(() => {
      gameStore.tickHour();
    }, 5000);
  }
});

function openBackpack(filter) {
  gameStore.inventoryFilter = filter;
  gameStore.setGameState('backpack');
}
</script>

<style scoped>
h1 {
  text-align: center;
}

#app-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #F5F5DC; /* 温馨的米色 */
  z-index: -1;
}

.main-game-ui {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  color: #333;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  margin-bottom: 40px;
}

.pet-info h1 {
  margin: 0;
  font-size: 48px;
}
.pet-info span {
  font-size: 18px;
  color: #555;
}

.game-stats {
  text-align: right;
}
.game-stats span {
  display: block;
  font-size: 18px;
  margin-bottom: 5px;
}

.status-bars {
  width: 100%;
  max-width: 800px;
  margin-bottom: 40px;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.action-buttons button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px;
  border: none;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  width: 100px;
}

.action-buttons button:hover {
  transform: translateY(-5px);
  background-color: white;
}

.action-buttons .icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* 让弹窗组件自适应大小 */
.modal-overlay > div {
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  background-color: #2c3e50;
  border-radius: 15px;
  padding: 20px;
}
</style>
