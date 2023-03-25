/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
    appId: 'com.raihanul.memecentral',
    asar: true,
    directories: {
        output: 'release/${version}',
    },
    files: ['dist'],
    extraResources: [
        {
            from: 'prodResources',
            to: 'extraResources',
        },
    ],
    win: {
        target: [
            {
                target: 'portable',
                arch: ['x64'],
            },
        ],
        artifactName: '${productName}_${version}.${ext}',
    },
    portable: {
        unpackDirName: 'meme-central',
    },
};
