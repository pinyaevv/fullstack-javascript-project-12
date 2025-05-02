import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      "login": "Вход в чат",
      "signup": "Регистрация",
      "logout": "Выйти",
      "cancel": "Отмена",
      "save": "Сохранить",
      "create": "Создать",
      "delete": "Удалить",
      "rename": "Переименовать",
      "channels": "Каналы",
      "no_channel_selected": "Канал не выбран",
      "message_placeholder": "Введите сообщение...",
      "return_to_main": "Вернуться на главную",
      "send": "Отправить",
      
      // Формы
      "username": "Имя пользователя",
      "password": "Пароль",
      "confirm_password": "Подтверждение пароля",
      "channel_name": "Имя канала",
      
      // Валидация
      "required_field": "Обязательное поле",
      "min_3_max_20": "От 3 до 20 символов",
      "min_6": "Минимум 6 символов",
      "min_3": "Минимум 3 символа",
      "passwords_must_match": "Пароли должны совпадать",
      "channel_exists": "Канал с таким именем уже существует",
      
      // Модальные окна
      "rename_channel": "Переименовать канал",
      "delete_channel": "Удалить канал",
      "delete_channel_confirmation": "Вы уверены, что хотите удалить канал?",
      "create_channel": "Создать канал",
      
      // Ошибки
      "error": "Ошибка:",
      "404_error": "404 — Страница не найдена",
      "auth_error": "Ошибка авторизации",
      "registration_error": "Ошибка регистрации",
      "renaming_error": "Ошибка переименования",
      "delete_error": "Произошла ошибка при удалении канала",
      "network_error": "Ошибка сети",
      "server_didn\'t_ret_tok": "Сервер не вернул токен",
      "token_verification_error": "Ошибка верификации токена:",
      "incorrect_log_or_pas": "Неверный логин или пароль",
      "user_exists": "Пользователь уже существует",
      "channel_id_missing": "Идентификатор канала отсутствует",
      
      // Ссылки
      "no_account": "Нет аккаунта?",
      "have_account": "Уже есть аккаунт?",
      "register": "Зарегистрироваться",
      "login_link": "Войти"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ru",
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
