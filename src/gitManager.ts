const execSync = require('child_process').execSync;

export class GitManager {
    rootPath;

    constructor(directoryPath, onlyPull = false) {
        this.rootPath = directoryPath;
        console.log("BEGIN OF GIT-SERVER COMMUNICATION");

        if (onlyPull == false)
            try {
                this.add();
                this.commit();
            } catch (error) {
                console.error(error);
            };

        this.pull();
        if (onlyPull == false) this.push();

        console.log("END OF GIT-SERVER COMMUNICATION");

        if (onlyPull == false) global.running = false;
    }

    add() {
        console.log("ADD--->>", execSync(`cd ${this.rootPath}  && git add --all`, { encoding: 'utf8' }));
    }
    commit() {
        console.log("COMMIT--->>", execSync(`cd ${this.rootPath}  && git commit -am "GitBot"`, { encoding: 'utf8' }));
    }
    pull() {
        console.log("PULL--->>",execSync(`cd ${this.rootPath}  && git pull -X theirs`, { encoding: 'utf8' }));
    }
    push() {
        console.log("PUSH--->>",execSync(`cd ${this.rootPath}  && git push`, { encoding: 'utf8' }));
    }
}