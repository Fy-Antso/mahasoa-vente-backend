import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mahasoa_config.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from stock.models import Utilisateur

nom = os.getenv('ADMIN_USERNAME')
email = os.getenv('ADMIN_EMAIL')
mot_de_passe = os.getenv('ADMIN_PASSWORD')

if not (nom and email and mot_de_passe):
    print("ADMIN_USERNAME, ADMIN_EMAIL ou ADMIN_PASSWORD absent : aucun compte créé.")
else:
    # Compte Django (accès à /admin/)
    if not User.objects.filter(username=nom).exists():
        User.objects.create_superuser(nom, email, mot_de_passe)
        print("Superutilisateur Django créé.")
    else:
        print("Le superutilisateur Django existe déjà.")

    # Compte applicatif (connexion React)
    if not Utilisateur.objects.filter(email__iexact=email).exists():
        Utilisateur.objects.create(
            nom=nom, email=email, role='administrateur',
            password=make_password(mot_de_passe),
        )
        print("Utilisateur applicatif (administrateur) créé.")
    else:
        print("L'utilisateur applicatif existe déjà.")