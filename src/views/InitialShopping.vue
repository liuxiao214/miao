<template>
  <div class="initial-shopping-container">
    <div class="main-panel">
      <h1>首次物资置办</h1>
      <p>在把新伙伴带回家之前，请为它准备好所有必需品！</p>
      
      <div class="category-tabs">
        <button v-for="cat in categories" :key="cat.id" @click="currentCategory = cat.id" :class="{ active: currentCategory === cat.id }">
          {{ cat.name }}
        </button>
      </div>

      <div class="item-grid">
        <div v-for="item in availableItems" :key="item.id" class="item-card">
          <label :for="item.id">{{ item.name }}</label>
          <span>价格: ${{ item.price }}</span>
          <div class="quantity-control">
            <button @click="updateQuantity(item.id, -1)">-</button>
            <input type="number" :id="item.id" v-model.number="cart[item.id]" min="0">
            <button @click="updateQuantity(item.id, 1)">+</button>
          </div>
        </div>
      </div>
    </div>

    <div class="cart-panel">
      <h2>我的购物车</h2>
      <div class="cart-items">
        <div v-for="(quantity, itemId) in finalCart" :key="itemId" class="cart-item">
          <span>{{ items[itemId].name }} x {{ quantity }}</span>
          <span>${{ items[itemId].price * quantity }}</span>
        </div>
      </div>
      <div class="summary">
        <h3>总计: ${{ totalCost }}</h3>
        <p>余额: ${{ gameStore.player.money }}</p>
        <button @click="completeShopping" :disabled="totalCost > gameStore.player.money">完成置办</button>
        <p v-if="totalCost > gameStore.player.money" class="error">余额不足！</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGameStore } from '../store/game';
import { items } from '../game/config/items';

const gameStore = useGameStore();

const categories = [
  { id: 'all', name: '全部必需品' },
  { id: 'food', name: '食物' },
  { id: 'necessity', name: '生活用品' },
  { id: 'consumable', name: '消耗品' },
  { id: 'health', name: '医疗保健' },
  { id: 'toy', name: '玩具' },
];
const currentCategory = ref('all');

const essentialItems = Object.values(items).filter(item => item.essential);

const availableItems = computed(() => {
  if (currentCategory.value === 'all') {
    return essentialItems;
  }
  return essentialItems.filter(item => item.type === currentCategory.value);
});

const cart = ref({});
essentialItems.forEach(item => { cart.value[item.id] = 1; });

function updateQuantity(itemId, change) {
  const currentQuantity = cart.value[itemId] || 0;
  if (currentQuantity + change >= 0) {
    cart.value[itemId] = currentQuantity + change;
  }
}

const finalCart = computed(() => {
  return Object.fromEntries(
    Object.entries(cart.value).filter(([_, quantity]) => quantity > 0)
  );
});

const totalCost = computed(() => {
  return Object.entries(finalCart.value).reduce((total, [itemId, quantity]) => {
    return total + (items[itemId].price * quantity);
  }, 0);
});

function completeShopping() {
  gameStore.completeInitialShopping(finalCart.value, totalCost.value);
}
</script>

<style scoped>
.initial-shopping-container { display: flex; height: 100vh; }
.main-panel { flex-grow: 1; padding: 20px; overflow-y: auto; }
.cart-panel { width: 350px; padding: 20px; background-color: #2c3e50; display: flex; flex-direction: column; }
.category-tabs { margin-bottom: 20px; }
.item-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
.item-card { border: 1px solid #444; padding: 15px; border-radius: 8px; }
.quantity-control { display: flex; margin-top: 10px; }
.quantity-control input { width: 50px; text-align: center; }
.cart-items { flex-grow: 1; overflow-y: auto; }
.cart-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
.summary { border-top: 1px solid #444; padding-top: 15px; }
.error { color: #e74c3c; }
</style>
