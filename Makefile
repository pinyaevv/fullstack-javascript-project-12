install:
	cd frontend && npm install     # Устанавливаем зависимости фронтенда
	npm ci                         # Устанавливаем зависимости бекенда

build:
	cd frontend && npm run build   # Сборка фронтенда

start:
	npx start-server -s ./frontend/dist  # Запуск продакшн-сервера

lint:
	cd frontend && npx eslint .    # Запуск линтера

fix:
	cd frontend && npx eslint --fix .  # Автоматическое исправление ошибок линтера