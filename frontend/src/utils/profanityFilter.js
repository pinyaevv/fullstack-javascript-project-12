import * as leoProfanity from 'leo-profanity'

export const loadDictionary = () => (leoProfanity.getDictionary().length === 0
  ? leoProfanity.loadDictionary('ru')
  : null)

export const filterProfanity = text => (text ? leoProfanity.clean(text) : text)

export const hasProfanity = text => (text ? leoProfanity.check(text) : false)
