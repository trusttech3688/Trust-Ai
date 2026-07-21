const projects = {};

module.exports = {
  save: (userId, projectName, files) => {
    if (!projects[userId]) projects[userId] = [];
    const existing = projects[userId].findIndex(p => p.name === projectName);
    if (existing >= 0) {
      projects[userId][existing] = { name: projectName, files, updatedAt: new Date() };
    } else {
      projects[userId].push({ name: projectName, files, createdAt: new Date() });
    }
  },
  get: (userId) => projects[userId] || [],
  delete: (userId, projectName) => {
    if (projects[userId]) {
      projects[userId] = projects[userId].filter(p => p.name !== projectName);
    }
  }
};