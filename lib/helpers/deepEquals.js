function deepEquals(obj1, obj2) {
  // Helper function to determine the path
  function createPath(base, additions) {
    if (!additions || additions.length === 0) return [base];
    return additions.map(addition => `${base}.${addition}`);
  }

  // Initial check for reference and type equality
  if (obj1 === obj2) return { equal: true, changes: [] };

  // Check if they are both objects
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    let changes = [];
    if (typeof obj1 === 'object' && obj1 !== null) {
      changes.push(...Object.keys(obj1));
    }
    if (typeof obj2 === 'object' && obj2 !== null) {
      for (let key of Object.keys(obj2)) {
        if (!changes.includes(key)) changes.push(key);
      }
    }
    return { equal: false, changes };
  }

  // Check if both objects have the same number of properties
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    const diffKeys = keys1.filter(k => !keys2.includes(k)).concat(keys2.filter(k => !keys1.includes(k)));
    return { equal: false, changes: diffKeys };
  }

  const changes = [];
  for (let key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
      const result = deepEquals(val1, val2);
      if (!result.equal) {
        changes.push(...createPath(key, result.changes));
      }
    } else if (val1 !== val2) {
      changes.push(key);
    }
  }

  return { equal: changes.length === 0, changes };
}

export default deepEquals;