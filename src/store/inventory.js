import { defineStore } from 'pinia';
import { items } from '../game/config/items';

// 生成一个简单的唯一ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useInventoryStore = defineStore('inventory', {
  // state 现在是一个实例数组
  state: () => ({
    items: [], // e.g., [{ instanceId: 'a1b2c', itemId: 'toy_ball', durability: 50 }, ...]
  }),

  actions: {
    /**
     * 添加物品实例到库存
     * @param {string} itemId - 物品的ID
     * @param {number} quantity - 数量
     */
    addItem(itemId, quantity = 1) {
      const itemConfig = items[itemId];
      if (!itemConfig) return;

      for (let i = 0; i < quantity; i++) {
        const newItemInstance = {
          instanceId: generateId(),
          itemId: itemId,
        };
        // 从配置中复制初始使用次数或耐久度
        if (itemConfig.uses) {
          newItemInstance.uses = itemConfig.uses;
        }
        if (itemConfig.durability) {
          newItemInstance.durability = itemConfig.durability;
        }
        this.items.push(newItemInstance);
      }
    },

    /**
     * 通过实例ID移除一个物品
     * @param {string} instanceId - 物品实例的ID
     */
    removeItem(instanceId) {
      this.items = this.items.filter(item => item.instanceId !== instanceId);
    },

    /**
     * 更新一个物品实例的属性
     * @param {string} instanceId - 物品实例的ID
     * @param {object} updates - 要更新的属性 e.g., { durability: 49 }
     */
    updateItem(instanceId, updates) {
      const item = this.items.find(item => item.instanceId === instanceId);
      if (item) {
        Object.assign(item, updates);
      }
    },
  },
});
