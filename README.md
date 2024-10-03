# Облачное хранилище My Cloud

Развернутое приложение на сервере можно посмотреть [здесь](http://89.108.76.89:3000).

## 1. Локальный запуск приложения на ПК

1. Запускаем терминал в директории, где планируется разместить папку с файлами проекта
2. Клонируем репозиторий:\
   `git clone https://github.com/freelandos/Diplom_MyCloud.git`
3. Открываем папку `Diplom_MyCloud` в любой IDE и запускаем встроенный терминал
---
4. Переходим в папку `backend`:\
   `cd backend`
5. Создаем виртуальное окружение:\
   `python -m venv venv`
6. Активируем виртуальное окружение:\
   `venv/Scripts/activate`
7. Устанавливаем зависимости:\
   `pip install -r requirements.txt`
8. В папке `backend` создаем файл `.env` в соответствии с шаблоном `env.template`:
9. Создаем базу данных, с учетом настроек указанных в файле `.env`:\
   `createdb -U <DB_USER> <DB_NAME>`\
   Пароль: `<DB_PASSWORD>`
10. Применяем миграции:\
   `python manage.py migrate`
11. Создаем администратора (суперпользователя) с указанными в файле `.env` данными:\
   `python manage.py create_superuser`
12. Запускаем сервер:\
   `python manage.py runserver`
---
13. Открываем отдельный терминал и переходим в папку `frontend`
14. В файле `.env` указываем следующий базовый URL:\
   `VITE_BASE_URL=http://localhost:8000/api`
15. Устанавливаем зависимости:\
   `npm i`
16. Запускаем приложение:\
   `npm run dev`

## 2. Развертывание приложения на сервере

1. Устанавливаем на ПК программу [PuTTY](https://www.putty.org/) для генерации SSH-ключа
2. Запускаем PuTTYgen и генерируем SSH-ключ. Копируем публичный SSH-ключ
3. Создаем на сайте [reg.ru](https://cloud.reg.ru) облачный сервер:
   - образ - `Ubuntu 22.04 LTS`,
   - тип диска - `Стандартный`,
   - тариф - `Base-1`,
   - регион размещения - `Москва`.

   Добавляем новый SSH-ключ, используя ранее сгенерированный публичный SSH-ключ.\
   Указываем название ключа (например название ПК).\
   Указываем название сервера (например название проекта).\
   Нажимаем кнопку `Заказать сервер`
4. Запускаем терминал (например Git Bash) и подключаемся к серверу:\
   `ssh root@<ip адрес сервера>`\
   Подтверждаем действие: `yes`\
   Вводим пароль для доступа к серверу из письма, полученного на эл. почту
---
5. Создаем нового пользователя:\
   `adduser <имя пользователя>`
6. Добавляем созданного пользователя в группу `sudo`:\
   `usermod <имя пользователя> -aG sudo`
7. Выходим из под пользователя `root`:\
   `logout`
8. Подключаемся к серверу под новым пользователем:\
   `ssh <имя пользователя>@<ip адрес сервера>`
---
9. Скачаем обновления пакетов `apt`, чтобы пользоваться их актуальными релизами:\
   `sudo apt update`
10. Устанавливаем необходимые пакеты:\
   `sudo apt install python3-venv python3-pip postgresql nginx`
---
11. Заходим в панель `psql` под пользователем `postgres`:\
   `sudo -u postgres psql`
12. Создаем базу данных:\
   `CREATE DATABASE mycloud;`
13. Задаем пароль для пользователя `postgres`:\
   `ALTER USER postgres WITH PASSWORD 'postgres';`
14. Выходим из панели `psql`:\
    `\q`
---
15. Проверяем что установлен `Git`:\
   `git --version`
16. Клонируем репозиторий:\
   `git clone https://github.com/freelandos/Diplom_MyCloud.git`
17. Переходим в папку проекта `backend`:\
   `cd /home/<имя пользователя>/Diplom_MyCloud/backend`
18. Устанавливаем виртуальное окружение:\
   `python3 -m venv env`
19. Активируем виртуальное окружение:\
   `source env/bin/activate`
20. Устанавливаем зависимости:\
   `pip install -r requirements.txt`
---
21. В папке `backend` создаем файл `.env` в соответствии с шаблоном `env.template`:\
   `nano .env`
22. Применяем миграции:\
   `python manage.py migrate`
23. Создаем администратора (суперпользователя):\
   `python manage.py create_superuser`
24. Собираем весь статичный контент в одной папке (`static`) на сервере:\
   `python manage.py collectstatic`
25. Запускаем сервер:\
   `python manage.py runserver 0.0.0.0:8000`
---
26. Проверяем работу `gunicorn`:\
   `gunicorn mycloud.wsgi -b 0.0.0.0:8000`
27. Создаем файл `gunicorn.socket`:\
   `sudo nano /etc/systemd/system/gunicorn.socket`

      ```
      [Unit]
      Description=gunicorn socket

      [Socket]
      ListenStream=/run/gunicorn.sock

      [Install]
      WantedBy=sockets.target
      ```
28. Создаем файл `gunicorn.service`:\
   `sudo nano /etc/systemd/system/gunicorn.service`

      ```
      [Unit]
      Description=gunicorn daemon
      Requires=gunicorn.socket
      After=network.target

      [Service]
      User=<имя пользователя>
      Group=www-data
      WorkingDirectory=/home/<имя пользователя>/Diplom_MyCloud/backend
      ExecStart=/home/<имя пользователя>/Diplom_MyCloud/backend/env/bin/gunicorn \
               --access-logfile - \
               --workers=3 \
               --bind unix:/run/gunicorn.sock \
               mycloud.wsgi:application

      [Install]
      WantedBy=multi-user.target
      ```
29. Запускаем файл `gunicorn.socket`:\
   `sudo systemctl start gunicorn.socket`\
   `sudo systemctl enable gunicorn.socket`
30. Проверяем статус файла `gunicorn.socket`:\
   `sudo systemctl status gunicorn.socket`
31. Убеждаемся что файл `gunicorn.sock` присутствует в папке `/run`:\
   `file /run/gunicorn.sock`
32. Проверяем статус `gunicorn`:\
   `sudo systemctl status gunicorn`
---
33. Создаем модуль `nginx`:\
   `sudo nano /etc/nginx/sites-available/mycloud`

      ```
      server {
         listen 80;
         server_name <ip адрес сервера>;

         location = /favicon.ico {
            access_log off;
            log_not_found off;
         }

         location /static/ {
            root /home/<имя пользователя>/Diplom_MyCloud/backend;
         }

         location / {
            include proxy_params;
            proxy_pass http://unix:/run/gunicorn.sock;
         }
      }
      ```
34. Создаем символическую ссылку:\
   `sudo ln -s /etc/nginx/sites-available/mycloud /etc/nginx/sites-enabled`
35. Добавляем пользователя `www-data` в группу текущего пользователя:\
   `sudo usermod -a -G ${USER} www-data`
36. Диагностируем `nginx` на предмет ошибок в синтаксисе:\
   `sudo nginx -t`
37. Перезапускаем веб-сервер:\
   `sudo systemctl restart nginx`
38. Проверяем статус `nginx`:\
   `sudo systemctl status nginx`
39. При помощи `firewall` даем полные права `nginx` для подключений:\
   `sudo ufw allow 'Nginx Full'`
---
40. Устанавливаем [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm):\
   `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`
41. Добавляем переменную окружения:

      ```
      export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
      ```
42. Проверяем версию `nvm`:\
   `nvm -v`
43. Устанавливаем нужную версию `node`:\
   `nvm install <номер версии>`
44. Проверяем версию `node`:\
   `node -v`
45. Проверяем версию `npm`:\
   `npm -v`
---
46. Переходим в папку проекта `frontend`:\
   `cd /home/<имя пользователя>/Diplom_MyCloud/frontend`
47. Устанавливаем базовый URL в файле `.env`:\
   `nano .env`\
   `VITE_BASE_URL=http://<ip адрес сервера>/api`
48. Устанавливаем зависимости:\
   `npm i`
49. Создаем файл `start.sh`:\
   `nano start.sh`

      ```
      #!/bin/bash
      . /home/<имя пользователя>/.nvm/nvm.sh
      npm run dev
      ```
50. Делаем файл `start.sh` исполняемым:\
   `chmod +x /home/<имя пользователя>/Diplom_MyCloud/frontend/start.sh`
51. Создаем файл `frontend.service`:\
   `sudo nano /etc/systemd/system/frontend.service`

      ```
      [Unit]
      Description=frontend service
      After=network.target

      [Service]
      User=<имя пользователя>
      Group=www-data
      WorkingDirectory=/home/<имя пользователя>/Diplom_MyCloud/frontend
      ExecStart=/home/<имя пользователя>/Diplom_MyCloud/frontend/start.sh

      [Install]
      WantedBy=multi-user.target
      ```
52. Запускаем сервис `frontend`:\
   `sudo systemctl start frontend`\
   `sudo systemctl enable frontend`
53. Проверяем статус сервиса `frontend`:\
   `sudo systemctl status frontend`
---
54. Проверяем доступность сайта по адресу:\
   `http://<ip адрес сервера>:3000`
55. Проверяем доступность административной части сайта по адресу:\
   `http://<ip адрес сервера>/admin/`
