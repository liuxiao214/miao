<template>
  <div class="modal-overlay">
    <div class="event-modal">
      <h2>{{ currentEvent.title }}</h2>
      <div class="event-content">
        <div class="event-image">
          <img 
            :src="imageSrc" 
            :alt="currentEvent.title"
            @error="handleImageError"
          />
        </div>
        <p class="event-description">{{ currentEvent.description }}</p>
      </div>
      <div class="event-options">
        <button 
          v-for="(option, index) in currentEvent.options" 
          :key="index" 
          @click="handleOption(option)"
          :disabled="!isOptionAvailable(option)"
        >
          {{ option.text }}
          <span v-if="option.cost" class="option-cost">-¥{{ option.cost }}</span>
          <span v-if="option.requiredItem" class="option-item">{{ items[option.requiredItem]?.name }}</span>
        </button>
      </div>
      <div v-if="result" class="event-result">
        <p>{{ result }}</p>
        <button @click="closeEvent">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGameStore } from '../store/game';
import { useInventoryStore } from '../store/inventory';
import { items } from '../game/config/items';

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const gameStore = useGameStore();
const inventoryStore = useInventoryStore();

const currentEvent = ref(props.event);
const result = ref(null);
const imageSrc = ref(props.event.image);

function isOptionAvailable(option) {
  if (option.cost) {
    return gameStore.player.money >= option.cost;
  }
  if (option.requiredItem) {
    return inventoryStore.items.some(item => item.itemId === option.requiredItem);
  }
  return true;
}

function handleOption(option) {
  // 检查选项是否可用
  if (!isOptionAvailable(option)) {
    result.value = option.failure;
    return;
  }

  // 如果是跳转到商店的选项
  if (option.jumpToStore) {
    // 跳转到商店，不关闭事件
    gameStore.setGameState('shopping');
    return;
  }

  // 扣除费用
  if (option.cost) {
    gameStore.player.money -= option.cost;
  }

  // 消耗物品
  if (option.requiredItem) {
    const itemInstance = inventoryStore.items.find(item => item.itemId === option.requiredItem);
    if (itemInstance) {
      inventoryStore.removeItem(itemInstance.instanceId);
    }
  }

  // 应用效果
  if (option.effects) {
    for (const [key, value] of Object.entries(option.effects)) {
      if (gameStore.pet && key in gameStore.pet) {
        gameStore.pet[key] += value;
        // 确保数值在合理范围内
        if (gameStore.pet[key] > 100) {
          gameStore.pet[key] = 100;
        }
        if (gameStore.pet[key] < 0) {
          gameStore.pet[key] = 0;
        }
      }
    }
  }

  // 显示结果
  result.value = option.success;
  
  // 将事件互动添加到每日互动记录
  if (option.effects) {
    let intimacyChange = 0;
    if (option.effects.intimacy) {
      intimacyChange = option.effects.intimacy;
    }
    
    gameStore.dailyInteractions.push({
      name: currentEvent.value.title,
      intimacy: intimacyChange,
      hour: gameStore.gameTime.hour
    });
  }
}

function closeEvent() {
  emit('close');
}

function handleImageError() {
  // 当图片加载失败时，使用默认图片
  imageSrc.value = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=200&fit=crop';
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  pointer-events: auto;
}

.event-modal {
  background-color: #fff9e6;
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.event-modal h2 {
  color: #8B4513;
  margin-bottom: 20px;
  font-size: 24px;
}

.event-content {
  margin-bottom: 30px;
}

.event-image {
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.event-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.event-description {
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 20px;
}

.event-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.event-options button {
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  background-color: #E8D5B7;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-options button:hover:not(:disabled) {
  background-color: #D4B996;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.event-options button:disabled {
  background-color: #CCCCCC;
  cursor: not-allowed;
  opacity: 0.7;
}

.option-cost {
  font-weight: bold;
  color: #8B4513;
}

.option-item {
  font-size: 14px;
  color: #666;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 2px 8px;
  border-radius: 10px;
}

.event-result {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.event-result p {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
}

.event-result button {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background-color: #8B4513;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-result button:hover {
  background-color: #6B340D;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
