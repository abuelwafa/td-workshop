# Egypt Car Shop Web scraper

A simple web scraper app for [EgyptCarShop](http://egyptcarshop.com)

## Development Dependencies
- [Virtual box](http://virtualbox.org/)
- [Vagrant](https://www.vagrantup.com/)
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/en/)
- [Bower](http://bower.io/)
- [Gulp](http://gulpjs.com/)

### Getting up and running
1- Run the vagrant virtual machine to boot up the server. Note that this will take a little long if you are running it for the first time since it will be downloading and installing ubuntu server, and the lamp stack.
```
vagrant up
```

2- Download dependencies and build the project assets.
```
composer install
bower install
npm install
gulp
```

3- Create your own environtment file `.env`, by copying the file `.env.example`.

4- Migrate and seed the database. and create a new applicatin key.
```
vagrant ssh
cd /var/www
php artisan migrate --seed
sudo php artisan key:generate
exit
```

5- Navigate to `http://localhost:8080` in your browser.

6- For development and starting to make changes, run `gulp develop` to watch project files and automatically build assets upon changes.
