from django.db.backends.mysql.base import DatabaseOperations, DatabaseWrapper as MySQLDatabaseWrapper

class NoReturningDatabaseOperations(DatabaseOperations):
    def return_insert_columns(self, fields):
        # Désactive explicitement la clause RETURNING non supportée par MariaDB
        return None

class DatabaseWrapper(MySQLDatabaseWrapper):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Surcharge propre et locale du gestionnaire d'opérations pour ce moteur uniquement
        self.ops = NoReturningDatabaseOperations(self)