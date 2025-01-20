const {
    readdir,
    mkdir,
    readFile,
    writeFile,
    rm,
    copyFile,
} = require('fs/promises');
const path = require('path');
const fs = require('fs');

const projectDistPath = path.resolve(__dirname, 'project-dist');
const templatePath = path.resolve(__dirname, 'template.html');
const indexPath = path.resolve(__dirname, 'project-dist', 'index.html');
const componentsPath = path.resolve(__dirname, 'components');
const stylesPath = path.resolve(__dirname, 'styles');
const bundlePath = path.resolve(__dirname, 'project-dist', 'style.css');
const assetsPath = path.resolve(__dirname, 'assets');
const copiedAssetsPath = path.resolve(__dirname, 'project-dist', 'assets');

async function replaceTags() {
    const componentsFiles = await readdir(componentsPath, {
        withFileTypes: true,
    });
    let fileValue = await readFile(indexPath, { encoding: 'utf-8' });

    for (const componentFile of componentsFiles) {
        const currentPath = path.resolve(
            __dirname,
            'components',
            componentFile.name,
        );
        const baseNameOfFile = path.basename(
            currentPath,
            path.extname(currentPath),
        );
        if (componentFile.isFile()) {
            const componentName = baseNameOfFile;
            const componentValue = await readFile(currentPath, 'utf-8');
            fileValue = fileValue.replace(`{{${componentName}}}`, componentValue);
        }
    }
    return fileValue;
}

async function mergeStyles(stylesPath, bundlePath) {
    try {
        const files = await readdir(stylesPath, {
            withFileTypes: true,
        });
        const output = fs.createWriteStream(bundlePath, { encoding: 'utf-8' });

        for (const file of files) {
            const filePath = path.resolve(__dirname, 'styles', file.name);
            if (file.isFile() && path.extname(filePath) === '.css') {
                const fileValue = await readFile(filePath, { encoding: 'utf-8' });
                output.write(fileValue + '\n');
            }
        }
        output.end();
    } catch (err) {
        console.log(err.message);
    }
}

async function copyDir(sourcePath, destinationPath) {
    try {
        await rm(destinationPath, { force: true, recursive: true });
        await mkdir(destinationPath, {
            recursive: true,
        });
        const files = await readdir(sourcePath, {
            withFileTypes: true,
        });
        for (const file of files) {
            if (file.isFile()) {
                await copyFile(
                    path.resolve(sourcePath, file.name),
                    path.resolve(destinationPath, file.name),
                );
            }
            if (file.isDirectory()) {
                copyDir(
                    path.resolve(sourcePath, file.name),
                    path.resolve(destinationPath, file.name),
                );
            }
        }
    } catch (err) {
        console.log(err.message);
    }
}

async function buildPage() {
    try {
        await mkdir(projectDistPath, {
            recursive: true,
        });
        const output = fs.createWriteStream(indexPath, { encoding: 'utf-8' });
        const fileValue = await readFile(templatePath, { encoding: 'utf-8' });
        output.write(fileValue);
        output.close();
        const indexWithComponents = await replaceTags();
        await writeFile(indexPath, indexWithComponents);
        await mergeStyles(stylesPath, bundlePath);
        await copyDir(assetsPath, copiedAssetsPath);
    } catch (err) {
        console.log(err.message);
    }
}

buildPage();