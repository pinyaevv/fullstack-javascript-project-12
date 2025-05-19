import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      auth: {
        no_account: 'Нет аккаунта?',
        have_account: 'Уже есть аккаунт?',
        register: 'Регистрация',
        login_link: 'Войти',
      },

      notify: {
        network_error: 'Ошибка соединения',
        auth_error: 'Ошибка авторизации',
        load_error: 'Ошибка загрузки данных',

        channel_added: 'Канал создан',
        channel_renamed: 'Канал переименован',
        channel_removed: 'Канал удален',

        channel_added_error: 'Ошибка при создании канала',
        channel_renamed_error: 'Ошибка при переименовании канала',
        channel_removed_error: 'Ошибка при удалении канала',

        registration_success: 'Данные успешно загружены',

        required_field: 'Обязательное поле',
        min_length: 'Минимум {{count}} символов',
        passwords_mismatch: 'Пароли не совпадают',
      },

      ui_interface: {
        login: 'Войти',
        signup: 'Регистрация',
        logout: 'Выйти',
        cancel: 'Отмена',
        open: 'Открыть',
        save: 'Сохранить',
        create: 'Создать',
        delete: 'Удалить',
        rename: 'Переименовать',
        channels: 'Каналы',
        no_channel_selected: 'Канал не выбран',
        message_placeholder: 'Введите сообщение...',
        return_to_main: 'Вернуться на главную',
        send: 'Отправить',
        new_message: 'Новое сообщение',
      },

      form: {
        nickname: 'Ваш ник',
        username: 'Имя пользователя',
        password: 'Пароль',
        confirm_password: 'Подтвердите пароль',
      },

      validation: {
        incorrect_name_or_pas: 'Неверные имя пользователя или пароль',
        required_field: 'Обязательное поле',
        min_3_max_20: 'От 3 до 20 символов',
        min_3: 'Не менее 3 символов',
        min_6: 'Не менее 6 символов',
        passwords_must_match: 'Пароли должны совпадать',
        channel_exists: 'Канал с таким именем уже существует',
      },

      modal_window: {
        channel_name: 'Имя канала',
        rename_channel: 'Переименовать канал',
        delete_channel: 'Удалить канал',
        delete_channel_confirmation: 'Вы уверены, что хотите удалить канал?',
        create_channel: 'Имя канала',
      },

      errors: {
        error: 'Ошибка:',
        not_found_error: '404 — Страница не найдена',
        auth_error: 'Ошибка авторизации',
        registration_error: 'Ошибка регистрации',
        renaming_error: 'Ошибка переименования',
        delete_error: 'Произошла ошибка при удалении канала',
        network_error: 'Ошибка сети',
        server_did_not_return_token: 'Сервер не вернул токен',
        token_verification_error: 'Ошибка верификации токена:',
        incorrect_login_or_password: 'Неверные имя пользователя или пароль',
        user_exists: 'Такой пользователь уже существует',
        channel_id_missing: 'Идентификатор канала отсутствует',
      },

      profanity: {
        has_profanity: 'Название содержит недопустимые слова',
      },
    },
  },
};

i18n.use(initReactI18next);
i18n.init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
