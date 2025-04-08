install:
	npm ci

start:
	npx start-server -s ./frontend/dist

build:
	cd frontend && npm run build

lint:
	npx eslint .

fix:
	npx eslint --fix .