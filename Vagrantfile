# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
    config.vm.box = "ubuntu/trusty64"

    config.vm.network "forwarded_port", guest: 80, host: 8080

    config.vm.synced_folder ".", "/var/www", id: "vagrant", owner: "www-data", group: "www-data"

    config.vm.provider "virtualbox" do |vb|
        vb.customize ["modifyvm", :id, "--memory", "512"]
        vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
        vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
        vb.name = File.basename(Dir.pwd)
    end

    config.vm.provision "shell", path: "vm-bootstrap.sh"

end
