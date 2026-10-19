from django.db import models

class Categorie(models.Model):
    id_categorie = models.AutoField(primary_key=True)
    nom_categorie = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'categorie'

    def __str__(self):
        return self.nom_categorie


class Fournisseur(models.Model):
    id_fournisseur = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)
    contact = models.CharField(max_length=255, blank=True, null=True)
    telephone = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'fournisseur'

    def __str__(self):
        return self.nom


class Article(models.Model):
    id_article = models.AutoField(primary_key=True)
    reference = models.CharField(max_length=100, unique=True)
    designation = models.CharField(max_length=255)
    prix_achat = models.DecimalField(max_digits=12, decimal_places=2)
    prix_vente = models.DecimalField(max_digits=12, decimal_places=2)
    quantite = models.IntegerField(default=0)
    seuil_minimum = models.IntegerField(default=5)
    
    id_categorie = models.ForeignKey(
        Categorie, 
        on_delete=models.CASCADE, 
        db_column='id_categorie'
    )
    id_fournisseur = models.ForeignKey(
        Fournisseur, 
        on_delete=models.CASCADE, 
        db_column='id_fournisseur'
    )

    class Meta:
        db_table = 'article'

    def __str__(self):
        return f"{self.reference} - {self.designation}"


class Utilisateur(models.Model):
    id_utilisateur = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)
    role = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255, default='123456')  # Champ mot de passe ajouté

    class Meta:
        db_table = 'utilisateur'

    def __str__(self):
        return f"{self.nom} ({self.role})"


class Mouvement(models.Model):
    TYPE_CHOICES = [
        ('Entree', 'Entrée'),
        ('Sortie', 'Sortie'),
    ]

    id_mouvement = models.AutoField(primary_key=True)
    date = models.DateField(auto_now_add=True)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    quantite = models.IntegerField()
    motif = models.CharField(max_length=255, blank=True, null=True)
    
    id_article = models.ForeignKey(
        Article, 
        on_delete=models.CASCADE, 
        db_column='id_article'
    )
    id_utilisateur = models.ForeignKey(
        Utilisateur, 
        on_delete=models.CASCADE, 
        db_column='id_utilisateur'
    )

    class Meta:
        db_table = 'mouvement'

    def __str__(self):
        return f"{self.type} - {self.quantite} (Article ID: {self.id_article_id})"