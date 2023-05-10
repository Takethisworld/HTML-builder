const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'styles');

fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
      return
    }
    for (let file of files){
        const arr = [];
        if(file.isFile() && path.extname(file.name) === '.css') {
            fs.readFile(dir + "\/" + JSON.stringify(file.name).replace(/\"/g, ""), {encoding: 'utf-8'}, function(err,data){
                if (err) {
                    console.log(err);
                    return
                } else {
                    let arr2 = [];
                    arr.push(data);
                    arr.forEach(elem => {
                        arr2.push(elem);
                    })
                    let styleCss = arr2.join('');
                    fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), styleCss, 'utf-8', function(err) {
                        if(err) {
                            console.log(err);
                            return
                        }
                    })
                }
            });
        };
    }
})