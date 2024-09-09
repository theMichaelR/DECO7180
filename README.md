# how to use git to work with this repo
## setup
Check if git is installed on your computer. If not, install it and setup your email and username (ask chatGPT how to do this)

## get the repo onto your computer
git clone https://github.com/theMichaelR/DECO7180
- this command downloads the repo onto your computer, move it into any folder you like

## make sure the project is setup correctly
git remote -v
- this will make sure your local project is connected to the shard repo on github, type it into your console on vs code with the project open, it should return:
- "origin  https://github.com/theMichaelR/DECO7180.git (fetch)"
- "origin  https://github.com/theMichaelR/DECO7180.git (push)"

## make changes to the project
git pull origin main
- this will update your local project to the newest version available on github

git checkout -b <your-new-branch-name>
- this makes a new "branch", a new place for you to make changes to help with future rollbacks if things break

Now make any changes you want to, you can use "git status" in your terminal at any time to see what files you've changed.

git add .
- this adds all the files you've changed

git commit -m "<your commit message here>"
- this will add a nice descriptive message to whatever changes you've made

git push origin <your-new-branch-name>
- this will push your local changes to the shared repo

git checkout main
- this takes you back to the main branch, out of the branch you made for your changes

git pull origin main
- this syncs your changes with the most recent version on your local machine, you may be prompted to sort out any merge conflicts at this stage

git merge <your-new-branch-name>
- this will merge the changes you've made into the shared github repo, congrats, you did it 🎉!

Now go onto the repo on github and go into the "pull requests" tab, here it should have an option to complete your merge and delete the branch that you made.

## bonus tip
If you are ever in doubt, stop what your doing and paste your most recent console information or your "git status" into chatGPT. It's really good at helping with git 😊.
