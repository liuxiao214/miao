import { reactive } from 'vue';

/**
 * 创建一个响应式的宠物状态对象
 * @param {object} details - 包含宠物所有详细信息的对象
 * @returns {object} 包含宠物状态的响应式对象
 */
export function createPet(details) {
  const petState = reactive({
    ...details, // 将所有选择的细节复制过来
    ageValue: details.age === 'cub' ? 0.5 : 2, // 年龄，可以按游戏天数增加

    // --- 核心状态属性 (0-100) ---
    health: 100,
    happiness: 80,
    hunger: 50,
    energy: 100,
    intimacy: 0, // 亲密度，初始为0

    // --- 状态标签 ---
    isSick: false, // 是否生病
  });

  // 根据来源和品种等调整初始状态
  if (petState.source === 'stray') {
    petState.health -= 20; // 流浪动物初始健康较低
    petState.happiness -= 10;
  }

  if (petState.breed === 'husky') {
    petState.energy = 120; // 哈士奇精力更旺盛
  }
  if (petState.breed === 'siamese') {
    petState.happiness -= 5; // 暹罗需要更多关注
  }

  return petState;
}
