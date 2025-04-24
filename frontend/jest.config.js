const dotenv = require('dotenv');

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy"
  }
};
