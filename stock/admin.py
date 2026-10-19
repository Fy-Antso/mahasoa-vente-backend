from django.contrib import admin
from .models import Categorie, Fournisseur, Article, Utilisateur, Mouvement

@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ('id_categorie', 'nom_categorie', 'description')
    search_fields = ('nom_categorie',)

@admin.register(Fournisseur)
class FournisseurAdmin(admin.ModelAdmin):
    list_display = ('id_fournisseur', 'nom', 'contact', 'telephone')
    search_fields = ('nom', 'telephone')

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('id_article', 'reference', 'designation', 'prix_achat', 'prix_vente', 'quantite', 'seuil_minimum', 'id_categorie', 'id_fournisseur')
    list_filter = ('id_categorie', 'id_fournisseur')
    search_fields = ('reference', 'designation')

@admin.register(Utilisateur)
class UtilisateurAdmin(admin.ModelAdmin):
    list_display = ('id_utilisateur', 'nom', 'role', 'email')
    search_fields = ('nom', 'email', 'role')

@admin.register(Mouvement)
class MouvementAdmin(admin.ModelAdmin):
    list_display = ('id_mouvement', 'date', 'type', 'quantite', 'motif', 'id_article', 'id_utilisateur')
    list_filter = ('type', 'date')
    search_fields = ('motif',)