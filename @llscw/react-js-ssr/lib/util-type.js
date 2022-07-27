const MAX_SAFE_INTEGER = 9007199254740991

function isLength(value) {
  return typeof value === 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER
}

function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength(value.length)
}

function isObjectLike(value) {
  return typeof value === 'object' && value !== null
}

module.exports = {
  isArrayLike,
  isObjectLike
}