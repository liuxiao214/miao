import { defineStore } from 'pinia';
import { createPet } from '../game/models/pet';
import { useInventoryStore } from './inventory';
import { items } from '../game/config/items';
import { events } from '../game/config/events';

export const useGameStore = defineStore('game', {
  state: () => ({
    gameState: 'character_selection', // character_selection, pet_selection, playing, shopping, backpack, event
    inventoryFilter: null, // null, 'food', 'toy', 'health' etc.
    player: {
      money: 1000, // 初始资金
    },
    pet: null,
    gameTime: {
      day: 1,
      hour: 8,
      month: 1, // 月份，从1开始
    },
    dailyInteractions: [], // 每日互动记录
    currentEvent: null, // 当前事件
    savedEvent: null, // 保存的事件状态，用于从商店返回后恢复
    eventCooldown: 0, // 事件冷却时间（小时）
    
    // --- 成本数据属性 --- 
    dailyExpenses: 0, // 当日总支出
    monthlyExpenses: 0, // 当月总支出
    timeInvestment: 0, // 当日时间投入（分钟）
    monthlyBudget: 500, // 月度预算（可调整）
    dailyExpensesLog: [], // 每日支出记录
    monthlyExpensesLog: [], // 月度支出记录
    timeInvestmentLog: [], // 时间投入记录（每次互动的时间）
    
    // --- 适配度数据属性 --- 
    compatibility: 50, // 养宠者与宠物的适配度初始值（0-100）
    compatibilityHistory: [], // 适配度变化历史
  }),
  
  getters: {
    // 预算使用率计算
    budgetUsageRate: (state) => {
      if (state.monthlyBudget <= 0) return 0;
      return Math.min(100, Math.round((state.monthlyExpenses / state.monthlyBudget) * 100));
    },
    
    // 日均支出计算
    averageDailyExpenses: (state) => {
      if (state.gameTime.day <= 1) return state.dailyExpenses;
      return Math.round(state.monthlyExpenses / state.gameTime.day);
    },
    
    // 日均时间投入计算
    averageDailyTime: (state) => {
      if (state.gameTime.day <= 1) return state.timeInvestment;
      const totalMinutes = state.timeInvestmentLog.reduce((sum, item) => sum + item.minutes, 0);
      return Math.round(totalMinutes / state.gameTime.day);
    },
  },

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
        // 记录当天支出并重置
        this.dailyExpensesLog.push({
          day: this.gameTime.day - 1,
          month: this.gameTime.month,
          amount: this.dailyExpenses
        });
        // 清空每日互动记录和时间投入，准备新的一天
        this.dailyInteractions = [];
        this.dailyExpenses = 0;
        this.timeInvestment = 0;
        
        // 检查是否进入新的月份（30天为一个月）
        if (this.gameTime.day > 30) {
          this.gameTime.day = 1;
          this.gameTime.month++;
          // 记录当月支出并重置
          this.monthlyExpensesLog.push({
            month: this.gameTime.month - 1,
            amount: this.monthlyExpenses
          });
          this.monthlyExpenses = 0;
        }
      }

      // 随着时间流逝，宠物的状态会发生变化
      if (this.pet) {
        // 判断是否处于休息时段（夜间10点至早上7点）
        const isResting = this.gameTime.hour >= 22 || this.gameTime.hour < 7;
        
        // 基础状态变化
        this.pet.hunger -= 1; // 每小时饥饿度减1
        
        // 精力变化：休息时段恢复精力，活跃时段消耗精力
        if (isResting) {
          this.pet.energy += 5; // 休息时每小时恢复5点精力
        } else {
          this.pet.energy -= 0.5; // 活跃时每小时消耗0.5点精力
        }
        
        // 状态相互影响
        // 饥饿度过低影响健康和心情
        if (this.pet.hunger < 30) {
          this.pet.health -= 0.5;
          this.pet.happiness -= 0.5;
        }
        
        // 精力过低影响心情
        if (this.pet.energy < 20) {
          this.pet.happiness -= 0.5;
        }
        
        // 健康状况影响心情
        if (this.pet.health < 40) {
          this.pet.happiness -= 0.5;
        }
        
        // 随机波动（模拟自然恢复或突发情况）
        if (Math.random() < 0.1) { // 10%概率
          this.pet.happiness += Math.random() * 2 - 1; // -1到1的随机变化
        }
        
        // 确保数值在合理范围内
        if (this.pet.hunger < 0) this.pet.hunger = 0;
        if (this.pet.hunger > 100) this.pet.hunger = 100;
        if (this.pet.energy < 0) this.pet.energy = 0;
        if (this.pet.energy > 100) this.pet.energy = 100;
        if (this.pet.happiness < 0) this.pet.happiness = 0;
        if (this.pet.health < 0) this.pet.health = 0;
        if (this.pet.happiness > 100) this.pet.happiness = 100;
        if (this.pet.health > 100) this.pet.health = 100;
      }

      // 更新事件冷却时间
      this.updateEventCooldown();
      
      // 检查是否触发随机事件
      this.checkRandomEvent();
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
      
      // 记录时间投入（根据物品类型不同，时间投入不同）
      let timeSpent = 0;
      if (itemConfig.type === 'food') {
        timeSpent = 5; // 喂食5分钟
      } else if (itemConfig.type === 'toy') {
        timeSpent = 15; // 玩耍15分钟
      } else if (itemConfig.type === 'health') {
        timeSpent = 10; // 医疗处理10分钟
      } else if (itemConfig.type === 'cleaning' || itemConfig.type === 'maintenance') {
        timeSpent = 20; // 清洁/维护20分钟
      } else if (itemConfig.type === 'necessity') {
        timeSpent = 8; // 日常用品使用8分钟
      }
      
      this.timeInvestment += timeSpent;
      this.timeInvestmentLog.push({
        day: this.gameTime.day,
        hour: this.gameTime.hour,
        itemType: itemConfig.type,
        itemName: itemConfig.name,
        minutes: timeSpent
      });

      // --- 1. 应用物品效果 ---
      if (itemConfig.effects) {
        for (const effect in itemConfig.effects) {
          this.pet[effect] += itemConfig.effects[effect];
          // 确保数值不超上限
          if (this.pet[effect] > 100) {
            this.pet[effect] = 100;
          }
        }
      }

      // --- 2. 增加亲密度 ---
      let intimacyIncrease = 0;
      if (itemConfig.type === 'food') {
        // 食物的亲密度增加取决于宠物的饥饿程度
        // 饥饿程度越低，亲密度增加越多
        intimacyIncrease = Math.max(1, Math.floor((100 - this.pet.hunger) / 20) + 1);
      } else if (itemConfig.type === 'toy') {
        // 玩具的亲密度增加取决于宠物的心情和精力
        // 心情越好，精力越充足，亲密度增加越多
        const moodFactor = Math.floor(this.pet.happiness / 30) + 1;
        const energyFactor = Math.floor(this.pet.energy / 40) + 1;
        intimacyIncrease = Math.max(2, moodFactor + energyFactor);
      } else if (itemConfig.type === 'health') {
        // 医疗物品的亲密度增加取决于宠物的健康程度
        // 健康程度越低，亲密度增加越多
        intimacyIncrease = Math.max(1, Math.floor((100 - this.pet.health) / 25) + 1);
      } else if (itemConfig.type === 'cleaning' || itemConfig.type === 'maintenance') {
        // 清洁和维护物品的亲密度增加
        intimacyIncrease = 3;
      } else if (itemConfig.type === 'necessity') {
        // 生活用品的亲密度增加
        intimacyIncrease = 2;
      }
      
      if (intimacyIncrease > 0) {
        this.pet.intimacy += intimacyIncrease;
        if (this.pet.intimacy > 100) {
          this.pet.intimacy = 100;
        }
        
        // 记录互动
        this.dailyInteractions.push({
          type: itemConfig.type,
          name: itemConfig.name,
          intimacy: intimacyIncrease,
          day: this.gameTime.day,
          hour: this.gameTime.hour
        });
      }

      // --- 3. 处理物品消耗 ---
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
      else if (itemInstance.durability) {
        // 任何具有耐久度的物品使用后都会消耗耐久
        const newDurability = itemInstance.durability - 1;
        if (newDurability <= 0) {
          inventoryStore.removeItem(instanceId);
        } else {
          inventoryStore.updateItem(instanceId, { durability: newDurability });
        }
      }

      // 移除自动关闭背包的代码，允许连续使用物品
      // this.inventoryFilter = null;
      // this.setGameState('playing');
      
      // 更新适配度
      this.updateCompatibility();
    },

    /**
     * 购买物品
     */
    buyItem(itemId) {
      const item = items[itemId];
      if (!item) return;

      if (this.player.money >= item.price) {
        this.player.money -= item.price;
        // 记录支出
        this.dailyExpenses += item.price;
        this.monthlyExpenses += item.price;
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
      // 如果当前是事件状态且要进入购物状态，保存当前事件
      if (this.gameState === 'event' && newState === 'shopping') {
        this.savedEvent = this.currentEvent;
      }
      // 如果当前是购物状态且要退出到游戏中，恢复事件
      else if (this.gameState === 'shopping' && newState === 'playing' && this.savedEvent) {
        this.currentEvent = this.savedEvent;
        this.savedEvent = null;
        newState = 'event'; // 恢复到事件状态
      }
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
      // 记录支出
      this.dailyExpenses += totalCost;
      this.monthlyExpenses += totalCost;

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

    /**
     * 检查并触发随机事件
     */
    checkRandomEvent() {
      if (this.gameState !== 'playing' || this.currentEvent || this.eventCooldown > 0) {
        return;
      }

      // 20% 的概率触发事件
      if (Math.random() < 0.2) {
        this.triggerRandomEvent();
      }
    },

    /**
     * 触发随机事件
     */
    triggerRandomEvent() {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      this.currentEvent = randomEvent;
      this.gameState = 'event';
      // 设置事件冷却时间为 6 小时
      this.eventCooldown = 6;
    },

    /**
     * 关闭事件
     */
    closeEvent() {
      this.currentEvent = null;
      this.savedEvent = null;
      this.gameState = 'playing';
    },

    /**
     * 更新事件冷却时间
     */
    updateEventCooldown() {
      if (this.eventCooldown > 0) {
        this.eventCooldown--;
      }
    },
    
    /**
     * 更新养宠者与宠物的适配度
     */
    updateCompatibility() {
      if (!this.pet) return;
      
      let compatibilityScore = this.compatibility;
      
      // 基础适配度计算（基于宠物当前状态）
      const healthFactor = this.pet.health * 0.3; // 健康占30%
      const happinessFactor = this.pet.happiness * 0.25; // 心情占25%
      const intimacyFactor = this.pet.intimacy * 0.25; // 亲密度占25%
      const basicScore = healthFactor + happinessFactor + intimacyFactor;
      
      // 计算互动频率和时间投入的影响
      const avgDailyInteractions = this.dailyExpensesLog.length > 0 ? 
        this.dailyInteractions.length : 1;
      const avgDailyTime = this.averageDailyTime;
      
      // 根据互动情况调整适配度
      if (this.dailyInteractions.length > avgDailyInteractions + 2) {
        compatibilityScore += 2; // 互动频繁，适配度增加
      } else if (this.dailyInteractions.length < Math.max(1, avgDailyInteractions - 2)) {
        compatibilityScore -= 2; // 互动不足，适配度减少
      }
      
      // 根据时间投入调整适配度
      if (this.timeInvestment > avgDailyTime + 10) {
        compatibilityScore += 1; // 时间投入多，适配度增加
      } else if (this.timeInvestment < Math.max(5, avgDailyTime - 10)) {
        compatibilityScore -= 1; // 时间投入少，适配度减少
      }
      
      // 确保适配度在合理范围内
      compatibilityScore = Math.max(0, Math.min(100, compatibilityScore));
      
      // 更新适配度并记录历史
      this.compatibility = Math.round(compatibilityScore);
      this.compatibilityHistory.push({
        day: this.gameTime.day,
        month: this.gameTime.month,
        value: this.compatibility
      });
    },
  },
});
