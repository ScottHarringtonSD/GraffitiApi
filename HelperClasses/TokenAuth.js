class TokenAuth {
  static tokenAuth(rawHeaders) {
    let token = "";

    for (let i = 0; i < rawHeaders.length; i++) {
      if (rawHeaders[i] === "Auth") {
        token = rawHeaders[i + 1];
      }
    }
  }
}

module.exports = TokenAuth;
