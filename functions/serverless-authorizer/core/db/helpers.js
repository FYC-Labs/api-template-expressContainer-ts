const { COLLECTION_PREFIX } = process.env;

function getPrefixedCollection(name) {
  const prefix = COLLECTION_PREFIX || '';
  return `${prefix}${name}`;
}

module.exports.getPrefixedCollection = getPrefixedCollection;
