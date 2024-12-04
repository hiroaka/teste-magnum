FROM php:8.2-fpm

# configurar o username
ARG user=carlos
ARG uid=1000

# dependecias do sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# limpeza geral
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Extensions do PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd sockets

# Configurar o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Criar um usuario do sistema para rodar os comandos 
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user


# Diretorio de trabalho
WORKDIR /var/www

# Configurações do PHP
COPY docker/php/custom.ini /usr/local/etc/php/conf.d/custom.ini

USER $user