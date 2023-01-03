import path from 'path';
import * as glob from 'glob';

export const getPathByMask = (pathMasks: string[], formats = ['.js', '.ts']): string[] => {
    const allFiles = pathMasks.reduce(
        (allDirs, dir) => allDirs.concat(glob.sync(path.normalize(dir))),
        [] as string[],
    );

    const filePath = allFiles
        .filter(file => {
            const dtsExtension = file.substring(file.length - 5, file.length);
            return formats.indexOf(path.extname(file)) !== -1 && dtsExtension !== '.d.ts';
        });

    return filePath;
};
