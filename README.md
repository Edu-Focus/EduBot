
  

# EduBot 

## Présentation

  

EduBot est le bot discord officiel d'Edu-Focus. Vous vous trouvez actuellement sur le répertoire de son code source. EduBot possède beaucoup de fonctionnalités en raport avec le site web [Edu-Focus](https://edu-focus.org) comme par exemple le "rankupdate" (qui permet de synchroniser son grade sur le site d'Edu-Focus et sur discord) ou encore le "userinfo" (qui permet notamment d'avoir des informations diverses sur un utilisateur d'Edu-Focus)

  

## Instalation

  

Si vous voulez avoir ce bot sur votre serveur discord, deux possibilités s'offrent à vous :

  

### 1- Utiliser le bot public (avec des fonctionnalités en moins car il doit s'adapter a tous)

  

Si vous voulez utiliser cette option, rien de plus simple, il suffit juste de cliquer sur le lien d'invitation pour inviter le bot sur votre serveur discord (assurez vous d'avoir la permission d'inviter des bots sur le serveur en question)

  

Lien d'invitation : "Pas encore disponible"

  

### 2- Utiliser le code source et faire son propre bot

  

Cette option est un peu plus compliqué et plus lente mais vous permet d'avoir un bot 100% customisable

  

#### 2.1 - Prérequis

  

Pour commencer assurez vous d'avoir un éditeur de code comme [VisualStudioCode](https://code.visualstudio.com/Download) et [NodeJS](https://nodejs.org/fr/download/)

  

#### 2.2 - Installation des dépendances

  

Tout d'abord, pour construire votre propre bot il va falloir télécharger le code source du bot

Pour cela ouvrez cliquez sur le bouton "Télécharger ZIP" (ou "Download ZIP")

  

![](https://edu-focus.org/assets/media/9768188a35db3d0931231e951b45661f045f87575da36b2d512671ebb46b.png)

  

Une fois le fichier sur votre bureau, extrayez tout le contenu du zip sur votre bureau. Normalement le dossier que vous avez extrait devrait s'appeler "EduBot-master" vous pouvez renommez ce dernier comme bon vous semble.

Maintenant que vous avez le code source sur votre ordinateur, il faut ajouter les dépendances de NodeJS qui le permettrons de faire marcher le bot discord. Pour cela rien de plus simple, copiez le chemin d'accès du dossier

  

![](https://edu-focus.org/assets/media/a2d03edad21909fd31d1e94105f96d0a9b6f1bf011d5f7effd11ee6f1f73.png)

  

Une fois fait ouvrez nodeJS et executez les commandes suivantes :

  

    cd <Chemin d'acces au code source du bot>
    npm i

Une fois cela fait, toutes les dépendances nécessaires au bon fonctionnement du bot devraient être installés

#### 2.3 Configuration
Maintenant, il suffit d'ouvrir le dossier config, de  et de remplir tous les fichiers de ce dernier en fonction des commentaires laissés au dessus des champs à remplir

#### 2.4 Finalisation 
Maintenant il ne reste plus qu'a héberger votre bot discord pour qu'il puisse fonctionner jour et nuit

## Contribution au développement
Pour contribuer au développement du bot, vous avez la possibilitée de fork le repository pour pouvoir y ajouter des fonctionalitées puis demander une pull request.

Pour que l'on puisse suivre sans trop de problèmes les avancements du bot nous demandons une mise en forme du nom des commit particulière :

```
<type> : <Nom du commit>
[ligne vide]
<Fichiers impactés>
<Description>
```

* Types

| Préfixe | Sinification |
|--|--|
| MAJ | Mise a jour du fichier, aucune création/suppression |
| NEW | Création d'un ou plusieurs fichiers (a préciser dans la description) |
| SUPPR (ou DEL) | Supression d'un ou plusieurs fichiers (a préciser dans la description) |

* Nom du commit

Nous n'avons pas trop d'attentes sur le nom du commit, nous demandons juste qu'il soit assez explicite

* Fichiers impactés

Pour cette partie nous demandons un peu plus de rédaction car nous demandons que le chemin du fichier soit écrit en clair, par exemple : **./commands/ping.js**

* Description

Pour la description nous demandons juste un résumé rapide des modifications apportés aux fichiers impactés, par  exmemple : 'Ajout de la partie "Contribution au développement" et rédaction de cette dernière'

Si jamais vous avez besoin d'aide, hésitez pas a nous contacter :
Via une issue sur le repo,
Par discord : https://discord.gg/9FqeV6a
Ou par e-mail : marc@edu-focus.org

