from django.contrib.auth.hashers import make_password
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
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        mot_de_passe = validated_data.pop('password', None)
        if not mot_de_passe:
            raise serializers.ValidationError({'password': 'Le mot de passe est obligatoire.'})
        validated_data['password'] = make_password(mot_de_passe)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        mot_de_passe = validated_data.pop('password', None)
        if mot_de_passe:
            validated_data['password'] = make_password(mot_de_passe)
        return super().update(instance, validated_data)


class MouvementSerializer(serializers.ModelSerializer):
    designation_article = serializers.ReadOnlyField(source='id_article.designation')
    nom_utilisateur = serializers.ReadOnlyField(source='id_utilisateur.nom')

    class Meta:
        model = Mouvement
        fields = '__all__'