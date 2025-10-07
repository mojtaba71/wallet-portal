#!/bin/bash
# $1 Tag-Version
# $2 Tag-Comment
echo  ======= Starting Commit Project =====================
git commit -a -m "Tag $1 [$(date +'%D')] - $2 [PARS_RELEASE]"
echo  ======= Push Project            =====================
git push
echo ======= Tag As $1 - Git Commit Id $(git log --format="%H" -n 1  | cat | cut -c 1-8)  ======
git tag -a $1  $(git log --format="%H" -n 1  | cat | cut -c 1-8) -m "Tag $1 [$(date +'%D')] - $2"
echo ======= Push Tag $1          =====================
git push origin $1
