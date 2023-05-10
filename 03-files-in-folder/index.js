const {stat} = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');

const readFolderPath =path.resolve(__dirname,'secret-folder');


async function readDirFunction(){
    const readFiles = await readdir(readFolderPath,{withFileTypes: true})

    for (file of readFiles)
        if(file.isDirectory()){
            continue
        }else{
            let pathName =path.extname(file.name);
            let fileName =file.name.slice(0,file.name.length-pathName.length);

            const pathOfFile = path.join(readFolderPath,file.name);

            stat(pathOfFile,(err,stats)=>{
                let fileSize = stats.size;

                console.log(`${fileName} -${pathName.slice(1)}-${fileSize}b`)
            })
        }
    }
    readDirFunction()

