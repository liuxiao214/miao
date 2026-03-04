<template>
  <div class="selection-container">
    <h1>领养你的新伙伴</h1>
    <div class="form">
      <!-- 来源 -->
      <label>它的来源是?</label>
      <div class="options">
        <button @click="petSource = 'stray'" :class="{ selected: petSource === 'stray' }">路边偶遇 (免费)</button>
        <button @click="petSource = 'friend'" :class="{ selected: petSource === 'friend' }">朋友赠送 (免费)</button>
        <button @click="petSource = 'store'" :class="{ selected: petSource === 'store' }">宠物店 ($500)</button>
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
      <div class="inline-options">
        <label>年龄: </label>
        <button @click="petAge = 'cub'" :class="{ selected: petAge === 'cub' }">幼崽</button>
        <button @click="petAge = 'adult'" :class="{ selected: petAge === 'adult' }">成年</button>
        <label style="margin-left: 20px;">性别: </label>
        <button @click="petGender = 'unknown'" :class="{ selected: petGender === 'unknown' }">未知</button>
        <button @click="petGender = 'male'" :class="{ selected: petGender === 'male' }">雄性</button>
        <button @click="petGender = 'female'" :class="{ selected: petGender === 'female' }">雌性</button>
      </div>

      <!-- 名字 -->
      <label for="pet-name">给它起个名字吧:</label>
      <input type="text" id="pet-name" v-model="petName" />

      <div class="action-buttons">
        <button @click="goBack" class="back-btn">返回</button>
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
}
</script>

<style scoped>
.selection-container {
  text-align: center;
}
.form {
  display: inline-flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}
input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.options {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.options button {
  padding: 10px 20px;
}
.options button.selected,
.inline-options button.selected {
  background-color: #2ecc71;
  color: white;
  border-color: #2ecc71;
}

/* Big icon buttons for pet type */
.pet-type-options button {
  flex-direction: column;
  height: 100px;
  width: 100px;
  font-size: 16px;
}
.pet-type-options .icon {
  font-size: 40px;
  margin-bottom: 8px;
}
.confirm-btn {
  margin-top: 20px;
  padding: 15px;
  background-color: #3498db;
  color: white;
  font-size: 16px;
}
</style>
