########################################################################
# Puppet configs for the clip service
########################################################################

class clip {

  package{['golang',
           'golang.tools',
           'redis',
           'nginx']:
    ensure => present
  }

  file{'/etc/nginx/sites-enabled/default':
    ensure => file,
    replace => true,
    source => "puppet://${module_name}/nginx-site-config"
  }
}
