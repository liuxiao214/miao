<template>
  <div class="modal-content-wrapper">
    <h1>宠物商店</h1>
    <p>你的余额: ¥{{ gameStore.player.money }}</p>

    <div class="category-tabs">
      <button v-for="cat in categories" :key="cat.id" @click="currentCategory = cat.id" :class="`category-${cat.id}`">
        {{ cat.name }}
      </button>
    </div>

    <div class="item-grid">
      <div v-for="item in filteredItems" :key="item.id" :class="['item-card', `item-type-${item.type}`]">
        <h4>{{ item.name }}</h4>
        <p class="price">价格: ¥{{ item.price }}</p>
        <div v-if="item.effects" class="effects">
          <p>效果:</p>
          <ul>
            <li v-for="(value, key) in item.effects" :key="key">
              {{ key }}: {{ value > 0 ? '+' : '' }}{{ value }}
            </li>
          </ul>
        </div>
        <button @click="gameStore.buyItem(item.id)">购买</button>
      </div>
    </div>
    <button @click="gameStore.setGameState('playing')" class="close-btn">关闭商店</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGameStore } from '../store/game';
import { items } from '../game/config/items';

const gameStore = useGameStore();

const categories = [
  { id: 'all', name: '全部' },
  { id: 'food', name: '食物' },
  { id: 'toy', name: '情感陪伴' },
  { id: 'health', name: '医疗保健' },
  { id: 'cleaning', name: '清洁护理' },
  { id: 'maintenance', name: '环境维护' },
  { id: 'necessity', name: '生活用品' },
];

const currentCategory = ref('all');

const filteredItems = computed(() => {
  if (currentCategory.value === 'all') {
    return Object.values(items);
  } else if (currentCategory.value === 'cleaning') {
    return Object.values(items).filter(item => item.type === 'cleaning');
  } else if (currentCategory.value === 'maintenance') {
    return Object.values(items).filter(item => item.type === 'maintenance');
  } else {
    return Object.values(items).filter(item => item.type === currentCategory.value);
  }
});

</script>

<style scoped>
.modal-content-wrapper {
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 249, 230, 0.9);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  color: #333;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.item-grid {
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  margin-top: 20px;
  padding-right: 10px;
}

/* 自定义滚动条 */
.item-grid::-webkit-scrollbar {
  width: 8px;
}

.item-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.item-grid::-webkit-scrollbar-thumb {
  background: #D4B996;
  border-radius: 10px;
}

.item-grid::-webkit-scrollbar-thumb:hover {
  background: #8B4513;
}

h1 {
  color: #8B4513;
  margin-bottom: 20px;
}

.category-tabs {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.category-tabs button {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.category-tabs button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* 分类标签颜色 */
.category-tabs button[class*="category-"] {
  color: white;
}

.category-tabs button.category-all {
  background-color: #8B4513;
}

.category-tabs button.category-all:hover {
  background-color: #6B340D;
}

.category-tabs button.category-food {
  background-color: #FF6B6B;
}

.category-tabs button.category-food:hover {
  background-color: #FF5252;
}

.category-tabs button.category-toy {
  background-color: #4ECDC4;
}

.category-tabs button.category-toy:hover {
  background-color: #3DBEB4;
}

.category-tabs button.category-health {
  background-color: #45B7D1;
}

.category-tabs button.category-health:hover {
  background-color: #35A7C1;
}

.category-tabs button.category-consumable {
  background-color: #96CEB4;
}

.category-tabs button.category-consumable:hover {
  background-color: #86BEA4;
}

.category-tabs button.category-necessity {
  background-color: #FFEAA7;
  color: #333;
}

.category-tabs button.category-necessity:hover {
  background-color: #FFDC77;
}

.category-tabs button.category-cleaning {
  background-color: #FF9FF3;
}

.category-tabs button.category-cleaning:hover {
  background-color: #FF85E6;
}

.category-tabs button.category-maintenance {
  background-color: #54A0FF;
}

.category-tabs button.category-maintenance:hover {
  background-color: #3D8BFF;
}

.item-card {
  border: 1px solid #E8D5B7;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;
  background-color: white;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.item-card h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.price {
  font-weight: bold;
  color: #8B4513;
  margin: 10px 0;
}

.effects {
  margin: 10px 0;
  font-size: 14px;
}

.effects p {
  margin: 0 0 5px 0;
  font-weight: 500;
}

.effects ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.effects li {
  margin: 2px 0;
  font-size: 12px;
  color: #666;
}

.close-btn {
  margin-top: 30px;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: #8B4513;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #6B340D;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background-color: #E8D5B7;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
}

button:hover {
  background-color: #D4B996;
}

/* 不同物品分类的颜色 */
.item-type-food {
  border-left: 4px solid #FF6B6B;
}

.item-type-toy {
  border-left: 4px solid #4ECDC4;
}

.item-type-health {
  border-left: 4px solid #45B7D1;
}

.item-type-consumable {
  border-left: 4px solid #96CEB4;
}

.item-type-necessity {
  border-left: 4px solid #FFEAA7;
}

.item-type-cleaning {
  border-left: 4px solid #FF9FF3;
}

.item-type-maintenance {
  border-left: 4px solid #54A0FF;
}
</style>
