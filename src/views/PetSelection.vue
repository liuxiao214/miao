<template>
  <div class="selection-container">
    <h1>领养你的新伙伴</h1>
    <p>选择你喜欢的宠物，开始你的养宠之旅吧！</p>
    <div class="form">
      <!-- 来源 -->
      <label>它的来源是?</label>
      <div class="options">
        <button @click="petSource = 'stray'" :class="{ selected: petSource === 'stray' }">路边偶遇 (免费)</button>
        <button @click="petSource = 'friend'" :class="{ selected: petSource === 'friend' }">朋友赠送 (免费)</button>
        <button @click="petSource = 'store'" :class="{ selected: petSource === 'store' }">宠物店 (¥500)</button>
      </div>

      <!-- 类型 -->
      <label>选择它的类型:</label>
      <div class="options pet-type-options">
        <button @click="petType = 'cat'" :class="{ selected: petType === 'cat' }">
          <span class="icon">🐱</span>
          <span>猫咪</span>
        </button>
        <button @click="petType = 'dog'" :class="{ selected: petType === 'dog' }">
          <span class="icon">🐶</span>
          <span>狗狗</span>
        </button>
      </div>

      <!-- 品种 -->
      <label>选择品种:</label>
      <select v-model="petBreed">
        <optgroup label="猫" v-if="petType === 'cat'">
          <option value="domestic">田园猫</option>
          <option value="shorthair_british">英国短毛猫</option>
          <option value="shorthair_american">美国短毛猫</option>
          <option value="ragdoll">布偶猫</option>
          <option value="siamese">暹罗猫</option>
          <option value="persian">波斯猫</option>
          <option value="maine_coon">缅因猫</option>
          <option value="sphynx">斯芬克斯无毛猫</option>
          <option value="scottish_fold">苏格兰折耳猫</option>
          <option value="birman">伯曼猫</option>
          <option value="abyssinian">阿比西尼亚猫</option>
          <option value="russian_blue">俄罗斯蓝猫</option>
          <option value="norwegian_forest">挪威森林猫</option>
          <option value="siberian">西伯利亚猫</option>
          <option value="bengal">孟加拉豹猫</option>
          <option value="munchkin">曼赤肯猫（矮脚）</option>
        </optgroup>
        <optgroup label="狗" v-if="petType === 'dog'">
          <option value="mixed">中华田园犬</option>
          <option value="labrador">拉布拉多</option>
          <option value="golden_retriever">金毛巡回犬</option>
          <option value="french_bulldog">法国斗牛犬</option>
          <option value="corgi">柯基</option>
          <option value="poodle">贵宾犬</option>
          <option value="shiba">柴犬</option>
          <option value="husky">哈士奇</option>
          <option value="german_shepherd">德国牧羊犬</option>
          <option value="beagle">比格犬</option>
          <option value="dachshund">腊肠犬</option>
          <option value="border_collie">边境牧羊犬</option>
          <option value="pomeranian">博美犬</option>
          <option value="samoyed">萨摩耶</option>
          <option value="alaskan_malamute">阿拉斯加雪橇犬</option>
          <option value="chihuahua">吉娃娃</option>
        </optgroup>
      </select>

      <!-- 年龄和性别 -->
      <div class="age-gender-container">
        <div class="option-group">
          <label>年龄:</label>
          <div class="age-options">
            <button @click="petAge = 'cub'" :class="{ selected: petAge === 'cub' }">
              <span class="icon">🐣</span>
              <span>幼崽</span>
            </button>
            <button @click="petAge = 'adult'" :class="{ selected: petAge === 'adult' }">
              <span class="icon">🐾</span>
              <span>成年</span>
            </button>
          </div>
        </div>
        <div class="option-group">
          <label>性别:</label>
          <div class="gender-options">
            <button @click="petGender = 'unknown'" :class="{ selected: petGender === 'unknown' }">
              <span class="icon">❓</span>
              <span>未知</span>
            </button>
            <button @click="petGender = 'male'" :class="{ selected: petGender === 'male' }">
              <span class="icon">♂️</span>
              <span>雄性</span>
            </button>
            <button @click="petGender = 'female'" :class="{ selected: petGender === 'female' }">
              <span class="icon">♀️</span>
              <span>雌性</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 名字 -->
      <label for="pet-name">给它起个名字吧:</label>
      <input type="text" id="pet-name" v-model="petName" />

      <div class="action-buttons">
        <button @click="goBack" class="back-btn">上一步</button>
        <button @click="confirmAdoption" class="confirm-btn">确认领养</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useGameStore } from '../store/game';

const gameStore = useGameStore();

// Pet attributes
const petName = ref('Mimi');
const petSource = ref('stray'); // stray, friend, store
const petType = ref('cat'); // cat, dog
const petBreed = ref('domestic'); // 默认田园猫
const petAge = ref('cub'); // cub, adult
const petGender = ref('unknown'); // male, female, unknown

// Update default breed when type changes
watch(petType, (newType) => {
  if (newType === 'cat') {
    petBreed.value = 'domestic';
  } else {
    petBreed.value = 'mixed';
  }
});

function confirmAdoption() {
  if (!petName.value) {
    alert('请给你的宠物起个名字！');
    return;
  }

  const petDetails = {
    name: petName.value,
    source: petSource.value,
    type: petType.value,
    breed: petBreed.value,
    age: petAge.value,
    gender: petGender.value,
  };

  gameStore.createNewPet(petDetails);
}

function goBack() {
  gameStore.setGameState('character_selection');
  // 确保返回到条件选择界面
  // 这里需要修改CharacterSelection组件的currentStep状态
  // 由于我们无法直接修改另一个组件的状态，我们需要在gameStore中添加一个方法
  // 或者通过事件总线等方式传递信息
  // 暂时使用localStorage来传递状态
  localStorage.setItem('characterSelectionStep', 'conditions');
}
</script>

<style scoped>
.selection-container {
  text-align: center;
  min-height: 100vh;
  padding: 30px 20px;
  overflow-y: auto;
  box-sizing: border-box;
  max-height: 100vh;
  background: linear-gradient(135deg, #fff9e6 0%, #f5e6d3 100%);
}

.selection-container h1 {
  color: #8B4513;
  margin-bottom: 10px;
  font-size: 32px;
}

.selection-container > p {
  margin-bottom: 30px;
  color: #666;
  font-size: 16px;
}

.form {
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  max-width: 600px;
  width: 100%;
}

.form label {
  font-weight: 500;
  color: #333;
  font-size: 16px;
  text-align: left;
}

input {
  padding: 12px 15px;
  border-radius: 20px;
  border: 1px solid #E8D5B7;
  font-size: 16px;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #8B4513;
  box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
}

select {
  padding: 12px 15px;
  border-radius: 20px;
  border: 1px solid #E8D5B7;
  font-size: 16px;
  background-color: white;
  transition: all 0.2s ease;
}

select:focus {
  outline: none;
  border-color: #8B4513;
  box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
}

.options {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.options button {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: #E8D5B7;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #333;
}

.options button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #D4B996;
}

.options button.selected,
.inline-options button.selected {
  background-color: #8B4513;
  color: white;
  box-shadow: 0 4px 8px rgba(139, 69, 19, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .selection-container h1 {
    font-size: 24px;
  }
  
  .selection-container > p {
    font-size: 14px;
  }
  
  .form {
    gap: 8px;
    margin-top: 8px;
  }
  
  .form label {
    font-size: 14px;
  }
  
  input {
    padding: 10px 12px;
    font-size: 14px;
  }
  
  select {
    padding: 10px 12px;
    font-size: 14px;
  }
  
  .options {
    gap: 8px;
  }
  
  .options button {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .action-buttons button {
    width: 200px;
  }
}

/* Big icon buttons for pet type */
.pet-type-options {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.pet-type-options button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  width: 120px;
  font-size: 16px;
  border-radius: 20px;
  background-color: white;
  border: 2px solid #E8D5B7;
  transition: all 0.2s ease;
}

.pet-type-options button:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border-color: #8B4513;
}

.pet-type-options button.selected {
  background-color: #8B4513;
  border-color: #8B4513;
  color: white;
}

.pet-type-options .icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.age-gender-container {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.option-group {
  flex: 1;
  min-width: 200px;
}

.option-group label {
  display: block;
  margin-bottom: 10px;
  text-align: left;
}

.age-options,
.gender-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.age-options button,
.gender-options button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  border: none;
  border-radius: 15px;
  background-color: white;
  border: 2px solid #E8D5B7;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #333;
  min-width: 80px;
}

.age-options button:hover,
.gender-options button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-color: #8B4513;
}

.age-options button.selected,
.gender-options button.selected {
  background-color: #8B4513;
  border-color: #8B4513;
  color: white;
}

.age-options .icon,
.gender-options .icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.action-buttons {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.back-btn {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #E8D5B7;
  border-radius: 15px;
  background-color: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back-btn:hover {
  transform: translateY(-5px);
  border-color: #8B4513;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  background-color: #F5E6D3;
}

.confirm-btn {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #E8D5B7;
  border-radius: 15px;
  background-color: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.confirm-btn:hover {
  transform: translateY(-5px);
  border-color: #8B4513;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  background-color: #F5E6D3;
}
</style>
