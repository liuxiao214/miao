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

      <!-- 嵌套Grid布局的统计区域 -->
      <div class="stats-section">
        <!-- 今日互动总结：占左侧整列 -->
        <div class="stat-card intimacy-section">
          <div class="intimacy-score">
            <h3>💕 今日互动总结</h3>
            <div class="intimacy-value">{{ getDailyIntimacy() }}/100</div>
          </div>
          <div class="daily-summary">
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
        
        <!-- 右侧列：包含成本数据和适配度 -->
        <div class="right-column">
          <!-- 成本数据 -->
          <div class="stat-card cost-stats">
            <h3 style="font-size: 16px; margin: 0 0 10px 0; color: #8B4513; font-weight: bold;">💰 成本数据</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">今日/本月支出</div>
                <div class="stat-value">¥{{ gameStore.dailyExpenses }}/{{ gameStore.monthlyExpenses }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">时间投入</div>
                <div class="stat-value">{{ gameStore.timeInvestment }}分钟</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">月度预算</div>
                <div class="stat-value">¥{{ gameStore.monthlyBudget }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">预算使用率</div>
                <div class="stat-value">{{ gameStore.budgetUsageRate }}%</div>
              </div>
            </div>
          </div>
          
          <!-- 适配度 -->
          <div class="stat-card compatibility-stats">
            <div class="compatibility-header">
              <h3 style="font-size: 16px; margin: 0; color: #8B4513; font-weight: bold;">👫 适配度</h3>
              <div class="compatibility-score">
                <StatusBar label="" :value="gameStore.compatibility" />
              </div>
            </div>
            <div class="compatibility-description">
              {{ getCompatibilityDescription() }}
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="openBackpack('food')"><span class="icon">🍖</span>饮食管理</button>
        <button @click="openBackpack('toy')"><span class="icon">🎾</span>情感陪伴</button>
        <button @click="openBackpack('health')"><span class="icon">🩹</span>健康检测</button>
        <button @click="openBackpack('cleaning')"><span class="icon">🧹</span>清洁护理</button>
        <button @click="openBackpack('maintenance')"><span class="icon">🏠</span>环境维护</button>
        <button @click="openBackpack(null)"><span class="icon">🎒</span>背包</button>
        <button @click="gameStore.setGameState('shopping')"><span class="icon">🛒</span>商店</button>
        <button @click="gameStore.reset()" class="reset-btn"><span class="icon">🔄</span>重新开始</button>
      </div>
    </div>

    <!-- 浮层场景 -->
    <div class="app-modal-overlay" v-if="(gameStore.gameState === 'shopping' || gameStore.gameState === 'backpack') && gameStore.pet">
      <Shop v-if="gameStore.gameState === 'shopping'" />
      <Backpack v-if="gameStore.gameState === 'backpack'" />
    </div>

    <!-- 事件窗口 -->
    <EventModal 
      v-if="gameStore.gameState === 'event' && gameStore.currentEvent" 
      :event="gameStore.currentEvent" 
      @close="gameStore.closeEvent()" 
    />

  </div>
</template>

<script setup>
import { watch } from 'vue';import { useGameStore } from './store/game';
import { items } from './game/config/items'; // 引入物品配置

// Components
import StatusBar from './components/StatusBar.vue';
import EventModal from './components/EventModal.vue';
import CharacterSelection from './views/CharacterSelection.vue';
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

// 获取适配度描述
function getCompatibilityDescription() {
  const score = gameStore.compatibility;
  if (score >= 90) {
    return '你们是最佳搭档，宠物对你无比信任和依赖！';
  } else if (score >= 70) {
    return '宠物非常喜欢你，你们之间有着良好的默契。';
  } else if (score >= 50) {
    return '你们之间关系一般，需要更多互动来增进感情。';
  } else if (score >= 30) {
    return '宠物对你们的关系感到有些疏远，需要更多关心。';
  } else {
    return '宠物与你关系紧张，需要认真反思自己的养宠方式。';
  }
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

/* 移除重复的每日总结样式定义，使用最新的样式 */

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
  margin-top: 10px;
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

.app-modal-overlay {
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

.app-modal-overlay > div {
    pointer-events: auto;
    border-radius: 15px;
    width: 70%;
    max-width: 600px;
    max-height: 80vh;
    opacity: 1;
    overflow-y: auto;
  }
  
  /* 统计区域整体样式：嵌套Grid布局 */
  .stats-section {
    width: 100%;
    max-width: 850px;
    margin-bottom: 15px;
    display: grid;
    grid-template-columns: 440px 20px 350px; /* 增加间隙列 */
    gap: 15px;
  }
  
  /* 所有统计卡片的基础样式 */
  .stat-card {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  /* 右侧列：垂直排列成本数据和适配度 */
  .right-column {
    grid-column: 3;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  /* 今日互动总结：占左侧整列 */
  .intimacy-section {
    grid-column: 1;
    height: 240px; /* 设置固定高度，不再随内容变化 */
    overflow-y: auto;
    padding: 10px !important;
    display: flex;
    flex-direction: column;
  }
  
  /* 成本数据：右侧列顶部 */
  .cost-stats {
    height: auto;
    min-height: 120px;
    padding: 8px !important;
    overflow-y: visible;
  }
  
  /* 适配度：右侧列底部 */
  .compatibility-stats {
    height: 90px;
    padding: 10px !important;
    overflow-y: auto;
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
    font-size: 16px;
  }
  
  .intimacy-value {
    font-size: 18px;
    font-weight: bold;
    color: #8B4513;
  }
  
  .daily-summary {
    background-color: white;
    border-radius: 10px;
    padding: 8px;
    border: 1px solid #E8D5B7;
    max-height: 180px;
    overflow-y: auto;
    margin-top: 8px;
    flex: 1;
    line-height: 1.4;
  }
  
  .daily-summary h4 {
    margin: 0 0 10px 0;
    color: #8B4513;
    font-size: 16px;
    font-weight: bold;
    text-align: left;
  }
  
  .daily-summary ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .daily-summary li {
    padding: 5px 0;
    border-bottom: 1px solid #E8D5B7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }
  
  .daily-summary li:last-child {
    border-bottom: none;
  }
  
  .daily-summary .interaction-time {
    font-size: 11px;
    color: #999;
    white-space: nowrap;
  }
  
  /* 成本数据区域调整 */
  .cost-stats {
    padding: 12px !important;
  }
  
  .cost-stats .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  
  .cost-stats .stat-item {
    padding: 6px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.7);
    line-height: 1.1;
  }
  
  .cost-stats .stat-label {
    font-size: 12px;
    color: #8B4513;
    margin-bottom: 1px;
    font-weight: bold;
  }
  
  .cost-stats .stat-value {
    font-size: 16px;
    color: #5D4037;
    font-weight: bold;
  }
  
  .cost-stats .stat-unit {
    font-size: 10px;
  }
  
  /* 成本数据中预算使用率样式 */
  .cost-stats .stat-item:nth-child(4) .stat-value {
    color: #FF8C00;
  }
  
  /* 适配度区域调整 */
  .compatibility-stats {
    padding: 10px !important;
    height: 90px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  
  /* 适配度标题与进度条同一行 */
  .compatibility-header {
    display: flex;
    align-items: left;
    gap: 2px;
    margin-bottom: 1px;
    width: 100%;
  }
  
  .compatibility-header h3 {
    white-space: nowrap;
    margin: 0;
    font-size: 14px;
  }
  
  .compatibility-score {
    flex: 1;
    margin: 0;
    width: 0; /* 强制压缩以适应flex布局 */
  }

  .compatibility-score .status-bar-container {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  .compatibility-score .status-bar-container .label {
    display: none;
  }
  
  .compatibility-score .status-bar-container .value-text {
    font-size: 16px;
    color: #5D4037;
    font-weight: bold;
  }
  
  .compatibility-score .status-bar-container .bar-wrapper {
    margin: 0 5px;
    flex: 1;
    height: 8px;
  }
  
  .compatibility-description {
    font-size: 10px;
    padding: 2px;
    margin-top: 2px;
    text-align: center;
    color: #5D4037;
    line-height: 1.0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 确保成本数据区域能显示所有内容 */
  .cost-stats .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  
  .cost-stats .stat-item {
    padding: 6px;
  }
  
  .cost-stats .stat-label {
    margin-bottom: 2px;
  }
  
  /* 移除重复样式定义 */
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .stat-item {
    background-color: white;
    border-radius: 15px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .stat-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
  }
  
  .stat-value {
    font-size: 16px;
    font-weight: bold;
    color: #8B4513;
  }
  
  .budget-usage {
    grid-column: 1 / -1;
    position: relative;
  }
  
  .budget-usage .stat-label {
    margin-bottom: 8px;
  }
  
  .progress-bar {
    width: 100%;
    height: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 4px;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #8B4513;
    border-radius: 5px;
    transition: width 0.3s ease;
  }
  
  .usage-text {
    font-size: 12px;
    color: #8B4513;
    font-weight: bold;
  }
  
  .compatibility-score {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .compatibility-score .status-bar-container {
    margin-bottom: 10px;
  }
  
  .compatibility-description {
    font-size: 12px;
    color: #666;
    text-align: center;
    line-height: 1.4;
  }
  
  /* 响应式设计 */
  @media (max-width: 1024px) {
    /* 在中等屏幕上，切换为单列布局 */
    .stats-section {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
    }
    
    .intimacy-section {
      grid-column: auto;
    }
    
    .right-column {
      grid-column: auto;
      flex-direction: row;
      flex-wrap: wrap;
    }
    
    .cost-stats,
    .compatibility-stats {
      flex: 1;
      min-width: 250px;
      height: auto;
      max-height: 200px;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    
    .stat-item {
      padding: 10px;
    }
    
    .stat-value {
      font-size: 14px;
    }
    
    .intimacy-value {
      font-size: 20px;
    }
    
    .daily-summary {
      max-height: 150px;
    }
  }
</style>
