from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategorieViewSet, 
    FournisseurViewSet, 
    ArticleViewSet, 
    UtilisateurViewSet, 
    MouvementViewSet,
    alertes_stock_critique,
    login_view  # <--- On importe la vue de connexion
)

router = DefaultRouter()
router.register(r'categories', CategorieViewSet)
router.register(r'fournisseurs', FournisseurViewSet)
router.register(r'articles', ArticleViewSet)
router.register(r'utilisateurs', UtilisateurViewSet)
router.register(r'mouvements', MouvementViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view, name='login'), # <--- Ajout du chemin d'accès requis par React
    path('alertes-stock/', alertes_stock_critique, name='alertes-stock'),
]