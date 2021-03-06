// https://github.com/capriza/node-busmq#browser-support

import busmq from 'busmq';

import { log } from './log.js';

log('bus starting...');

export const bus = busmq(`ws://${location.host}/bus/federated`, 'mysecret');

const SUBJECT = 'heartbeat';

export let pubsub;

bus.pubsub(SUBJECT, (err, ps) => {
  if (err) {
    log(`pubsub [${SUBJECT}]: err = ${err}`);
    return;
  }

  pubsub = ps;

  [
    'ready', 'subscribed', 'unsubscribed'
  ].forEach((event) => {
    pubsub.on(event, () => log(`pubsub [${SUBJECT}]: event = ${event}`));
  });

  [
    'reconnecting', 'reconnected'
  ].forEach((event) => {
    pubsub.fed.on(event, () => log(`pubsub.fed [${SUBJECT}]: event = ${event}`));
  });

  pubsub.on('message', (msg) => log(`pubsub [${SUBJECT}]: msg = ${msg}`));
  pubsub.on('error', (err) => log(`pubsub [${SUBJECT}]: err = ${err}`));

  pubsub.subscribe();

  setInterval(() => {
    pubsub.publish('ping');
  }, 15e3);
});
