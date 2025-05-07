import * as leoProfanity from 'leo-profanity';

leoProfanity.loadDictionary('ru');

export const filterProfanity = (text) => {
  if (!text) return text;
  return leoProfanity.clean(text);
};

export const hasProfanity = (text) => {
  if (!text) return false;
  return leoProfanity.check(text);
};
