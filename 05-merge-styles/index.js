const fs = require('fs');
const path = require('path');

const targetFolder = 'styles';
const resArray = [];

fs.readdir(
    path.join(__dirname, targetFolder),
    { withFileTypes: true },
    (err, files) => {
        if (err) {
            console.log(err);
        } else {
            const cssFiles = files.filter(
                (file) => file.isFile() && path.extname(file.name) === '.css',
            );

            files.forEach((file, index) => {
                const fileExt = path.extname(file.name);
                if (file.isFile() && fileExt === '.css') {
                    const filePath = path.join(__dirname, targetFolder, file.name);

                    fs.readFile(filePath, 'utf-8', (err, data) => {
                        if (err) throw err;
                        resArray.push(data);
                        console.log(data);
                        if (index === cssFiles.length - 1) {
                            fs.writeFile(
                                path.join(__dirname, 'project-dist', 'bundle.css'),

                                resArray.join('\n'),
                                (err) => {
                                    if (err) throw err;
                                    console.log('Файл был создан');
                                },
                            );
                        }
                    });
                }
            });
        }
    },
);