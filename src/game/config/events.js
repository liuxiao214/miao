export const events = [
  {
    id: 'pet_sick',
    title: '宠物生病',
    description: '你的宠物看起来不太舒服，可能是吃了什么不该吃的东西。',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=200&fit=crop',
    options: [
      {
        text: '带宠物去看医生',
        cost: 100,
        effects: { health: 20, happiness: -5 },
        success: '医生给宠物开了药，宠物感觉好多了。',
        failure: '你没有足够的钱带宠物去看医生。'
      },
      {
        text: '给宠物喂药',
        requiredItem: 'probiotics',
        effects: { health: 10, happiness: -10 },
        success: '你给宠物喂了药，宠物感觉好多了。',
        failure: '你没有合适的药物。'
      },
      {
        text: '观察一天',
        effects: { health: -5, happiness: -15 },
        success: '宠物自己恢复了健康。',
        failure: '宠物的病情加重了。'
      }
    ]
  },
  {
    id: 'pet_mess',
    title: '宠物搞破坏',
    description: '你的宠物把家里搞得一团糟，沙发、窗帘都被抓破了。',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=200&fit=crop',
    options: [
      {
        text: '责骂宠物',
        effects: { happiness: -20, intimacy: -5 },
        success: '宠物知道自己错了，以后会注意。',
        failure: '宠物对你的责骂感到害怕，变得更加胆小。'
      },
      {
        text: '清理并购买猫抓板',
        cost: 40,
        effects: { happiness: 10 },
        success: '你清理了房间并购买了猫抓板，宠物有了合适的地方磨爪子。',
        failure: '你没有足够的钱购买猫抓板。'
      },
      {
        text: '耐心教导',
        effects: { happiness: -5, intimacy: 10 },
        success: '你耐心地教导宠物，宠物明白了什么是可以做的，什么是不可以做的。',
        failure: '宠物似乎没有理解你的教导。'
      }
    ]
  },
  {
    id: 'pet_lost',
    title: '宠物走丢',
    description: '你回家发现宠物不在家里，可能是从窗户跑出去了。',
    image: 'https://images.unsplash.com/photo-1529429617124-a3eb161ffa5f?w=400&h=200&fit=crop',
    options: [
      {
        text: '立即出去寻找',
        effects: { happiness: -10, intimacy: 15 },
        success: '你找到了宠物，它正在附近的公园里玩耍。',
        failure: '你找了很久，还是没有找到宠物。'
      },
      {
        text: '张贴寻宠启事',
        cost: 50,
        effects: { happiness: -5, intimacy: 10 },
        success: '有人看到了寻宠启事，联系你并归还了宠物。',
        failure: '没有收到任何关于宠物的消息。'
      },
      {
        text: '等待宠物自己回来',
        effects: { happiness: -20, intimacy: -10 },
        success: '宠物自己回来了，看起来玩得很开心。',
        failure: '宠物没有回来，你很担心。'
      }
    ]
  },
  {
    id: 'pet_birthday',
    title: '宠物生日',
    description: '今天是宠物的生日，你想为它庆祝一下。',
    image: 'https://images.unsplash.com/photo-1596470187686-9ee2c1956c97?w=400&h=200&fit=crop',
    options: [
      {
        text: '买个宠物蛋糕',
        cost: 60,
        effects: { happiness: 25, intimacy: 15 },
        success: '宠物很喜欢这个蛋糕，吃得很开心。',
        failure: '你没有足够的钱购买宠物蛋糕。'
      },
      {
        text: '做个自制蛋糕',
        requiredItem: 'food_premium',
        effects: { happiness: 20, intimacy: 10 },
        success: '你用高级宠物粮做了个蛋糕，宠物很喜欢。',
        failure: '你没有足够的材料做蛋糕。'
      },
      {
        text: '陪宠物玩一整天',
        effects: { happiness: 15, intimacy: 20, energy: -20 },
        success: '你陪宠物玩了一整天，宠物很开心。',
        failure: '宠物似乎有点累了，玩了一会儿就去睡觉了。'
      }
    ]
  },
  {
    id: 'vet_visit',
    title: '定期体检',
    description: '是时候带宠物去做定期体检了，确保它的健康状况良好。',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=200&fit=crop',
    options: [
      {
        text: '带宠物去体检',
        cost: 80,
        effects: { health: 15, happiness: -5 },
        success: '体检结果显示宠物健康状况良好，医生给出了一些养护建议。',
        failure: '你没有足够的钱带宠物去体检。'
      },
      {
        text: '在家自行检查',
        effects: { health: 5, happiness: 5 },
        success: '你仔细检查了宠物的身体状况，没有发现异常。',
        failure: '你不是专业人士，可能会错过一些健康问题。'
      },
      {
        text: '推迟体检',
        effects: { health: -10, happiness: 0 },
        success: '宠物看起来很健康，推迟体检应该没问题。',
        failure: '宠物可能有潜在的健康问题没有及时发现。'
      }
    ]
  }
];
