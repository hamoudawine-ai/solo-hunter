const fs = require('fs');
const path = require('path');
const rcedit = require('rcedit');

module.exports = async function(context) {
  const prodIconPath = path.join(context.packager.projectDir, 'public', 'icon.ico');
  const productFilename = context.packager.appInfo.productFilename || context.packager.appInfo.productName || 'SOLO HUNTER';
  const exePath = path.join(context.appOutDir, `${productFilename}.exe`);

  if (!fs.existsSync(exePath)) {
    console.warn(`[afterPack] Executable not found for icon injection: ${exePath}`);
    return;
  }

  if (!fs.existsSync(prodIconPath)) {
    console.warn(`[afterPack] Icon file does not exist: ${prodIconPath}`);
    return;
  }

  try {
    await new Promise((resolve, reject) => {
      rcedit(exePath, { icon: prodIconPath }, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
    console.log(`[afterPack] Embedded icon into ${exePath}`);
  } catch (error) {
    console.warn(`[afterPack] Failed to embed icon into executable: ${error.message}`);
  }
};
