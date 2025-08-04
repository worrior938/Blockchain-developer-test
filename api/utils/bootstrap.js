const path = require('path');

const initAppBootstrap = async () => {
    // Safe bootstrap initialization
    console.log('App bootstrap initialized safely');
}

const initCAppBootstrap = async () => {
    // Safe client app bootstrap initialization
    console.log('Client app bootstrap initialized safely');
}

module.exports = {
  initAppBootstrap,
  initCAppBootstrap
};