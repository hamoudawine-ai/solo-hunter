const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

module.exports = async function(buildResult) {
  try {
    const outDir = buildResult.outDir;
    const artifactPath = buildResult.artifactPaths.find((p) => p.endsWith('_Portable.exe'));

    if (!artifactPath) {
      console.warn('[afterAllArtifactBuild] No portable artifact found in build result.');
      return [];
    }

    const artifactName = path.basename(artifactPath);
    const versionMatch = artifactName.match(/_v(.+?)_Portable\.exe$/);
    const version = versionMatch ? versionMatch[1] : 'unknown';
    const latestYmlPath = path.join(outDir, 'latest.yml');

    const fileBuffer = fs.readFileSync(artifactPath);
    const sha512 = crypto.createHash('sha512').update(fileBuffer).digest('hex').toLowerCase();
    const size = fileBuffer.length;
    const releaseDate = new Date().toISOString();

    const contents = [
      `version: ${version}`,
      'files:',
      `  - url: ${artifactName}`,
      `    sha512: ${sha512}`,
      `    size: ${size}`,
      `path: ${artifactName}`,
      `sha512: ${sha512}`,
      `releaseDate: ${releaseDate}`,
      ''
    ].join('\n');

    fs.writeFileSync(latestYmlPath, contents, 'utf8');
    console.log(`[afterAllArtifactBuild] Generated latest.yml at ${latestYmlPath}`);

    return [latestYmlPath];
  } catch (error) {
    console.error('[afterAllArtifactBuild] Failed to generate latest.yml:', error);
    return [];
  }
};
