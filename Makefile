install:
	npm ci

start:
	npx start-server -s ./frontend/dist

build:
	cd frontend && npm run build

lint:
	cd frontend && npx eslint .

fix:
	cd frontend && npx eslint --fix .