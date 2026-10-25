import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mahasoa_config.settings')
django.setup()

from django.contrib.auth.models import User

if not User.objects.filter(username='Mahasoa').exists():
    User.objects.create_superuser('Mahasoa', 'admin@gmail.com', 'mahasoa123')
    print("Superutilisateur créé avec succès !")
else:
    print("Le superutilisateur existe déjà.")