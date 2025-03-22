
/**
 * Validates substitution rules JSON
 */
export const validateSubstitutionRules = (rulesJson: string): boolean => {
  try {
    const rules = JSON.parse(rulesJson);
    
    if (!rules.rules || !Array.isArray(rules.rules)) {
      return false;
    }
    
    // Проверяем базовую структуру правил
    for (const rule of rules.rules) {
      if (rule.type === 'table') {
        // Проверка правил для таблиц
        if (!rule.items || !rule.fields || !Array.isArray(rule.fields)) {
          return false;
        }
      } else if (!rule.placeholder || !rule.field) {
        // Проверка простых правил замены
        return false;
      }
    }
    
    return true;
  } catch (e) {
    return false;
  }
};
