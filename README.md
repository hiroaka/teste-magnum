<<<<<<< HEAD
# Teste Programador PHP

## Framework: Laravel

O framework escolhido foi o Laravel. PPara projetos em PHP tenho escolhido sempre pela a sua robustez e elegância. Projetos feitos com Laravel tendem a ser mais organizados e optimizados por natureza do design dele.

## Instalação
=======
## Teste Programador PHP
>>>>>>> 4c1699580fafbcd2e5f2155710a55984fa286588

Para rodar o projeto, clone este projeto

```
git clone https://github.com/hiroaka/teste-magnum
```

Acessar o código
```
cd teste-magnum
```

Editar as configurações de ENV

```
cp .env.example .env
```

Modifique as variaveis caso necessário

```
APP_NAME="Teste Magnum"
APP_URL=http://localhost:8989

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=admin
DB_USERNAME=app
DB_PASSWORD=password

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```


Iniciar o docker
```
docker-compose up -d
```

Acesse o container

```
docker-compose exec app bash
```

Instale as dependecias do composer
```
composer install
```

gerar chave da aplicaçãdo do Laravel
```
php artisan key:generate
```

Rodar as migration para configurar o banco inicial
```
php artisan migrate --seed
```

Configurar o secret do JWT
```
php artisan jwt:secret
```
Acesse a aplicação em `http://localhost:8989`