const fs = require('fs');
const path = require('path');

const secret = 'secret-folder';

fs.readdir(
    path.join(__dirname, secret),
    { withFileTypes: true },
    (err, files) => {
        if (err) {
            console.log(err);
        } else {
            console.log('\nSecret directory filenames:');
            files.forEach((file) => {
                if (file.isFile()) {
                    const filePath = path.join(__dirname + '/' + secret, file.name);
                    const fileExt = path.extname(file.name);

                    fs.stat(filePath, (err, stats) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(
                                `${file.name.split('.')[0]} - ${fileExt.slice(
                                    1,
                                )} - ${Math.round(stats.size / 1024)}kb`,
                            );
                        }
                    });
                }
            });
        }
    },
);