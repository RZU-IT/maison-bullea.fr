# Maison Bulléa

Vitrine de savons artisanaux : identité pastel, découverte de l'atelier et catalogue de produits. Réalisation RZU Informatique en HTML, CSS et JavaScript.

[Voir le site](https://rzu-it.github.io/maison-bullea.fr/)

![Univers Maison Bulléa](assets/images/hero_savons_web.jpg)

## Parcourir le projet

`index.html` présente la maison et ses collections. `boutique.html` regroupe les produits et leurs fiches. Les styles et scripts sont dans `assets/` ; la navigation et le pied de page sont chargés depuis `partials/`.

Le catalogue reste côté navigateur. Ce dépôt ne contient pas de service de commande ou de paiement.

## Lancer en local

Depuis la racine du dépôt, avec Python installé :

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Ouvrir <http://127.0.0.1:8000/>. Le serveur HTTP permet de charger les éléments partagés de navigation.
