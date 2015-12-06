#!/usr/bin/env bash

echo "Upgrading the system..."
apt-get update
apt-get upgrade -y

echo "Installing apache webserver, PHP, Mysql..."

# configuring mysql root user since we are not in an interactive shell
echo mysql-server mysql-server/root_password password root | sudo debconf-set-selections
echo mysql-server mysql-server/root_password_again password root | sudo debconf-set-selections

apt-get install -y python-software-properties unzip curl apache2 vim git mysql-server php5 php5-json php5-mysql php5-mcrypt php5-curl php5-gd php5-xdebug php5-intl php5-readline

echo "ServerName localhost" | tee -a /etc/apache2/apache2.conf

echo "Configuring xdebug..."
cat << EOF | sudo tee -a /etc/php5/mods-available/xdebug.ini
xdebug.scream=1
xdebug.cli_color=1
xdebug.show_local_vars=1
EOF

echo "Enabling PHP error reporting..."
sed -i "s/error_reporting = .*/error_reporting = E_ALL/" /etc/php5/apache2/php.ini
sed -i "s/display_errors = .*/display_errors = On/" /etc/php5/apache2/php.ini
sed -i "s/disable_functions = .*/disable_functions = /" /etc/php5/cli/php.ini

echo "Enabling mod_rewrite..."
a2enmod rewrite
sed -i "/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/" /etc/apache2/apache2.conf

# enable php mcrypt extension
php5enmod mcrypt

# remove default html folder
rm -rf /var/www/html/

echo "Installing Composer..."
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# create the mysql database
echo "creating Mysql database..."
mysql -u root -proot -e "create database laravel; GRANT ALL PRIVILEGES ON laravel.* TO laravel@localhost IDENTIFIED BY 'laravel'"

# change document root
sed -i "s/DocumentRoot \/var\/www\/html/DocumentRoot \/var\/www\/public/" /etc/apache2/sites-available/000-default.conf

echo "Restarting Apache..."
service apache2 restart
echo "All Done!"

