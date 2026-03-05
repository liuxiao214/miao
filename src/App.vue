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
    <div v-if="(gameStore.gameState === 'playing' || gameStore.gameState === 'shopping' || gameStore.gameState === 'backpack') && gameStore.pet" class="main-game-ui">
      <div class="top-bar">
        <div class="pet-info">
          <h1>{{ gameStore.pet.name }}</h1>
          <span>({{ items[gameStore.pet.breed]?.name || gameStore.pet.breed }})</span>
        </div>
        <div class="game-stats">
          <span>☀️ Day: {{ gameStore.gameTime.day }} | ⏰ {{ gameStore.gameTime.hour }}:00</span>
          <span>💰 ¥{{ gameStore.player.money }}</span>
        </div>
      </div>

      <div class="status-bars">
        <StatusBar label="❤️ 健康" :value="gameStore.pet.health" />
        <StatusBar label="😊 心情" :value="gameStore.pet.happiness" />
        <StatusBar label="🍲 饱腹" :value="gameStore.pet.hunger" />
        <StatusBar label="⚡️ 精力" :value="gameStore.pet.energy" />
        <StatusBar label="💕 亲密度" :value="gameStore.pet.intimacy" />
      </div>

      <div class="intimacy-section">
        <div class="intimacy-score">
          <h3>今日亲密度</h3>
          <div class="intimacy-value">{{ getDailyIntimacy() }}/100</div>
        </div>
        <div class="daily-summary">
          <h4>今日互动总结</h4>
          <ul>
            <li v-for="(interaction, index) in getDailyInteractions()" :key="index">
              <span>{{ interaction.name }} +{{ interaction.intimacy }}</span>
              <span class="interaction-time">{{ interaction.hour }}:00</span>
            </li>
            <li v-if="getDailyInteractions().length === 0">
              暂无互动记录
            </li>
          </ul>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="openBackpack('food')"><span class="icon">🍖</span>饮食管理</button>
        <button @click="openBackpack('toy')"><span class="icon">🎾</span>玩耍</button>
        <button @click="openBackpack('health')"><span class="icon">🩹</span>健康检测</button>
        <button @click="openBackpack('cleaning')"><span class="icon">🧹</span>清洁护理</button>
        <button @click="openBackpack('maintenance')"><span class="icon">🏠</span>环境维护</button>
        <button @click="openBackpack(null)"><span class="icon">🎒</span>背包</button>
        <button @click="gameStore.setGameState('shopping')"><span class="icon">🛒</span>商店</button>
        <button @click="gameStore.reset()" class="reset-btn"><span class="icon">🔄</span>重新开始</button>
      </div>
    </div>

    <!-- 浮层场景 -->
    <div class="modal-overlay" v-if="(gameStore.gameState === 'shopping' || gameStore.gameState === 'backpack') && gameStore.pet">
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

// 获取每日亲密度
function getDailyIntimacy() {
  return gameStore.dailyInteractions.reduce((total, interaction) => total + interaction.intimacy, 0);
}

// 获取每日互动记录
function getDailyInteractions() {
  return gameStore.dailyInteractions;
}
</script>

<style scoped>
h1 {
  text-align: center;
}

#app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: auto;
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
  justify-content: flex-start;
  height: 100%;
  padding: 40px 20px 20px;
  color: #333; /* 确保主界面文字是深色 */
}

.top-bar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
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
  margin-bottom: 30px;
}

.intimacy-section {
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.intimacy-score {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.intimacy-score h3 {
  margin: 0;
  color: #8B4513;
}

.intimacy-value {
  font-size: 24px;
  font-weight: bold;
  color: #8B4513;
}

.daily-summary {
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  border: 1px solid #E8D5B7;
  max-height: 150px;
  overflow-y: auto;
  min-height: 80px;
  height: 150px;
}

.daily-summary h4 {
  margin: 0 0 10px 0;
  color: #8B4513;
}

.daily-summary ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.daily-summary li {
  padding: 8px 0;
  border-bottom: 1px solid #E8D5B7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.daily-summary li:last-child {
  border-bottom: none;
}

.daily-summary .interaction-time {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-buttons button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px;
  border: none;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  width: 100px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .action-buttons {
    gap: 10px;
  }
  
  .action-buttons button {
    padding: 12px 16px;
    font-size: 14px;
    width: 80px;
  }
  
  .action-buttons .icon {
    font-size: 24px;
    margin-bottom: 6px;
  }
  
  .pet-info {
    flex-direction: column;
    align-items: center;
  }
  
  .pet-stats {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 15px;
  }
  
  .stat-item {
    margin: 0;
  }
  
  .daily-summary {
    max-width: 100%;
  }
}

.action-buttons button:hover {
  transform: translateY(-5px);
  background-color: white;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.action-buttons .icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.main-game-ui {
  position: relative;
  z-index: 1;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 10;
  backdrop-filter: none;
  pointer-events: none;
  padding-top: 50px;
}

.modal-overlay > div {
  pointer-events: auto;
  border-radius: 15px;
  width: 70%;
  max-width: 600px;
  max-height: 80vh;
  opacity: 1;
  overflow-y: auto;
}
</style>
