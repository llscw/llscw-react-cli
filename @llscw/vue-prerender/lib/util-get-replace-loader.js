const getReplaceLoader = (replace, currentEnv) => {
  const replacements = [];

  Object.keys(replace).forEach((key) => {
      replacements.push({
          search: key,
          replace() {
            return replace[key][currentEnv]
          },
      });
  });

  return replacements;
};

module.exports = getReplaceLoader;
