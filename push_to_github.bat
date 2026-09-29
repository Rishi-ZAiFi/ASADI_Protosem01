@echo off
echo Pushing to your fork: https://github.com/priyadharshinibalakrishnan17/ASADI_Protosem01.git
cd /d "c:\Users\priya\Downloads\podcraft"

git init
git remote remove origin 2>nul
git remote add origin https://github.com/priyadharshinibalakrishnan17/ASADI_Protosem01.git

git checkout -b 14_Podcast-assistance 2>nul || git checkout 14_Podcast-assistance

git add .
git commit -m "Add PodCraft files to branch 14_Podcast-assistance"

echo Fetching remote...
git fetch origin

echo Syncing with remote branch 14_Podcast-assistance...
git pull origin 14_Podcast-assistance --allow-unrelated-histories --no-rebase --no-edit 2>nul

echo Pushing to origin/14_Podcast-assistance...
git push -u origin 14_Podcast-assistance --force

echo.
echo =======================================================
echo Success! Pushed to your fork branch 14_Podcast-assistance
echo =======================================================
pause
