const fs = require('fs');
const path = require('path');

const recursive = true;

fs.mkdir(
  path.join(__dirname, 'project-dist'),
  { recursive },
  err => {
  if (err) throw err;
});

//create index.html file
fs.writeFile(
  path.join(__dirname, 'project-dist', 'index.html'),
  '',
  (err) => {
    if (err) throw err;
  }
)

fs.readFile(
  path.join(__dirname, 'template.html'),
  'utf-8',
  (err, data) => {
    if (err) throw err;
    let templateCont = data;

    const regex = /{{(.+?)}}/g;
    let array;
    let i = 0;

    const componentBody = async (word, componentName) => {
      try {
        const componentCont = await fs.promises.readFile(
          path.join(path.join(__dirname, 'components'), `${componentName}.html`),
          'utf-8'
        );
        return componentCont;
      } catch (err) {
        throw err;
      }
    };

    const replaceCallback = async (word, componentName) => {
      const componentCont = await componentBody(word, componentName);
      return componentCont;
    };

    const replacePromises = [];
    const placeholders = [];
    while ((array = regex.exec(templateCont)) !== null) {
      let word = array[i];
      array[i] = array[i].replace(/{{(.+?)}}/g, '$1');

      replacePromises.push(replaceCallback(word, array[i]));
      placeholders.push(array[i]);
    }

    Promise.all(replacePromises)
      .then((replacements) => {
        let replacedCont = templateCont;
        for (let j = 0; j < replacements.length; j++) {
          replacedCont = replacedCont.replace(`{{${placeholders[j]}}}`, replacements[j]);
        }

      fs.writeFile(
        path.join(__dirname, 'project-dist', 'index.html'),
        replacedCont,
        (err) => {
          if (err) throw err;
        });
      })
      .catch((err) => {
        throw err;
      }
    );
  }
);

//create style.css file
fs.writeFile(
  path.join(__dirname, 'project-dist', 'style.css'),
  '',
  (err) => {
    if (err) throw err;
  }
);

fs.readdir('./06-build-page/styles', function(err, files) {
  if (err) throw err;

  files.forEach((file) => {
    if (path.extname(file) === '.css') {
      fs.readFile(
        path.join('./06-build-page/styles', file),
        'utf8',
        (err, data) => {
          if (err) throw err;

          fs.appendFile(
            path.join(__dirname, 'project-dist', 'style.css'),
            data,
            (err) => {
              if (err) throw err;
            })
        }
      )
    }
  })
});

//copy dir assets
const source = './06-build-page/assets';
const target = './06-build-page/project-dist/assets';

async function copyDir(source, target) {
  await fs.promises.mkdir(target, { recursive: true });

  const files = await fs.promises.readdir(source, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(source, file.name);
    const destPath = path.join(target, file.name);

    if (file.isDirectory()) {
      await copyDir(filePath, destPath);
    } else {
      await fs.copyFile(filePath, destPath, (err) => {
        if (err) throw err;
      });
    }
  }
};

async function main() {
  await copyDir(source, target);
}

main().catch((err) => {
  if (err) throw err;
});