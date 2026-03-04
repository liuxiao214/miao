import { defineStore } from 'pinia';
import { createPet } from '../game/models/pet';
import { useInventoryStore } from './inventory';
import { items } from '../game/config/items';

export const useGameStore = defineStore('game', {
  state: () => ({
    gameState: 'character_selection', // character_selection, pet_selection, playing, shopping, backpack
    inventoryFilter: null, // null, 'food', 'toy', 'health' etc.
    player: {
      money: 1000, // 初始资金
    },
    pet: null,
    gameTime: {
      day: 1,
      hour: 8,
    },
  }),

  actions: {
    /**
     * 创建一只新宠物并将其设置为当前宠物
     */
    createNewPet(details) {
      // 根据来源扣除费用
      if (details.source === 'store') {
        if (this.player.money < 500) {
          alert("你的钱不够从宠物店购买！");
          return;
        }
        this.player.money -= 500;
      }

      this.pet = createPet(details);
      this.setGameState('initial_shopping');
    },

    /**
     * 游戏时间流逝一个小时
     */
    tickHour() {
      this.gameTime.hour++;
      if (this.gameTime.hour >= 24) {
        this.gameTime.hour = 0;
        this.gameTime.day++;
      }

      // 随着时间流逝，宠物的状态会发生变化
      if (this.pet) {
        this.pet.hunger -= 1; // 举例：每小时饥饿度减1
        this.pet.energy -= 0.5; // 举例：每小时精力减0.5

        // 确保数值不会低于0
        if (this.pet.hunger < 0) this.pet.hunger = 0;
        if (this.pet.energy < 0) this.pet.energy = 0;
      }
    },

    /**
     * 使用一个物品实例
     * @param {string} instanceId - 物品实例的ID
     */
    useItem(instanceId) {
      const inventoryStore = useInventoryStore();
      const itemInstance = inventoryStore.items.find(i => i.instanceId === instanceId);
      if (!itemInstance || !this.pet) return;

      const itemConfig = items[itemInstance.itemId];
      if (!itemConfig) return;

      // --- 1. 应用物品效果 ---
      if (itemConfig.effects) {
        for (const effect in itemConfig.effects) {
          this.pet[effect] += itemConfig.effects[effect];
          // 确保数值不超上限
          if (this.pet[effect] > 100 && effect !== 'energy') {
            this.pet[effect] = 100;
          }
        }
      }

      // --- 2. 处理物品消耗 ---
      if (itemConfig.single_use) {
        inventoryStore.removeItem(instanceId);
      } 
      else if (itemInstance.uses) {
        const newUses = itemInstance.uses - 1;
        if (newUses <= 0) {
          inventoryStore.removeItem(instanceId);
        } else {
          inventoryStore.updateItem(instanceId, { uses: newUses });
        }
      } 
      else if (itemInstance.durability && ['toy'].includes(itemConfig.type)) {
        // 仅当物品是玩具等类型时，使用才消耗耐久
        const newDurability = itemInstance.durability - 1;
        if (newDurability <= 0) {
          inventoryStore.removeItem(instanceId);
        } else {
          inventoryStore.updateItem(instanceId, { durability: newDurability });
        }
      }

      // 使用后自动关闭背包
      this.inventoryFilter = null;
      this.setGameState('playing');
    },

    /**
     * 购买物品
     */
    buyItem(itemId) {
      const item = items[itemId];
      if (!item) return;

      if (this.player.money >= item.price) {
        this.player.money -= item.price;
        const inventoryStore = useInventoryStore();
        inventoryStore.addItem(itemId);
      } else {
        alert("钱不够！");
      }
    },

    /**
     * 设置游戏阶段
     */
    setGameState(newState) {
      this.gameState = newState;
    },

    /**
     * 完成首次购物
     */
    completeInitialShopping(cart, totalCost) {
      if (this.player.money < totalCost) {
        alert("钱不够！");
        return;
      }

      this.player.money -= totalCost;

      const inventoryStore = useInventoryStore();
      for (const itemId in cart) {
        inventoryStore.addItem(itemId, cart[itemId]);
      }

      this.setGameState('playing');
    },

    /**
     * 重置游戏状态
     */
    reset() {
      this.$reset(); // Pinia 内置方法，重置 state 到初始值
      const inventoryStore = useInventoryStore();
      inventoryStore.$reset();
    },
  },
});
