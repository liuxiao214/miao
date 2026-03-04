<template>
  <div class="backpack-container">
    <h1>我的背包</h1>
    
    <div class="category-tabs">
      <button v-for="cat in categories" :key="cat.id" @click="currentCategory = cat.id" :class="{ active: currentCategory === cat.id }">
        {{ cat.name }}
      </button>
    </div>

    <div v-if="filteredItems.length > 0" class="item-grid">
      <div v-for="itemInstance in filteredItems" :key="itemInstance.instanceId" class="item-card">
        <h4>{{ items[itemInstance.itemId].name }}</h4>
        
        <!-- 显示耐久度或使用次数 -->
        <div v-if="itemInstance.durability !== undefined" class="usage-info">
          耐久: {{ itemInstance.durability }} / {{ items[itemInstance.itemId].durability }}
        </div>
        <div v-if="itemInstance.uses !== undefined" class="usage-info">
          剩余: {{ itemInstance.uses }} / {{ items[itemInstance.itemId].uses }}
        </div>

        <button @click="gameStore.useItem(itemInstance.instanceId)" :disabled="!isUsable(items[itemInstance.itemId])">
          使用
        </button>
      </div>
    </div>
    <div v-else class="empty-message">
      <p>你还没有这类物品，快去商店看看吧！</p>
    </div>
    <button @click="closeBackpack" class="close-btn">关闭背包</button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useGameStore } from '../store/game';
import { useInventoryStore } from '../store/inventory';
import { items } from '../game/config/items';

const gameStore = useGameStore();
const inventoryStore = useInventoryStore();

const categories = [
  { id: 'all', name: '全部' },
  { id: 'food', name: '食物' },
  { id: 'toy', name: '玩具' },
  { id: 'health', name: '医疗保健' },
  { id: 'consumable', name: '消耗品' },
  { id: 'necessity', name: '生活用品' },
];

const currentCategory = ref(gameStore.inventoryFilter || 'all');

watch(() => gameStore.inventoryFilter, (newFilter) => {
  currentCategory.value = newFilter || 'all';
});

const filteredItems = computed(() => {
  return inventoryStore.items.filter(itemInstance => {
    const itemConfig = items[itemInstance.itemId];
    return currentCategory.value === 'all' || itemConfig.type === currentCategory.value;
  });
});

function isUsable(itemConfig) {
  return ['food', 'toy', 'health'].includes(itemConfig.type);
}

function closeBackpack() {
  gameStore.inventoryFilter = null;
  gameStore.setGameState('playing');
}
</script>

<style scoped>
.backpack-container { 
  padding: 20px; 
  text-align: center; 
  background-color: rgba(0,0,0,0.9);
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
}
.category-tabs { margin-bottom: 20px; }
.item-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 20px; }
.item-card { border: 1px solid #444; padding: 10px; border-radius: 8px; display: flex; flex-direction: column; justify-content: space-between; }
.usage-info { font-size: 12px; color: #aaa; margin: 5px 0; }
.empty-message { margin-top: 40px; font-style: italic; color: #888; }
.close-btn { margin-top: 30px; padding: 10px 20px; }
</style>
