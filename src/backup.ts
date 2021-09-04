export class backup {
    constructor(parameters) {

    }

    loop() {
        //every 6h
    }

    createBackup() {
        //cleanUpFolder();
        //cloneRepo();
        //removeGitFolder(); //.git
        //encryptFolderWithPublicKey();
        //compressEncryptedFiles();
        //uploadFileToS3();
        //deleteOldBackups();

        //hashCompressedFile();
        //cleanUpFolder();
        //cloneRepo();
        //addHashAndFilenameToFile();
        //commit();
        //push();
    }

    /* last
        42 6h
        30 24h
        57 7days
        120 1Month
        unlimited 1Year

        til 7days at a 1gb repo (129GB) = 
            0.65$ per month on B2 BackBlaze
        after 10 years (249GB) = 
            1.25$ per month on B2 BackBlaze
    */
    deleteOldBackups() {

    }
}