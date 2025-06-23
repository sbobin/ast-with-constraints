module.exports = {
  packagerConfig: {
    icon: undefined
  },
  rebuildConfig: {},
  makers: [
    // MacOS build
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    // Windows installer — only builds on Windows machines
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
    },
    // Debian package — only builds on Linux
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
    },
    // RPM package — only builds on Linux
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
    }
  ]
}