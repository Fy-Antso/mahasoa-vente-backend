import pymysql
from django.db.backends.base.base import BaseDatabaseWrapper

# 1. Permet à PyMySQL de remplacer MySQLdb/mysqlclient
pymysql.install_as_MySQLdb()

# 2. Désactive la vérification stricte de version MariaDB/MySQL pour Django/XAMPP
BaseDatabaseWrapper.check_database_version_supported = lambda self: None