<template>
  <div class="shop-container">
    <h1>宠物商店</h1>
    <p>你的余额: ${{ gameStore.player.money }}</p>

    <div class="category-tabs">
      <button v-for="cat in categories" :key="cat.id" @click="currentCategory = cat.id" :class="{ active: currentCategory === cat.id }">
        {{ cat.name }}
      </button>
    </div>

    <div class="item-list">
      <div v-for="item in filteredItems" :key="item.id" class="item">
        <h3>{{ item.name }}</h3>
        <p>价格: ${{ item.price }}</p>
        <p v-if="item.effects">效果:</p>
        <ul v-if="item.effects">
          <li v-for="(value, key) in item.effects" :key="key">
            {{ key }}: {{ value > 0 ? '+' : '' }}{{ value }}
          </li>
        </ul>
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
  { id: 'toy', name: '玩具' },
  { id: 'necessity', name: '生活用品' },
  { id: 'consumable', name: '消耗品' },
  { id: 'health', name: '医疗保健' },
];

const currentCategory = ref('all');

const filteredItems = computed(() => {
  if (currentCategory.value === 'all') {
    return Object.values(items);
  }
  return Object.values(items).filter(item => item.type === currentCategory.value);
});

</script>

<style scoped>
.shop-container { 
  padding: 20px; 
  text-align: center; 
  background-color: rgba(0,0,0,0.8);
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
}
.item-list { 
  display: flex; 
  gap: 20px; 
  justify-content: center; 
  margin-top: 20px; 
}
.item { 
  border: 1px solid #ccc; 
  padding: 15px; 
  border-radius: 10px; 
  width: 200px;
}
.item ul { list-style: none; padding: 0; }
.close-btn { margin-top: 30px; padding: 10px 20px; }
</style>
