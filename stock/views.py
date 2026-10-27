from django.contrib.auth.hashers import check_password, make_password, identify_hasher
from django.utils.crypto import constant_time_compare
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import F, Q
from .models import Categorie, Fournisseur, Article, Utilisateur, Mouvement
from .serializers import (
    CategorieSerializer,
    FournisseurSerializer,
    ArticleSerializer,
    UtilisateurSerializer,
    MouvementSerializer
)


class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer


class FournisseurViewSet(viewsets.ModelViewSet):
    queryset = Fournisseur.objects.all()
    serializer_class = FournisseurSerializer


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer


class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer


class MouvementViewSet(viewsets.ModelViewSet):
    queryset = Mouvement.objects.all()
    serializer_class = MouvementSerializer

    def perform_create(self, serializer):
        mouvement = serializer.save()
        article = mouvement.id_article

        # Mise à jour automatique du stock selon le mouvement
        if mouvement.type.lower() == 'entree':
            article.quantite += mouvement.quantite
        elif mouvement.type.lower() == 'sortie':
            article.quantite -= mouvement.quantite

        article.save()


@api_view(['GET'])
def alertes_stock_critique(request):
    """Retourne les articles dont la quantité est <= au seuil minimum"""
    articles_critiques = Article.objects.filter(quantite__lte=F('seuil_minimum'))
    serializer = ArticleSerializer(articles_critiques, many=True)
    return Response(serializer.data)


def _est_hache(valeur):
    try:
        identify_hasher(valeur)
        return True
    except ValueError:
        return False


def _verifier_mot_de_passe(utilisateur, saisi):
    stocke = utilisateur.password or ''
    if _est_hache(stocke):
        return check_password(saisi, stocke)
    # Ancien mot de passe en clair : on le vérifie, puis on le hache pour la suite
    if constant_time_compare(stocke, saisi):
        utilisateur.password = make_password(saisi)
        utilisateur.save(update_fields=['password'])
        return True
    return False


@api_view(['POST'])
def login_view(request):
    """Connexion par nom ou email (casse ignorée)."""
    identifiant = (request.data.get('username') or request.data.get('email') or '').strip()
    password = request.data.get('password') or ''

    if not identifiant or not password:
        return Response({'error': "Veuillez fournir un identifiant et un mot de passe."},
                        status=status.HTTP_400_BAD_REQUEST)

    candidats = Utilisateur.objects.filter(Q(nom__iexact=identifiant) | Q(email__iexact=identifiant))
    for user in candidats:
        if _verifier_mot_de_passe(user, password):
            return Response({
                'message': 'Connexion réussie',
                'user': {
                    'id': user.id_utilisateur,
                    'nom': user.nom,
                    'email': user.email,
                    'role': user.role,
                },
            }, status=status.HTTP_200_OK)

    # Message unique : ne révèle pas si le compte existe
    return Response({'error': 'Identifiants incorrects.'}, status=status.HTTP_401_UNAUTHORIZED)