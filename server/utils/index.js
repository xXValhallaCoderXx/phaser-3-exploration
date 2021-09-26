const SPAWN_TYPE = {
  CHEST: "CHEST",
  MONSTER: "MONSTER",
};

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * max) + min;
};

module.exports = {
  SPAWN_TYPE,
  randomNumber,
};
