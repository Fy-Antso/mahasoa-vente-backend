from django.apps import AppConfig


class StockConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'stock'

    def ready(self):
        # Surcharge propre exécutée dès le démarrage de Django pour neutraliser RETURNING sous MariaDB
        from django.db.backends.mysql.base import DatabaseOperations
        DatabaseOperations.return_insert_columns = lambda self, fields: None