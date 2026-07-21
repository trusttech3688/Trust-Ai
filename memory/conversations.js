const conversations = {};

module.exports = {
  save: (userId, message, response) => {
    if (!conversations[userId]) conversations[userId] = [];
    conversations[userId].push({ role: 'user', content: message });
    conversations[userId].push({ role: 'assistant', content: response });
    if (conversations[userId].length > 20) {
      conversations[userId] = conversations[userId].slice(-20);
    }
  },
  get: (userId) => conversations[userId] || [],
  clear: (userId) => { conversations[userId] = []; }
};