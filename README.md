# SeatSavvy

### Setup SeatSavvy repository locally
* Install Git : [Git-SCM](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* ```git clone https://github.com/NishiGaba/SeatSavvy.git```
* Check branches : ```git branch --list``` (We have two branches for now : "main" and "development") // it will show the current active branch in green in your system
* Switch to "development" branch : ```git checkout development ```
// We will always create our feature branches from the development branch

### To create new feature branch 
* Check you are on development branch : ```git branch```
* If not on development branch, then switch to development branch : ```git checkout development```
* Pull latest code from development branch : ```git pull origin development```
* Create new feature branch : ```git checkout -b feature/your-feature-name```


### To push feature branch
* Check updated files: ```git status```
* Add updated files : ```git add .```
* Commit files with the message : ```git commit -m "message: to show purpose of commit"```
* Push those files to Git origin : ```git push origin <feature-branch-name>```