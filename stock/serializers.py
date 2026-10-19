from rest_framework import serializers
from .models import Categorie, Fournisseur, Article, Utilisateur, Mouvement

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'


class FournisseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fournisseur
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):
    nom_categorie = serializers.ReadOnlyField(source='id_categorie.nom_categorie')
    nom_fournisseur = serializers.ReadOnlyField(source='id_fournisseur.nom')

    class Meta:
        model = Article
        fields = '__all__'


class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = '__all__'


class MouvementSerializer(serializers.ModelSerializer):
    designation_article = serializers.ReadOnlyField(source='id_article.designation')
    nom_utilisateur = serializers.ReadOnlyField(source='id_utilisateur.nom')

    class Meta:
        model = Mouvement
        fields = '__all__'