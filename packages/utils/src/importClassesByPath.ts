import path from 'path';
import * as glob from 'glob';

const importClassesByPath = (directories: string[], formats = ['.js', '.ts']): Function[] => {

    const loadFileClasses = (exported: any, allLoaded: Function[]) => {
        if (exported instanceof Function) {
            allLoaded.push(exported);
        } else if (exported instanceof Array) {
            exported.forEach((i: any) => loadFileClasses(i, allLoaded));
        } else if (exported instanceof Object || typeof exported === 'object') {
            Object.keys(exported).forEach(key => loadFileClasses(exported[key], allLoaded));
        }

        return allLoaded;
    };

    const allFiles = directories.reduce(
        (allDirs, dir) => allDirs.concat(glob.sync(path.normalize(dir))),
        [] as string[],
    );

    const dirs = allFiles
        .filter(file => {
            const dtsExtension = file.substring(file.length - 5, file.length);
            return formats.indexOf(path.extname(file)) !== -1 && dtsExtension !== '.d.ts';
        })
        .map(file => require(file));

    return loadFileClasses(dirs, []);
};

export {
    importClassesByPath,
};
