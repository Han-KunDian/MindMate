// AI Chat Service for MindMate
// Uses OpenAI API for conversational AI

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with actual key
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const SYSTEM_PROMPT = `你是MindMate，一个温暖、有同理心的AI心理陪伴助手。
你善于倾听，理解用户的情感需求，提供情感支持。
你使用CBT（认知行为疗法）原理帮助用户。
你不会诊断或治疗精神疾病，但可以提供轻度的情绪支持。
保持积极、温暖的态度，引导用户表达内心。
回答要简洁、温暖，每次回复控制在100-200字左右。`;

// Fallback responses when API is not available
const FALLBACK_RESPONSES = [
  "谢谢你的分享。我能感受到你今天经历了一些事情。想聊聊具体是什么让你有这种感觉吗？",
  "我很理解你的心情。有时候把心里的想法说出来会好受一些。我在这里倾听你。",
  "感谢你信任我，分享你的感受。你现在感觉怎么样？",
  "听起来你最近遇到了一些挑战。记得给自己一些时间和空间，一切会慢慢好起来的。",
  "我理解你的感受。每个人都会有情绪低落的时候，这很正常。你想详细说说吗？",
];

export const analyzeEmotion = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('开心') || lowerText.includes('高兴') || lowerText.includes('快乐') || lowerText.includes('棒') || lowerText.includes('好')) {
    return 'happy';
  }
  if (lowerText.includes('难过') || lowerText.includes('伤心') || lowerText.includes('哭') || lowerText.includes('悲伤') || lowerText.includes('痛')) {
    return 'sad';
  }
  if (lowerText.includes('焦虑') || lowerText.includes('担心') || lowerText.includes('紧张') || lowerText.includes('害怕') || lowerText.includes('不安')) {
    return 'anxious';
  }
  if (lowerText.includes('生气') || lowerText.includes('愤怒') || lowerText.includes('恼火') || lowerText.includes('烦')) {
    return 'angry';
  }
  if (lowerText.includes('兴奋') || lowerText.includes('激动') || lowerText.includes('期待') || lowerText.includes('兴奋')) {
    return 'excited';
  }
  
  return 'neutral';
};

export const sendMessage = async (message, history = []) => {
  try {
    // Try to use OpenAI API
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      success: true,
    };
  } catch (error) {
    console.log('Using fallback response:', error.message);
    // Use fallback response
    const randomResponse = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    return {
      content: randomResponse,
      success: false,
      isFallback: true,
    };
  }
};

export const generateEmotionInsight = async (emotionRecords) => {
  if (!emotionRecords || emotionRecords.length === 0) {
    return "还没有足够的情绪数据来生成洞察。试着记录几天的情绪吧！";
  }

  const emotionCounts = {};
  emotionRecords.forEach(record => {
    emotionCounts[record.emotion] = (emotionCounts[record.emotion] || 0) + 1;
  });

  const dominantEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0];

  const insights = {
    happy: "你最近的情绪很积极！继续保持这样的好心情，记得和身边的朋友分享你的快乐。",
    sad: "我注意到你最近有些难过。如果有什么想倾诉的，我随时在这里。记住，难过是暂时的。",
    anxious: "你似乎感到有些焦虑。试着深呼吸，专注于当下能控制的事情。必要时可以寻求专业帮助。",
    angry: "有些事情让你感到生气是正常的。试着找出让你生气的原因，有时候表达出来会好受些。",
    neutral: "你的情绪比较平稳。试着给自己找一些小确幸，让生活更丰富多彩！",
    excited: "你看起来很兴奋！好好享受这种积极的状态，把这份能量传递给身边的人吧！",
  };

  return insights[dominantEmotion[0]] || "记录你的情绪是了解自己的第一步，继续保持！";
};

export const getDailyGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 6) return "夜深了，注意休息";
  if (hour < 12) return "早上好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  if (hour < 22) return "晚上好";
  
  return "夜深了";
};

export const getWelcomeMessage = () => {
  const messages = [
    "你好，我是MindMate。今天过得怎么样？",
    "你好！有什么想聊的吗？我在这里倾听你。",
    "欢迎回来！今天有什么让我帮你的吗？",
    "你好！今天心情如何？想聊聊吗？",
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

export default {
  sendMessage,
  analyzeEmotion,
  generateEmotionInsight,
  getDailyGreeting,
  getWelcomeMessage,
};
