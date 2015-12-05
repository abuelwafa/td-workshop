# Egypt Car Shop Web scraper

A simple web scraper app for [EgyptCarShop](http://egyptcarshop.com)

## Development Dependencies
- [Virtual box](http://virtualbox.org/)
- [Vagrant](https://www.vagrantup.com/)
- [Node.js](https://nodejs.org/en/)
- [Bower](http://bower.io/)
- [Gulp](http://gulpjs.com/)

### Getting up and running
1- Run the vagrant virtual machine to boot up the server. Note that this will take a little long if you are running it for the first time since it will be downloading and installing ubuntu server, and the lamp stack.
```
vagrant up
```

2- Build the project assets.
```
npm install
```

3- Migrate and seed the database.
```
vagrant ssh
cd /var/www/html
php artisan migrate --seed
exit
```

4- Navigate to `http://localhost:8080` in your browser.

5- For development and starting to make changes, run `gulp develop` to watch project files and automatically build assets upon changes.
