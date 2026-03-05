<template>
  <div class="selection-container">
    <!-- 身份选择界面 -->
    <div v-if="currentStep === 'identity'" class="identity-page">
      <h1>选择你的身份</h1>
      <p>你的身份将决定你的初始资源和挑战。</p>
      
      <div class="identity-selection">
        <div class="identity-row">
          <button 
            v-for="identity in identities" 
            :key="identity.type"
            @click="selectCharacter(identity.type)"
            :class="{ selected: selectedCharacter === identity.type }"
          >
            <span class="icon">{{ identity.icon }}</span>
            <h2>{{ identity.name }}</h2>
            <p>{{ identity.description }}</p>
            <p>初始资金: ¥{{ identity.money }}</p>
          </button>
        </div>
      </div>
      
      <div class="action-buttons" style="justify-content: center;">
        <button @click="nextStep" class="confirm-btn" :disabled="!selectedCharacter">下一步</button>
      </div>
    </div>
    
    <!-- 条件选择界面 -->
    <div v-else-if="currentStep === 'conditions'" class="conditions-page">
      <h1>完善你的养宠条件</h1>
      <p>请根据你的实际情况选择以下条件。</p>
      
      <div class="form">
        <!-- 居住条件 -->
        <h3>居住条件</h3>
        <div class="condition-row">
          <div class="option-group">
            <label>住房类型:</label>
            <div class="options">
              <button @click="conditions.housingType = 'rental'" :class="{ selected: conditions.housingType === 'rental' }">租房</button>
              <button @click="conditions.housingType = 'own'" :class="{ selected: conditions.housingType === 'own' }">自有房</button>
            </div>
          </div>
          <div class="option-group">
            <label>面积大小:</label>
            <div class="options">
              <button @click="conditions.houseSize = 'small'" :class="{ selected: conditions.houseSize === 'small' }">小户型</button>
              <button @click="conditions.houseSize = 'medium'" :class="{ selected: conditions.houseSize === 'medium' }">中等户型</button>
              <button @click="conditions.houseSize = 'large'" :class="{ selected: conditions.houseSize === 'large' }">大户型</button>
            </div>
          </div>
          <div class="option-group">
            <label>是否允许养宠:</label>
            <div class="options">
              <button @click="conditions.petAllowed = true" :class="{ selected: conditions.petAllowed === true }">是</button>
              <button @click="conditions.petAllowed = false" :class="{ selected: conditions.petAllowed === false }">否</button>
            </div>
          </div>
        </div>
        
        <!-- 时间投入 -->
        <h3>时间投入</h3>
        <div class="condition-row">
          <div class="option-group">
            <label>每日可陪伴时长:</label>
            <div class="options">
              <button @click="conditions.dailyTime = 'low'" :class="{ selected: conditions.dailyTime === 'low' }">少于2小时</button>
              <button @click="conditions.dailyTime = 'medium'" :class="{ selected: conditions.dailyTime === 'medium' }">2-4小时</button>
              <button @click="conditions.dailyTime = 'high'" :class="{ selected: conditions.dailyTime === 'high' }">4小时以上</button>
            </div>
          </div>
          <div class="option-group">
            <label>周末是否在家:</label>
            <div class="options">
              <button @click="conditions.weekendAtHome = true" :class="{ selected: conditions.weekendAtHome === true }">是</button>
              <button @click="conditions.weekendAtHome = false" :class="{ selected: conditions.weekendAtHome === false }">否</button>
            </div>
          </div>
          <div class="option-group">
            <label>是否需要经常性出差:</label>
            <div class="options">
              <button @click="conditions.frequentTravel = true" :class="{ selected: conditions.frequentTravel === true }">是</button>
              <button @click="conditions.frequentTravel = false" :class="{ selected: conditions.frequentTravel === false }">否</button>
            </div>
          </div>
        </div>
        
        <!-- 经济预算 -->
        <h3>经济预算</h3>
        <div class="condition-row">
          <div class="option-group">
            <label>月均养宠支出预算:</label>
            <div class="options">
              <button @click="conditions.budget = 'low'" :class="{ selected: conditions.budget === 'low' }">少于¥500</button>
              <button @click="conditions.budget = 'medium'" :class="{ selected: conditions.budget === 'medium' }">¥500-1000</button>
              <button @click="conditions.budget = 'high'" :class="{ selected: conditions.budget === 'high' }">¥1000以上</button>
            </div>
          </div>
        </div>
        
        <!-- 家庭环境 -->
        <h3>家庭环境</h3>
        <div class="condition-row">
          <div class="option-group">
            <label>家庭成员:</label>
            <div class="options">
              <button @click="toggleFamilyMember('none')" :class="{ selected: conditions.familyMembers.includes('none') }">无</button>
              <button @click="toggleFamilyMember('children')" :class="{ selected: conditions.familyMembers.includes('children') }">有孩子</button>
              <button @click="toggleFamilyMember('elderly')" :class="{ selected: conditions.familyMembers.includes('elderly') }">有老人</button>
              <button @click="toggleFamilyMember('otherPets')" :class="{ selected: conditions.familyMembers.includes('otherPets') }">有其他宠物</button>
              <button @click="toggleFamilyMember('other')" :class="{ selected: conditions.familyMembers.includes('other') }">其他</button>
            </div>
          </div>
        </div>
        
      </div>
      <div class="action-buttons">
        <button @click="prevStep" class="back-btn">上一步</button>
        <button @click="completeSelection" class="confirm-btn">下一步</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useGameStore } from '../store/game';

const gameStore = useGameStore();
const selectedCharacter = ref(null);
// 检查localStorage中的状态，确保从领养界面返回时回到条件选择界面
const savedStep = localStorage.getItem('characterSelectionStep');
const currentStep = ref(savedStep || 'identity'); // identity 或 conditions
// 清除保存的状态
localStorage.removeItem('characterSelectionStep');
const conditions = ref({
  housingType: 'rental',
  houseSize: 'medium',
  petAllowed: true,
  dailyTime: 'medium',
  weekendAtHome: true,
  frequentTravel: false,
  budget: 'medium',
  familyMembers: []
});

function nextStep() {
  if (selectedCharacter.value) {
    currentStep.value = 'conditions';
  }
}

function prevStep() {
  currentStep.value = 'identity';
}

const identities = [
  {
    type: 'student',
    name: '学生党',
    description: '时间充裕，但预算有限。',
    money: 500,
    icon: '🧑‍🎓'
  },
  {
    type: 'worker',
    name: '上班族',
    description: '经济独立，但缺少陪伴时间。',
    money: 2000,
    icon: '🧑‍💻'
  },
  {
    type: 'child',
    name: '小朋友',
    description: '时间超多，但没多少钱。',
    money: 100,
    icon: '👧'
  },
  {
    type: 'senior',
    name: '退休老人',
    description: '时间和金钱都比较均衡。',
    money: 1500,
    icon: '👵'
  },
  {
    type: 'freelancer',
    name: '自由职业者',
    description: '时间灵活，收入不稳定。',
    money: 1200,
    icon: '💼'
  }
];

function selectCharacter(type) {
  selectedCharacter.value = type;
  const identity = identities.find(id => id.type === type);
  if (identity) {
    gameStore.player.money = identity.money;
  }
}

function toggleFamilyMember(member) {
  const index = conditions.value.familyMembers.indexOf(member);
  if (index > -1) {
    conditions.value.familyMembers.splice(index, 1);
  } else {
    conditions.value.familyMembers.push(member);
  }
}

function completeSelection() {
  // 保存条件到游戏状态
  gameStore.player.conditions = conditions.value;
  gameStore.player.characterType = selectedCharacter.value;
  gameStore.setGameState('pet_selection');
}
</script>

<style scoped>
.selection-container {
  text-align: center;
  min-height: 100vh;
  padding: 30px 20px;
  overflow-y: auto;
  box-sizing: border-box;
  background: linear-gradient(135deg, #fff9e6 0%, #f5e6d3 100%);
}

/* 确保整个页面可以滚动 */
html, body {
  height: 100%;
  margin: 0;
  overflow-y: auto;
  background: linear-gradient(135deg, #fff9e6 0%, #f5e6d3 100%);
}

/* 修复滚动问题 */
.selection-container {
  position: relative;
  z-index: 1;
}

.selection-container h1 {
  color: #8B4513;
  margin-bottom: 10px;
  font-size: 32px;
}

.selection-container > p {
  margin-bottom: 30px;
  color: #666;
  font-size: 16px;
}

/* 身份选择样式 */
.identity-selection {
  margin-bottom: 10px;
}

.identity-row {
  display: flex;
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
  flex-wrap: wrap;
  justify-content: center;
}

.identity-row button {
  flex: 1;
  min-width: 150px;
  max-width: 200px;
  padding: 15px;
  border: 2px solid #E8D5B7;
  border-radius: 15px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 0 5px;
}

.identity-row button:hover {
  transform: translateY(-5px);
  border-color: #8B4513;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.identity-row button.selected {
  background-color: #F5E6D3;
  border-color: #8B4513;
  font-weight: bold;
}

.icon {
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
}

.identity-row h2 {
  margin: 0 0 5px 0;
  color: #8B4513;
  font-size: 18px;
}

.identity-row p {
  margin: 3px 0;
  font-size: 12px;
  color: #666;
}

.identity-row p:last-child {
  font-weight: bold;
  color: #8B4513;
  margin-top: 8px;
}

/* 条件选择界面样式 */
.conditions-page {
  text-align: center;
  padding: 10px 10px 30px;
  box-sizing: border-box;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.conditions-page h1 {
  color: #8B4513;
  margin-bottom: 10px;
  font-size: 32px;
}

.conditions-page p {
  margin-bottom: 30px;
  color: #666;
  font-size: 16px;
}

.conditions-page .action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 100%;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

.form {
  display: inline-flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
  max-width: 600px;
  width: 100%;
}

/* 自定义滚动条 */
.form::-webkit-scrollbar {
  width: 8px;
}

.form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.form::-webkit-scrollbar-thumb {
  background: #E8D5B7;
  border-radius: 10px;
}

.form::-webkit-scrollbar-thumb:hover {
  background: #8B4513;
}

.form h3 {
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: 16px;
  color: #8B4513;
  border-bottom: 2px solid #E8D5B7;
  padding-bottom: 5px;
  text-align: left;
}

.condition-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 15px;
  justify-content: flex-start;
}

.option-group {
  flex: 1;
  min-width: 200px;
  text-align: left;
}

.option-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #333;
  font-size: 16px;
  text-align: left;
}

.options {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;
}

.options button {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: #E8D5B7;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #333;
}

.options button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #D4B996;
}

.options button.selected {
  background-color: #8B4513;
  color: white;
  box-shadow: 0 4px 8px rgba(139, 69, 19, 0.3);
}

.back-btn {
  padding: 12px 20px;
  border: 2px solid #E8D5B7;
  border-radius: 15px;
  background-color: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 16px;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back-btn:hover {
  transform: translateY(-5px);
  border-color: #8B4513;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  background-color: #F5E6D3;
}

.confirm-btn {
  padding: 12px 20px;
  border: 2px solid #E8D5B7;
  border-radius: 15px;
  background-color: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 16px;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.identity-page .confirm-btn {
  margin-top: 30px;
}

.confirm-btn:hover {
  transform: translateY(-5px);
  border-color: #8B4513;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  background-color: #F5E6D3;
}

.confirm-btn:disabled {
  background-color: #E8D5B7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  color: #666;
  border-color: #E8D5B7;
}
</style>
