function checkBody(body, keys) {
  let isValid = true;

  for (const field of keys) {
    // if (!body[field] || body[field] === '') {
    if (body[field] === "") {
      isValid = false;
    }
  }

  return isValid;
}

module.exports = { checkBody };

