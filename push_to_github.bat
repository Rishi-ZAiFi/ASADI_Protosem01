@echo off
echo Starting Git Push to GitHub...
cd /d "c:\Users\priya\Downloads\podcraft"

git init
git checkout -b 14_Podcast-assistance 2>nul || git checkout 14_Podcast-assistance
git remote remove origin 2>nul
git remote add origin https://github.com/priyadharshinibalakrishnan17/ASADI_Protosem01.git
git add .
git commit -m "Add PodCraft podcast assistance project files"
git push -u origin 14_Podcast-assistance

echo.
echo Done! Press any key to exit.
pause
