const fs = require('fs');
const path = require('path');

const { stdin, stdout, exit } = process;

fs.writeFile(path.join(__dirname, 'mynotes.txt'), '', (err) => {
    if (err) throw err;
    console.log('Файл был создан');
});

stdin.on('data', (data) => {
    if (data.toString().trim() === 'exit') exit();
    fs.appendFile(path.join(__dirname, 'mynotes.txt'), data, (err) => {
        if (err) throw err;
        console.log('Файл был изменен');
    });
});

process.on('SIGINT', () => {
    exit();
});

process.on('exit', () => stdout.write('Удачи в изучении Node.js!'));