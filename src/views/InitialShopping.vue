<template>
  <div class="initial-shopping-container">
    <div class="main-panel">
      <h1>首次物资置办</h1>
      <p>在把新伙伴带回家之前，请为它准备好所有必需品！</p>
      
      <div class="category-tabs">
        <button v-for="cat in categories" :key="cat.id" @click="currentCategory = cat.id" :class="`category-${cat.id}`">
          {{ cat.name }}
        </button>
      </div>

      <div class="item-grid">
        <div v-for="item in availableItems" :key="item.id" :class="['item-card', `item-type-${item.type}`]">
          <label :for="item.id">{{ item.name }}</label>
          <span class="price">价格: ¥{{ item.price }}</span>
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
          <span>¥{{ items[itemId].price * quantity }}</span>
        </div>
      </div>
      <div class="summary">
        <h3>总计: ¥{{ totalCost }}</h3>
        <p>余额: ¥{{ gameStore.player.money }}</p>
        <div class="action-buttons">
          <button @click="goBack" class="back-btn">返回</button>
          <button @click="completeShopping" :disabled="totalCost > gameStore.player.money" class="confirm-btn">完成置办</button>
        </div>
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

function goBack() {
  gameStore.setGameState('pet_selection');
}
</script>

<style scoped>
.initial-shopping-container {
  display: flex;
  height: 100vh;
  background-color: #FFF9E6;
}

.main-panel {
  flex-grow: 1;
  padding: 30px;
  overflow-y: auto;
  text-align: center;
}

.cart-panel {
  width: 350px;
  padding: 30px;
  background-color: #E8D5B7;
  display: flex;
  flex-direction: column;
}

h1 {
  color: #8B4513;
  margin-bottom: 10px;
}

p {
  margin-bottom: 20px;
  color: #666;
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

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  margin-top: 20px;
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

.item-card label {
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
}

.price {
  font-weight: bold;
  color: #8B4513;
  margin: 10px 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.quantity-control input {
  width: 50px;
  text-align: center;
  border: 1px solid #E8D5B7;
  border-radius: 5px;
  padding: 5px;
}

.quantity-control button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #E8D5B7;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-control button:hover {
  background-color: #D4B996;
}

.cart-panel h2 {
  color: #8B4513;
  margin-bottom: 15px;
  font-size: 18px;
  text-align: center;
}

.cart-items {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 15px;
  padding-right: 10px;
}

/* 自定义滚动条 */
.cart-items::-webkit-scrollbar {
  width: 6px;
}

.cart-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.cart-items::-webkit-scrollbar-thumb {
  background: #8B4513;
  border-radius: 10px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px;
  background-color: white;
  border-radius: 5px;
  font-size: 14px;
}

.summary {
  border-top: 1px solid #8B4513;
  padding-top: 15px;
}

.summary h3 {
  color: #8B4513;
  margin-bottom: 10px;
  text-align: center;
}

.summary p {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.back-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background-color: #D4B996;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #8B4513;
  color: white;
}

.confirm-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background-color: #8B4513;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-btn:hover:not(:disabled) {
  background-color: #6B340D;
}

.confirm-btn:disabled {
  background-color: #CCCCCC;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
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
</style>
