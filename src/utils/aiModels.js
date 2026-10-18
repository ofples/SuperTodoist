const DEFAULT_AI_MODEL = 'gpt-6-luna';
const DEFAULT_AI_MODELS = [DEFAULT_AI_MODEL, 'gpt-6.1-sol'];

function normalizeAIModels(models, currentModel) {
  const result = [];
  const savedModels = Array.isArray(models) ? models : DEFAULT_AI_MODELS;
  for (const model of [...savedModels, currentModel]) {
    if (typeof model !== 'string') continue;
    const value = model.trim();
    if (value && !result.includes(value)) result.push(value);
  }
  return result;
}

function addAIModel(models, model) {
  const value = typeof model === 'string' ? model.trim() : '';
  return value ? normalizeAIModels([...models, value]) : normalizeAIModels(models);
}

function removeAIModel(models, model) {
  return normalizeAIModels(models.filter(item => item !== model));
}

module.exports = {DEFAULT_AI_MODEL, DEFAULT_AI_MODELS, normalizeAIModels, addAIModel, removeAIModel};
