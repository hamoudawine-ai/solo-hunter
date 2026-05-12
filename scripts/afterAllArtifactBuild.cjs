const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

module.exports = async function(buildResult) {
  try {
    const outDir = buildResult.outDir;
    const packageJsonPath = path.join(outDir, '..', 'package.json');
    let version = 'unknown';

    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      version = packageJson.version || version;
    }

    const artifactPath = buildResult.artifactPaths.find((p) => {
      const fileName = path.basename(p).toLowerCase();
      return fileName.endsWith('.zip');
    });

    if (!artifactPath) {
      console.warn('[afterAllArtifactBuild] No ZIP artifact found in build result.');
      return [];
    }

    const artifactName = path.basename(artifactPath);
    const versionMatch = artifactName.match(/_v([0-9]+(?:\.[0-9]+)*)(?:_|\.exe$)/i);
    if (versionMatch && version === 'unknown') {
      version = versionMatch[1];
    }
    const latestYmlPath = path.join(outDir, 'latest.yml');
    const rootLatestYmlPath = path.join(outDir, '..', 'latest.yml');

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
    fs.writeFileSync(rootLatestYmlPath, contents, 'utf8');
    console.log(`[afterAllArtifactBuild] Generated latest.yml at ${latestYmlPath}`);
    console.log(`[afterAllArtifactBuild] Generated latest.yml at ${rootLatestYmlPath}`);

    return [latestYmlPath];
  } catch (error) {
    console.error('[afterAllArtifactBuild] Failed to generate latest.yml:', error);
    return [];
  }
};
