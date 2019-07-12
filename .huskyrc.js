module.exports = {
  hooks: {
    "pre-commit": "ENVFILE=.env.development npm run load-env && lint-staged"
  },
};
