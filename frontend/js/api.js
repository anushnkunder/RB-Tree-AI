// API Client for backend communication

const API_BASE_URL = '/api';

const api = {
  // Tree operations
  async insert(treeType, value) {
    const response = await fetch(`${API_BASE_URL}/insert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ treeType, value })
    });
    return response.json();
  },

  async delete(treeType, value) {
    const response = await fetch(`${API_BASE_URL}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ treeType, value })
    });
    return response.json();
  },

  async search(treeType, value) {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ treeType, value })
    });
    return response.json();
  },

  async getTree(treeType) {
    const response = await fetch(`${API_BASE_URL}/tree/${treeType}`);
    return response.json();
  },

  async resetTree(treeType) {
    const response = await fetch(`${API_BASE_URL}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ treeType })
    });
    return response.json();
  },

  async exportTree(treeType) {
    const response = await fetch(`${API_BASE_URL}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ treeType })
    });
    return response.json();
  },

  async importTree(data) {
    const response = await fetch(`${API_BASE_URL}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });
    return response.json();
  },

  // Performance comparison
  async comparePerformance(sequence = null, generateRandom = false, nodeCount = null) {
    const body = {};
    if (sequence) body.sequence = sequence;
    if (generateRandom) {
      body.generateRandom = true;
      body.nodeCount = nodeCount;
    }

    const response = await fetch(`${API_BASE_URL}/performance/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return response.json();
  },

  // Analytics
  async runExperiment(pattern, trials, maxNodes) {
    const response = await fetch(`${API_BASE_URL}/analytics/experiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pattern, trials, maxNodes })
    });
    return response.json();
  },

  async getExperimentHistory(pattern = null, limit = 10) {
    const params = new URLSearchParams();
    if (pattern) params.append('pattern', pattern);
    params.append('limit', limit);

    const response = await fetch(`${API_BASE_URL}/analytics/experiments?${params}`);
    return response.json();
  },

  // History
  async getHistory(treeType = null, startDate = null, endDate = null, limit = 100) {
    const params = new URLSearchParams();
    if (treeType) params.append('treeType', treeType);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('limit', limit);

    const response = await fetch(`${API_BASE_URL}/history?${params}`);
    return response.json();
  },

  async clearHistory(treeType = null) {
    const response = await fetch(`${API_BASE_URL}/history/clear`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ treeType })
    });
    return response.json();
  }
};
