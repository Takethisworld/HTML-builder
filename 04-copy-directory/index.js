
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'files');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, function() {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error(err);
            return
        }
        for (let file of files) {
            fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (err) => {
                if (err) {
                    console.error(err);
                    return
                }
            });
        }
    })
});