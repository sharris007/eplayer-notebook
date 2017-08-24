set $date=%date%
set $date=%$date:/=-%

./node_modules/.bin/allure generate --clean allure-results_%$date%