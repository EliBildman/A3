const names = {
  RELEASE: 'release',
  DEV: 'dev',
};

const info = {
  [names.RELEASE]: {
    CREDS_PATH: `/certs/ssl/${process.env.CREDS_FILE}`,
    DB_NAME: `a3`,
  },
  [names.DEV]: {
    CREDS_PATH: `./ssl/${process.env.CREDS_FILE}`,
    DB_NAME: `a3_dev`,
  },
};

const CREDS_PATH = info[process.env.STAGE].CREDS_PATH;
const DB_NAME = info[process.env.STAGE].DB_NAME;

module.exports = {
  CREDS_PATH,
  DB_NAME,
};
