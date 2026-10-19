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


@api_view(['POST'])
def login_view(request):
    """Gère la connexion pour l'Administrateur et le Magasinier par Nom d'utilisateur ou Email"""
    # Récupère 'username' ou 'email' depuis la requête React
    identifier = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')

    if not identifier or not password:
        return Response({'error': 'Veuillez fournir un nom d\'utilisateur/email et un mot de passe.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Recherche l'utilisateur soit par son nom (ex: fyantso) soit par son email
        user = Utilisateur.objects.get(Q(nom=identifier) | Q(email=identifier))
        
        if user.password == password:  
            return Response({
                'message': 'Connexion réussie',
                'user': {
                    'id': user.id_utilisateur,
                    'nom': user.nom,
                    'email': user.email,
                    'role': user.role
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Mot de passe incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
            
    except Utilisateur.DoesNotExist:
        return Response({'error': 'Utilisateur introuvable.'}, status=status.HTTP_404_NOT_FOUND)
    except Utilisateur.MultipleObjectsReturned:
        # Sécurité au cas où deux utilisateurs auraient le même nom
        user = Utilisateur.objects.filter(Q(nom=identifier) | Q(email=identifier)).first()
        if user and user.password == password:
            return Response({
                'message': 'Connexion réussie',
                'user': {
                    'id': user.id_utilisateur,
                    'nom': user.nom,
                    'email': user.email,
                    'role': user.role
                }
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Identifiants incorrects.'}, status=status.HTTP_400_BAD_REQUEST)