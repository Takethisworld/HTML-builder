const fs = require('fs');
const path = require('path');

console.log(__dirname);

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) throw err;
    console.log('Папка была создана');

    fs.readdir(
        path.join(__dirname, 'files'),
        { withFileTypes: true },
        (err, files) => {
            if (err) {
                console.log(err);
            } else {
                console.log('\n directory filenames:');
                try {
                    files.forEach((file) => {
                        if (file.isFile()) {
                            const fileSource = path.join(
                                __dirname + '/' + 'files',
                                file.name,
                            );
                            const fileDest = path.join(
                                __dirname + '/' + 'files-copy',
                                file.name,
                            );
                            fs.copyFile(fileSource, fileDest, (err) => {
                                if (err) {
                                    console.error(`Ошибка копирования файла ${file.name}:`, err);
                                } else {
                                    console.log(`Файл ${file.name} успешно скопирован`);
                                }
                            });
                        }
                    });
                } catch (err) {
                    console.error('The file could not be copied:', err);
                }
            }
        },
    );
});