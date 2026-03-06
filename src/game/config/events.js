export const events = [
  // 健康风险事件
  {
    id: 'soft_stool',
    title: '宠物软便/呕吐',
    description: '你的宠物出现了软便和呕吐的症状，可能是饮食不当或肠胃不适。',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=200&fit=crop',
    options: [
      {
        text: '调整饮食自行处理',
        effects: { health: 5, happiness: -10 },
        success: '你给宠物调整了饮食，宠物的症状有所缓解。',
        failure: '宠物的症状没有改善，反而加重了。'
      },
      {
        text: '给宠物喂益生菌',
        requiredItem: 'probiotics',
        effects: { health: 15, happiness: -5 },
        success: '益生菌有效缓解了宠物的肠胃不适。',
        failure: '你没有益生菌。'
      },
      {
        text: '带宠物去看医生',
        cost: 80,
        effects: { health: 25, happiness: -10 },
        success: '医生诊断为肠胃炎，开了药后宠物很快康复。',
        failure: '你没有足够的钱带宠物去看医生。'
      },
      {
        text: '去商店购买益生菌',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了益生菌。',
        failure: ''
      }
    ]
  },
  {
    id: 'skin_problem',
    title: '宠物皮肤问题',
    description: '你发现宠物的皮肤上有红肿、脱毛的现象，可能是皮肤病或寄生虫。',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=200&fit=crop',
    options: [
      {
        text: '使用宠物香波洗澡',
        requiredItem: 'pet_shampoo',
        effects: { health: 10, happiness: -10 },
        success: '洗澡后宠物的皮肤状况有所改善。',
        failure: '你没有合适的宠物香波。'
      },
      {
        text: '给宠物驱虫',
        requiredItem: 'flea_treatment',
        effects: { health: 15, happiness: -5 },
        success: '驱虫后宠物的皮肤问题得到了解决。',
        failure: '你没有驱虫药。'
      },
      {
        text: '带宠物去看兽医',
        cost: 120,
        effects: { health: 30, happiness: -15 },
        success: '兽医确诊为过敏性皮炎，治疗后宠物很快康复。',
        failure: '你没有足够的钱带宠物去看兽医。'
      },
      {
        text: '去商店购买药品',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了药品。',
        failure: ''
      }
    ]
  },
  {
    id: 'ingest_foreign',
    title: '宠物误食异物',
    description: '你发现宠物误食了一些不该吃的东西，可能会导致肠道堵塞。',
    image: 'https://images.unsplash.com/photo-1529429617124-a3eb161ffa5f?w=400&h=200&fit=crop',
    options: [
      {
        text: '观察等待自行排出',
        effects: { health: -10, happiness: -20 },
        success: '异物被宠物自行排出，没有造成严重问题。',
        failure: '宠物出现了腹痛和呕吐症状，情况危急。'
      },
      {
        text: '带宠物去医院检查',
        cost: 150,
        effects: { health: 20, happiness: -15 },
        success: '医生通过X光检查确认异物位置，成功取出。',
        failure: '你没有足够的钱带宠物去医院。'
      },
      {
        text: '尝试诱导呕吐',
        effects: { health: -5, happiness: -25 },
        success: '你成功诱导宠物呕吐，异物被吐出。',
        failure: '诱导呕吐失败，宠物情况更加严重。'
      }
    ]
  },
  {
    id: 'sudden_illness',
    title: '宠物突发疾病',
    description: '宠物突然出现了严重的症状，如抽搐、呼吸困难，需要紧急处理。',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=200&fit=crop',
    options: [
      {
        text: '立即送宠物去急诊',
        cost: 200,
        effects: { health: 25, happiness: -20 },
        success: '急诊医生及时救治，宠物脱离了危险。',
        failure: '你没有足够的钱支付急诊费用。'
      },
      {
        text: '尝试急救措施',
        effects: { health: 5, happiness: -30 },
        success: '你的急救措施暂时稳定了宠物的病情。',
        failure: '急救措施无效，宠物病情恶化。'
      }
    ]
  },
  
  // 行为问题事件
  {
    id: 'destroy_home',
    title: '宠物拆家',
    description: '你回家发现宠物把家里的沙发、窗帘都抓破了，一片狼藉。',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=200&fit=crop',
    options: [
      {
        text: '责骂并惩罚宠物',
        effects: { happiness: -25, intimacy: -15 },
        success: '宠物被你的责骂吓到，暂时停止了拆家行为。',
        failure: '宠物对你的责骂感到恐惧，变得更加焦虑。'
      },
      {
        text: '购买猫抓板/玩具引导',
        cost: 50,
        effects: { happiness: 10, intimacy: 5 },
        success: '新的猫抓板和玩具转移了宠物的注意力，拆家行为减少了。',
        failure: '你没有足够的钱购买猫抓板和玩具。'
      },
      {
        text: '耐心训练矫正',
        effects: { happiness: -5, intimacy: 15 },
        success: '通过耐心训练，宠物学会了正确的行为方式。',
        failure: '训练效果不明显，宠物依然偶尔拆家。'
      },
      {
        text: '去商店购买玩具',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了玩具和猫抓板。',
        failure: ''
      }
    ]
  },
  {
    id: 'urinate_randomly',
    title: '宠物乱尿',
    description: '宠物开始在家具和地毯上乱尿，而不是使用猫砂盆或狗厕所。',
    image: 'https://images.unsplash.com/photo-1529429617124-a3eb161ffa5f?w=400&h=200&fit=crop',
    options: [
      {
        text: '彻底清洁并使用宠物尿垫',
        requiredItem: 'pee_pads',
        effects: { happiness: 5, intimacy: -5 },
        success: '你使用宠物尿垫引导，宠物逐渐恢复了正常的排泄习惯。',
        failure: '你没有宠物尿垫，情况没有改善。'
      },
      {
        text: '惩罚宠物',
        effects: { happiness: -30, intimacy: -20 },
        success: '惩罚让宠物暂时停止了乱尿，但变得很害怕你。',
        failure: '惩罚导致宠物变得更加焦虑，乱尿现象更加严重。'
      },
      {
        text: '检查健康问题',
        cost: 80,
        effects: { health: 15, happiness: -10 },
        success: '医生发现宠物乱尿是因为泌尿系统问题，治疗后恢复了正常。',
        failure: '你没有足够的钱带宠物去检查。'
      },
      {
        text: '去商店购买尿垫',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了宠物尿垫。',
        failure: ''
      }
    ]
  },
  {
    id: 'resource_guarding',
    title: '宠物护食',
    description: '宠物在进食时变得非常护食，甚至会对你发出威胁的声音。',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=200&fit=crop',
    options: [
      {
        text: '强制拿走食物惩罚',
        effects: { happiness: -35, intimacy: -25 },
        success: '宠物暂时停止了护食行为，但对你产生了恐惧。',
        failure: '宠物对你发起了攻击，你被轻微咬伤。'
      },
      {
        text: '进行正向训练',
        requiredItem: 'treats',
        effects: { happiness: 10, intimacy: 20 },
        success: '通过正向训练，宠物学会了在进食时保持放松。',
        failure: '你没有训练零食，训练效果不佳。'
      },
      {
        text: '分餐喂食',
        effects: { happiness: 5, intimacy: 0 },
        success: '分餐喂食减少了宠物的护食行为。',
        failure: '分餐喂食没有解决根本问题。'
      },
      {
        text: '去商店购买训练零食',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了训练零食。',
        failure: ''
      }
    ]
  },
  {
    id: 'neighbor_complaint',
    title: '扰民投诉',
    description: '邻居向你投诉宠物过于吵闹，影响了他们的休息。',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=200&fit=crop',
    options: [
      {
        text: '训练宠物保持安静',
        effects: { happiness: -10, intimacy: 15 },
        success: '通过训练，宠物学会了在夜间保持安静。',
        failure: '训练效果不佳，宠物仍然偶尔吵闹。'
      },
      {
        text: '使用宠物笼/隔离',
        requiredItem: 'pet_carrier',
        effects: { happiness: -20, intimacy: -15 },
        success: '隔离减少了宠物的吵闹，但它看起来很不开心。',
        failure: '你没有合适的隔离工具。'
      },
      {
        text: '与邻居沟通并道歉',
        effects: { happiness: 5, intimacy: 5 },
        success: '邻居理解了你的困境，并同意给你时间训练宠物。',
        failure: '邻居对你的解释不满意，威胁要报警。'
      },
      {
        text: '去商店购买笼子',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了宠物笼。',
        failure: ''
      }
    ]
  },
  
  // 环境变化事件
  {
    id: 'move_home',
    title: '搬家',
    description: '你即将搬家到新的住所，需要考虑如何处理宠物的适应问题。',
    image: 'https://images.unsplash.com/photo-1596470187686-9ee2c1956c97?w=400&h=200&fit=crop',
    options: [
      {
        text: '带宠物一起搬家',
        cost: 50,
        effects: { happiness: -15, intimacy: 10 },
        success: '宠物逐渐适应了新的环境，变得和以前一样活泼。',
        failure: '你没有足够的钱支付搬家费用。'
      },
      {
        text: '寄养宠物',
        cost: 100,
        effects: { happiness: -25, intimacy: -20 },
        success: '宠物在寄养所得到了很好的照顾，你搬完家后接回了它。',
        failure: '你没有足够的钱支付寄养费用。'
      },
      {
        text: '提前带宠物熟悉新环境',
        effects: { happiness: -10, intimacy: 20 },
        success: '宠物提前熟悉了新环境，搬家后很快就适应了。',
        failure: '宠物对新环境感到恐惧，适应过程很艰难。'
      }
    ]
  },
  {
    id: 'business_trip',
    title: '出差',
    description: '你需要出差几天，宠物的照顾成为了问题。',
    image: 'https://images.unsplash.com/photo-1529429617124-a3eb161ffa5f?w=400&h=200&fit=crop',
    options: [
      {
        text: '请朋友帮忙照顾',
        effects: { happiness: -5, intimacy: 5 },
        success: '朋友把宠物照顾得很好，宠物没有感到太多不适。',
        failure: '朋友临时有事无法照顾，你陷入了困境。'
      },
      {
        text: '寄养宠物',
        cost: 80,
        effects: { happiness: -20, intimacy: -15 },
        success: '宠物在寄养所得到了照顾，你出差回来后接回了它。',
        failure: '你没有足够的钱支付寄养费用。'
      },
      {
        text: '请专业宠物保姆',
        cost: 150,
        effects: { happiness: 5, intimacy: 10 },
        success: '专业宠物保姆每天上门照顾宠物，宠物的生活没有受到影响。',
        failure: '你没有足够的钱聘请宠物保姆。'
      }
    ]
  },
  {
    id: 'guests_coming',
    title: '家里来客',
    description: '你的朋友要到家里来做客，而宠物对陌生人有些不友好。',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=200&fit=crop',
    options: [
      {
        text: '让宠物与客人互动',
        effects: { happiness: 10, intimacy: 5 },
        success: '宠物逐渐接受了客人，大家相处得很愉快。',
        failure: '宠物对客人非常不友好，甚至发起了攻击。'
      },
      {
        text: '将宠物隔离在房间',
        effects: { happiness: -15, intimacy: -10 },
        success: '宠物在房间里安静地待着，没有打扰到客人。',
        failure: '宠物在房间里不停地叫，影响了大家的聚会。'
      },
      {
        text: '提前训练宠物',
        requiredItem: 'training_treats',
        effects: { happiness: 5, intimacy: 15 },
        success: '通过提前训练，宠物学会了在客人面前保持友好。',
        failure: '你没有训练零食，训练效果不佳。'
      },
      {
        text: '去商店购买训练零食',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了训练零食。',
        failure: ''
      }
    ]
  },
  {
    id: 'weather_change',
    title: '天气突变',
    description: '天气突然变得恶劣，宠物表现出焦虑和不安。',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=200&fit=crop',
    options: [
      {
        text: '安抚宠物情绪',
        effects: { happiness: 20, intimacy: 15 },
        success: '你的安抚让宠物感到安全，逐渐平静下来。',
        failure: '宠物的焦虑情绪没有得到缓解。'
      },
      {
        text: '使用宠物窝提供安全感',
        requiredItem: 'pet_bed',
        effects: { happiness: 15, intimacy: 10 },
        success: '宠物在自己的窝里感到安全，很快就安静下来了。',
        failure: '你没有宠物窝，无法给宠物提供安全感。'
      },
      {
        text: '播放音乐转移注意力',
        effects: { happiness: 10, intimacy: 5 },
        success: '音乐成功转移了宠物的注意力，缓解了焦虑。',
        failure: '宠物对音乐没有反应，仍然很焦虑。'
      },
      {
        text: '去商店购买宠物窝',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了宠物窝。',
        failure: ''
      }
    ]
  },
  
  // 正向惊喜事件
  {
    id: 'learn_skill',
    title: '学会新技能',
    description: '宠物在你的训练下，学会了一个新的技能！',
    image: 'https://images.unsplash.com/photo-1596470187686-9ee2c1956c97?w=400&h=200&fit=crop',
    options: [
      {
        text: '给予奖励表扬',
        requiredItem: 'treats',
        effects: { happiness: 30, intimacy: 25 },
        success: '宠物得到奖励后非常开心，继续努力学习更多技能。',
        failure: '你没有奖励零食，宠物显得有些失望。'
      },
      {
        text: '拍摄视频记录',
        effects: { happiness: 20, intimacy: 15 },
        success: '你记录下了这个珍贵的时刻，宠物也感受到了你的快乐。',
        failure: ''
      },
      {
        text: '继续训练更多技能',
        effects: { happiness: 25, intimacy: 20, energy: -15 },
        success: '宠物在你的指导下，又学会了一个新技能！',
        failure: '宠物已经很累了，需要休息。'
      },
      {
        text: '去商店购买奖励零食',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了奖励零食。',
        failure: ''
      }
    ]
  },
  {
    id: 'affectionate_interaction',
    title: '黏人互动',
    description: '宠物今天特别黏人，一直跟着你，想要你的关注和抚摸。',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=200&fit=crop',
    options: [
      {
        text: '放下手中的事陪宠物玩',
        effects: { happiness: 35, intimacy: 30, energy: -10 },
        success: '你和宠物度过了愉快的时光，宠物的心情非常好。',
        failure: ''
      },
      {
        text: '边工作边抚摸宠物',
        effects: { happiness: 20, intimacy: 20 },
        success: '宠物满足于你的抚摸，安静地待在你身边。',
        failure: ''
      },
      {
        text: '给宠物一个玩具让它自己玩',
        requiredItem: 'toy_ball',
        effects: { happiness: 15, intimacy: 10 },
        success: '宠物玩得很开心，偶尔过来找你互动。',
        failure: '你没有合适的玩具，宠物显得有些无聊。'
      },
      {
        text: '去商店购买玩具',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了玩具。',
        failure: ''
      }
    ]
  },
  {
    id: 'health_check_pass',
    title: '健康体检通过',
    description: '宠物的健康体检结果非常好，所有指标都在正常范围内。',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=200&fit=crop',
    options: [
      {
        text: '给宠物买好吃的庆祝',
        cost: 40,
        effects: { happiness: 30, intimacy: 25 },
        success: '宠物吃得很开心，感受到了你对它健康的重视。',
        failure: '你没有足够的钱购买庆祝零食。'
      },
      {
        text: '带宠物去公园玩',
        effects: { happiness: 25, intimacy: 20, energy: -20 },
        success: '宠物在公园里玩得非常开心，释放了很多精力。',
        failure: ''
      },
      {
        text: '继续保持良好的护理习惯',
        effects: { happiness: 15, intimacy: 10, health: 5 },
        success: '你继续悉心照顾宠物，它的健康状况一直很好。',
        failure: ''
      },
      {
        text: '去商店购买庆祝零食',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了庆祝零食。',
        failure: ''
      }
    ]
  },
  
  // 季节/节日事件
  {
    id: 'shedding_season',
    title: '换毛季',
    description: '到了宠物的换毛季节，家里到处都是宠物的毛发。',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=200&fit=crop',
    options: [
      {
        text: '增加梳毛次数',
        requiredItem: 'pet_comb',
        effects: { happiness: 10, intimacy: 15 },
        success: '你经常给宠物梳毛，减少了家里的毛发，宠物也很享受梳毛的过程。',
        failure: '你没有宠物梳子，无法有效清理毛发。'
      },
      {
        text: '使用粘毛器清理',
        cost: 30,
        effects: { happiness: 5, intimacy: 5 },
        success: '粘毛器有效清理了家里的毛发，环境变得整洁了。',
        failure: '你没有足够的钱购买粘毛器。'
      },
      {
        text: '给宠物洗澡',
        requiredItem: 'pet_shampoo',
        effects: { happiness: -5, intimacy: 5, health: 5 },
        success: '洗澡清理了宠物身上的浮毛，减少了掉毛量。',
        failure: '你没有宠物香波，无法给宠物洗澡。'
      },
      {
        text: '去商店购买清洁用品',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了清洁用品。',
        failure: ''
      }
    ]
  },
  {
    id: 'spring_festival',
    title: '春节寄养',
    description: '春节期间你需要回老家，宠物的照顾成为了问题。',
    image: 'https://images.unsplash.com/photo-1596470187686-9ee2c1956c97?w=400&h=200&fit=crop',
    options: [
      {
        text: '寄养宠物',
        cost: 150,
        effects: { happiness: -20, intimacy: -15 },
        success: '宠物在寄养所度过了春节，你回来后接回了它。',
        failure: '你没有足够的钱支付寄养费用。'
      },
      {
        text: '带宠物一起回家',
        cost: 80,
        effects: { happiness: 15, intimacy: 25 },
        success: '宠物和你一起回了老家，度过了一个愉快的春节。',
        failure: '你没有足够的钱支付宠物的交通费。'
      },
      {
        text: '请人上门照顾',
        cost: 200,
        effects: { happiness: 10, intimacy: 10 },
        success: '宠物在家里得到了很好的照顾，没有感到孤独。',
        failure: '你没有足够的钱支付上门照顾的费用。'
      }
    ]
  },
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
        text: '去商店购买药物',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了药物。',
        failure: ''
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
        text: '去商店购买猫抓板',
        jumpToStore: true,
        effects: {},
        success: '你去商店购买了猫抓板。',
        failure: ''
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
