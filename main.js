import { app, BrowserWindow, ipcMain, net, shell, dialog } from 'electron';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import DiscordRPC from 'discord-rpc';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = !app.isPackaged;

// Resolve paths correctly for both Dev and Production (ASAR)
const getResourcePath = (relativePath) => {
  const isDev = !app.isPackaged;
  if (isDev) {
    // In development, serve directly from the public folder/root
    return `/${relativePath.replace('public/', '')}`;
  }
  
  // In production, everything is inside ASAR (dist folder structure)
  const cleanPath = relativePath.replace('public/', 'dist/');
  return `file://${path.join(__dirname, cleanPath).replace(/\\/g, '/')}`;
};

ipcMain.handle('get-resource-path', async (event, relativePath) => {
  return getResourcePath(relativePath);
});

const GITHUB_OWNER = 'hamoudawine-ai';
const GITHUB_REPO = 'solo-hunter';
const clientId = '1419813038428520448'; 
DiscordRPC.register(clientId, process.execPath);

let rpc = null;
const startTime = Math.floor(Date.now() / 1000); 
let sessionStartTime = null; 
let rpcReady = false;
let reconnectTimeout = null;
let currentRpcData = { details: 'SOLO HUNTER', state: 'Rank: E' };
let firstActivation = true;

async function initDiscordRPC() {
  if (rpc) {
    try {
      await rpc.destroy();
    } catch (e) {}
  }

  rpc = new DiscordRPC.Client({ transport: 'ipc' });
  rpcReady = false;

  rpc.on('ready', () => {
    rpcReady = true;
    console.log('[Discord RPC] Connected and Ready');
    const win = BrowserWindow.getAllWindows()[0];
    win?.webContents.send('rpc-status', 'connected');
    
    // Initial activity - use force=true to ensure it shows up immediately on connect
    setActivity(currentRpcData.details, currentRpcData.state, true);
  });

  rpc.on('disconnected', () => {
    rpcReady = false;
    console.log('[Discord RPC] Disconnected. Attempting to reconnect in 15s...');
    const win = BrowserWindow.getAllWindows()[0];
    win?.webContents.send('rpc-status', 'disconnected');
    
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(initDiscordRPC, 15000);
  });

  try {
    await rpc.login({ clientId });
  } catch (err) {
    console.error('[Discord RPC] Login Failed:', err.message);
    const win = BrowserWindow.getAllWindows()[0];
    win?.webContents.send('rpc-status', 'error', err.message);
    
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(initDiscordRPC, 15000);
  }
}

// Throttle for RPC updates to avoid rate limiting
let lastUpdate = 0;
const UPDATE_THROTTLE = 5000; // Balanced 5s throttle

async function setActivity(details, state, force = false) {
  if (!rpc || !rpcReady) return;
  
  const now = Date.now();
  
  if (!sessionStartTime) {
    sessionStartTime = Math.floor(now / 1000);
  }

  // Optimize: skip update if nothing changed
  if (!force && lastUpdate !== 0 && currentRpcData.details === details && currentRpcData.state === state) {
    return;
  }

  if (!force && lastUpdate !== 0 && (now - lastUpdate < UPDATE_THROTTLE)) {
    return;
  }

  lastUpdate = now;
  currentRpcData = { details, state };
  
  const activity = {
    details: details || 'SOLO HUNTER',
    state: state || 'Rank: E',
    startTimestamp: sessionStartTime,
    largeImageKey: 'system-logo',
    largeImageText: 'SOLO HUNTER',
    instance: true,
  };

  rpc.setActivity(activity).catch(() => {});
}

// Minimal background sync
setInterval(() => {
  if (rpcReady && rpc) {
    // Only update if it's been more than 2 minutes of inactivity
    if (Date.now() - lastUpdate > 120000) {
      setActivity(currentRpcData.details, currentRpcData.state, true);
    }
  }
}, 60000);

async function clearActivity() {
  firstActivation = true; // Reset first activation for next time
  sessionStartTime = null; // Reset start time for next session
  if (!rpc || !rpcReady) return;
  rpc.clearActivity().catch(err => console.error('[Discord RPC] Clear Error:', err));
}

// Start RPC initialization
initDiscordRPC();

let mainWindow = null;
let windowReady = false;
const eventBuffer = [];
let lastUpdateCheckResult = null;

// Helper to send event to renderer with buffering
function sendToRenderer(channel, ...args) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (windowReady) {
      mainWindow.webContents.send(channel, ...args);
    } else {
      // Buffer the event until window is ready
      eventBuffer.push({ channel, args });
      console.log(`[EventBuffer] Buffered event: ${channel}`);
    }
  }
}

// Flush buffered events when window is ready
function flushEventBuffer() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  
  console.log(`[EventBuffer] Flushing ${eventBuffer.length} buffered events`);
  while (eventBuffer.length > 0) {
    const event = eventBuffer.shift();
    mainWindow.webContents.send(event.channel, ...event.args);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#000000',
    icon: getResourcePath('public/system-logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    frame: false,
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(isDev ? 'http://localhost:5888' : `file://${path.join(__dirname, 'dist/index.html')}`);

  // Track when window is ready to receive IPC events
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[Main] Window finished loading, flushing event buffer...');
    windowReady = true;
    flushEventBuffer();
  });

  // Auto-updater configuration inside createWindow to ensure mainWindow is ready
  if (!isDev) {
    autoUpdater.autoDownload = false; // Manual download only
    autoUpdater.logger = console;
    
    // Skip signature check for unsigned EXE (no paid certificate)
    autoUpdater.forceDevUpdateConfig = true;
    console.log('[AutoUpdater] Signature check disabled for unsigned EXE');
    
    // Explicitly set GitHub feed URL
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'hamoudawine-ai',
      repo: 'solo-hunter'
    });
    console.log('[AutoUpdater] GitHub feed URL configured');

    autoUpdater.on('checking-for-update', () => {
      console.log('[AutoUpdater] Checking for update...');
    });

    autoUpdater.on('update-available', (info) => {
      console.log('[AutoUpdater] Update available:', info.version);
      sendToRenderer('update-available', info);
    });

    autoUpdater.on('update-not-available', (info) => {
      console.log('[AutoUpdater] Update not available:', info?.version || 'current is latest');
      sendToRenderer('update-not-available', info);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      console.log(`[AutoUpdater] ⬇️ Download progress: ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total} bytes)`);
      sendToRenderer('update-download-progress', progressObj);
    });

    autoUpdater.on('update-downloaded', (info) => {
      console.log('[AutoUpdater] Update downloaded:', info.version);
      sendToRenderer('update-downloaded', info);
    });

    autoUpdater.on('error', (err) => {
      console.error('[AutoUpdater] Error:', err);
      console.error('[AutoUpdater] Stack:', err.stack);
      
      // ALWAYS show error with stack trace for debugging (forceDevUpdateConfig should help)
      const errorDetails = `Error: ${err.message}\n\nStack:\n${err.stack || 'No stack trace'}\n\nConfig: forceDevUpdateConfig=${autoUpdater.forceDevUpdateConfig}`;
      
      dialog.showErrorBox(
        'Auto-Updater Error - Download Failed',
        errorDetails
      );
      
      sendToRenderer('update-error', err.message);
    });
  }
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (rpc) {
      rpc.clearActivity().then(() => {
        rpc.destroy().catch(() => {});
        app.quit();
      }).catch(() => {
        app.quit();
      });
    } else {
      app.quit();
    }
  }
});

app.on('before-quit', async () => {
  if (rpc) {
    try {
      await rpc.clearActivity();
      await rpc.destroy();
    } catch (e) {}
  }
});

const normalizeVersion = (v = '') => v.toString().trim().replace(/^v/i, '');
const versionToParts = (version) =>
  normalizeVersion(version)
    .split('.')
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));

const isVersionNewer = (latest, current) => {
  try {
    const latestParts = versionToParts(latest);
    const currentParts = versionToParts(current);
    
    for (let i = 0; i < 3; i++) {
      const l = latestParts[i] || 0;
      const c = currentParts[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  } catch (e) {
    return latest !== current;
  }
};

ipcMain.handle('check-for-updates', async () => {
  if (!isDev) {
    const currentVersion = app.getVersion();
    let latestVersion = '';
    let success = false;
    let error = null;

    try {
      // 1. Try GitHub API first (More reliable for tagging)
      console.log('[UpdateCheck] Fetching latest release from GitHub API...');
      const latestReleaseUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;
      const releaseData = await new Promise((resolve) => {
        const request = net.request({ method: 'GET', url: latestReleaseUrl });
        request.setHeader('Accept', 'application/vnd.github+json');
        request.setHeader('User-Agent', 'SOLO-HUNTER-Updater');
        let rawBody = '';
        request.on('response', (response) => {
          response.on('data', (chunk) => { rawBody += chunk.toString(); });
          response.on('end', () => {
            if (response.statusCode !== 200) { resolve(null); return; }
            try { resolve(JSON.parse(rawBody)); } catch { resolve(null); }
          });
        });
        request.on('error', () => resolve(null));
        request.end();
      });

      if (releaseData && releaseData.tag_name) {
        latestVersion = normalizeVersion(releaseData.tag_name);
        console.log(`[UpdateCheck] GitHub API found version: ${latestVersion}`);
        success = true;
      }
    } catch (err) {
      console.error('[UpdateCheck] GitHub API error:', err.message);
      error = err.message;
    }

    try {
      // 2. Always trigger autoUpdater to sync its internal state for downloading later
      console.log('[UpdateCheck] Triggering autoUpdater.checkForUpdates()...');
      const result = await autoUpdater.checkForUpdates();
      lastUpdateCheckResult = result; // Store globally for download later
      if (!latestVersion && result?.updateInfo?.version) {
        latestVersion = result.updateInfo.version;
        console.log(`[UpdateCheck] autoUpdater found version: ${latestVersion}`);
        success = true;
      }
      console.log('[UpdateCheck] Stored update check result for download:', result?.updateInfo?.version);
    } catch (err) {
      console.error('[UpdateCheck] autoUpdater check error:', err.message);
      lastUpdateCheckResult = null; // Clear on error
      // Don't fail the whole thing if GitHub API already succeeded
      if (!success) error = err.message;
    }

    const updateAvailable = latestVersion && isVersionNewer(latestVersion, currentVersion);
    console.log(`[UpdateCheck] Final Result - Current: ${currentVersion}, Latest: ${latestVersion}, Available: ${updateAvailable}`);

    return {
      success: success || !!latestVersion,
      updateAvailable: !!updateAvailable,
      currentVersion,
      latestVersion: latestVersion || currentVersion,
      error
    };
  }
  return { success: false, reason: 'is_dev' };
});

ipcMain.on('window-minimize', () => BrowserWindow.getFocusedWindow()?.minimize());
ipcMain.on('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win?.isMaximized()) win.unmaximize();
  else win?.maximize();
});
ipcMain.on('window-close', () => BrowserWindow.getFocusedWindow()?.close());

ipcMain.handle('open-external-url', async (event, url) => {
  if (url) {
    shell.openExternal(url);
    return true;
  }
  return false;
});

ipcMain.handle('start-download-update', async () => {
  if (!isDev) {
    console.log('[AutoUpdater] Manual download requested...');
    console.log('[AutoUpdater] Using stored check result:', lastUpdateCheckResult?.updateInfo?.version);
    
    if (!lastUpdateCheckResult?.updateInfo) {
      console.log('[AutoUpdater] No stored update info, checking now...');
      try {
        const checkResult = await autoUpdater.checkForUpdates();
        lastUpdateCheckResult = checkResult;
      } catch (err) {
        console.error('[AutoUpdater] Check failed:', err.message);
        return { success: false, reason: 'Failed to check for updates: ' + err.message };
      }
    }
    
    if (!lastUpdateCheckResult?.updateInfo) {
      console.log('[AutoUpdater] Still no update info available');
      return { success: false, reason: 'No update available. Please check for updates first.' };
    }
    
    console.log('[AutoUpdater] Update found:', lastUpdateCheckResult.updateInfo.version);
    
    // Download the update
    console.log('[AutoUpdater] ⭐⭐⭐ CALLING downloadUpdate() NOW! ⭐⭐⭐');
    console.log('[AutoUpdater] Update info before download:', lastUpdateCheckResult.updateInfo);
    try {
      await autoUpdater.downloadUpdate();
      console.log('[AutoUpdater] ✅ downloadUpdate() completed successfully');
      return { success: true };
    } catch (downloadErr) {
      console.error('[AutoUpdater] ❌ downloadUpdate() FAILED:', downloadErr);
      throw downloadErr;
    }
  }
  return { success: false, reason: 'is_dev' };
});

ipcMain.handle('quit-and-install', async () => {
  if (!isDev) {
    autoUpdater.quitAndInstall();
    return { success: true };
  }
  return { success: false, reason: 'is_dev' };
});

ipcMain.handle('clear-update-cache', async () => {
  if (!isDev) {
    try {
      // Clear electron-updater cache
      const userDataPath = app.getPath('userData');
      const updateCachePath = path.join(userDataPath, 'updates');

      if (fs.existsSync(updateCachePath)) {
        // Remove all files in the updates directory
        const files = fs.readdirSync(updateCachePath);
        for (const file of files) {
          const filePath = path.join(updateCachePath, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            console.log(`[UpdateCache] Removed cached file: ${file}`);
          }
        }
        console.log('[UpdateCache] Cache cleared successfully');
      } else {
        console.log('[UpdateCache] No cache directory found');
      }

      // Also clear any pending update state
      lastUpdateCheckResult = null;

      return { success: true, message: 'Update cache cleared' };
    } catch (error) {
      console.error('[UpdateCache] Error clearing cache:', error);
      return { success: false, error: error.message };
    }
  }
  return { success: false, reason: 'is_dev' };
});

ipcMain.handle('get-app-version', async () => {
  try {
    const version = app.getVersion();
    return { success: true, version };
  } catch (error) {
    console.error('[AppVersion] Error getting version:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.on('update-rpc', (event, { details, state, clear }) => {
  if (clear) clearActivity();
  else setActivity(details, state);
});

// Remote Database Protocol
let remoteGameDB = {};

async function loadRemoteDatabase() {
  const dbUrls = [
    'https://raw.githubusercontent.com/SteamTools-Team/GameList/master/data.json',
    'https://raw.githubusercontent.com/SteamTools-Team/GameList/main/data.json'
  ];

  for (const url of dbUrls) {
    try {
      console.log(`[System] Synchronizing with Remote Database: ${url}`);
      const response = await new Promise((resolve, reject) => {
        const request = net.request(url);
        request.on('response', (res) => {
          if (res.statusCode !== 200) { resolve(null); return; }
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve(null);
            }
          });
        });
        request.on('error', () => resolve(null));
        request.end();
      });

      if (response && typeof response === 'object') {
        remoteGameDB = response;
        console.log(`[System] Synchronization Complete. ${Object.keys(remoteGameDB).length} profiles indexed.`);
        return true;
      }
    } catch (e) {
      console.error(`[System] Synchronization Failed for ${url}`);
    }
  }
  return false;
}

/** Manual overrides when Steam omits DRM text — extend as needed */
const DENUVO_APP_IDS = new Set([
  '3357650', // PRAGMATA
  '2050650', // Resident Evil 4 (2023)
  '1245620', // ELDEN RING
  '990080', // Hogwarts Legacy
  '1716740', // Starfield
  '1693980', // Dead Space (2023)
  '603070', // Assassin's Creed Mirage
  '2054970', // Dragon's Dogma 2
  '2058190', // Like a Dragon: Infinite Wealth
]);

function stripHtml(html) {
  if (!html) return '';
  return String(html).replace(/<[^>]*>/g, ' ');
}

function collectTextFromSteamData(data) {
  if (!data) return '';
  const chunks = [];
  const push = (v) => {
    if (v && typeof v === 'string') chunks.push(v);
  };
  push(data.drm_notice);
  push(data.ext_user_account_notice);
  push(data.legal_notice);
  push(data.short_description);
  push(data.detailed_description);
  push(data.about_the_game);
  const pc = data.pc_requirements;
  if (pc && typeof pc === 'object') {
    push(pc.minimum);
    push(pc.recommended);
  }
  const mac = data.mac_requirements;
  if (mac && typeof mac === 'object') {
    push(mac.minimum);
    push(mac.recommended);
  }
  const linux = data.linux_requirements;
  if (linux && typeof linux === 'object') {
    push(linux.minimum);
    push(linux.recommended);
  }
  return stripHtml(chunks.join(' | '));
}

function textImpliesDenuvo(text) {
  if (!text) return false;
  return /\bdenuvo\b/i.test(String(text));
}

function detectDenuvoFromRemoteGame(game) {
  if (!game || typeof game !== 'object') return false;
  if (game.isDenuvo === true || game.denuvo === true || game.hasDenuvo === true) return true;
  const drm = game.drm ?? game.DRM ?? game.protection;
  if (typeof drm === 'string' && /\bdenuvo\b/i.test(drm)) return true;
  const desc = game.description ?? game.short_description ?? '';
  if (typeof desc === 'string' && /\bdenuvo\b/i.test(desc)) return true;
  const meta = game.metadata ?? game.meta;
  if (meta && typeof meta === 'object' && /\bdenuvo\b/i.test(JSON.stringify(meta))) return true;
  return false;
}

function computeIsDenuvo(appId, steamData, remoteGame) {
  const id = appId != null ? String(appId) : '';
  if (id && DENUVO_APP_IDS.has(id)) return true;
  if (remoteGame && detectDenuvoFromRemoteGame(remoteGame)) return true;
  if (steamData && textImpliesDenuvo(collectTextFromSteamData(steamData))) return true;
  return false;
}

const STEAM_BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function fetchUrlText(url) {
  return new Promise((resolve) => {
    const request = net.request(url);
    request.setHeader('User-Agent', STEAM_BROWSER_UA);
    request.setHeader('Accept-Language', 'en-US,en;q=0.9');
    let raw = '';
    request.on('response', (res) => {
      if (res.statusCode !== 200) {
        resolve('');
        return;
      }
      res.on('data', (c) => {
        raw += c.toString();
      });
      res.on('end', () => resolve(raw));
    });
    request.on('error', () => resolve(''));
    request.end();
  });
}

async function fetchSteamAppDetailsData(appId) {
  const detailsUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`;
  try {
    const detailsResponse = await new Promise((resolve) => {
      const request = net.request(detailsUrl);
      request.on('response', (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(null);
          }
        });
      });
      request.on('error', () => resolve(null));
      request.end();
    });
    if (!detailsResponse?.[appId]?.success) return null;
    return detailsResponse[appId].data;
  } catch {
    return null;
  }
}

async function fetchDlcsFromSteam(appId) {
  const dlcUrl = `https://store.steampowered.com/api/dlcforapp/?appid=${appId}`;
  const dlcDetailsUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english&filters=basic`;
  
  try {
    const [dlcResponse, detailsResponse] = await Promise.all([
      new Promise((resolve) => {
        const request = net.request(dlcUrl);
        request.on('response', (response) => {
          let data = '';
          response.on('data', (chunk) => { data += chunk; });
          response.on('end', () => {
            try { resolve(JSON.parse(data)); } catch { resolve(null); }
          });
        });
        request.on('error', () => resolve(null));
        request.end();
      }),
      new Promise((resolve) => {
        const request = net.request(dlcDetailsUrl);
        request.on('response', (response) => {
          let data = '';
          response.on('data', (chunk) => { data += chunk; });
          response.on('end', () => {
            try { resolve(JSON.parse(data)); } catch { resolve(null); }
          });
        });
        request.on('error', () => resolve(null));
        request.end();
      })
    ]);
    
    const dlcMap = {};

    // 1. Check dlcforapp API (standard)
    if (dlcResponse?.status === 1 && Array.isArray(dlcResponse.dlc)) {
      dlcResponse.dlc.forEach(dlc => {
        if (dlc.appid) dlcMap[String(dlc.appid)] = dlc.name || `DLC ${dlc.appid}`;
      });
    }

    // 2. Check appdetails API (fallback)
    if (detailsResponse?.[appId]?.success && Array.isArray(detailsResponse[appId].data?.dlc)) {
      detailsResponse[appId].data.dlc.forEach(id => {
        const sid = String(id);
        if (!dlcMap[sid]) dlcMap[sid] = `Shadow DLC ${sid}`;
      });
    }
    
    // 3. Last Resort: Monarch Remote DB Brute Force for DLCs
    Object.entries(remoteGameDB).forEach(([id, game]) => {
      if (game.parent_appid === String(appId) || game.parent === String(appId)) {
        dlcMap[String(id)] = game.name || `Shadow DLC ${id}`;
      }
    });

    return Object.keys(dlcMap).length > 0 ? dlcMap : null;
  } catch {
    return null;
  }
}

/** Steam store *web page* often lists DRM (e.g. Denuvo) even when `appdetails` JSON omits it. */
async function steamStorePageMentionsDenuvo(appId) {
  const html = await fetchUrlText(
    `https://store.steampowered.com/app/${encodeURIComponent(appId)}/?l=english`,
  );
  if (!html) return false;
  return /\bdenuvo\b/i.test(html);
}

async function resolveDenuvoFromSteam(appId, steamData, remoteGame) {
  let isDenuvo = computeIsDenuvo(appId, steamData, remoteGame);
  if (isDenuvo) return true;

  if (!steamData) {
    const fetched = await fetchSteamAppDetailsData(appId);
    if (fetched) {
      isDenuvo = computeIsDenuvo(appId, fetched, remoteGame);
      if (isDenuvo) return true;
    }
  }

  return steamStorePageMentionsDenuvo(appId);
}

// Initial Sync
loadRemoteDatabase();

ipcMain.handle('search-steam-game', async (event, query) => {
  try {
    // 1. Search in Remote Database first (Priority)
    const results = [];
    const queryLower = query.toLowerCase();
    
    for (const appId in remoteGameDB) {
      const game = remoteGameDB[appId];
      if (game.name?.toLowerCase().includes(queryLower)) {
        results.push({
          id: appId,
          name: game.name,
          tiny_image: game.header_image || game.tiny_image || `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_sm_120.jpg`,
          isRemote: true
        });
      }
      if (results.length >= 10) break;
    }

    if (results.length > 0) {
      return { success: true, games: results };
    }

    // 2. Fallback to Steam API if not found in remote DB
    const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`;
    const searchResponse = await new Promise((resolve, reject) => {
      const request = net.request({ method: 'GET', url: searchUrl });
      request.on('response', (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => resolve(JSON.parse(data)));
      });
      request.on('error', reject);
      request.end();
    });

    if (!searchResponse?.items?.length) return { success: false, error: 'Game not found' };

    return { 
      success: true, 
      games: searchResponse.items.map(item => ({
        id: item.id.toString(),
        name: item.name,
        price: item.price ? (item.price.final / 100).toFixed(2) + item.price.currency : 'Free',
        tiny_image: item.tiny_image
      }))
    };
  } catch (error) {
    return { success: false, error: 'Connection failed' };
  }
});

ipcMain.handle('restart-steam', async () => {
  return new Promise((resolve) => {
    // Killing Steam and its web helper
    exec('taskkill /F /IM steam.exe /T', () => {
      setTimeout(async () => {
        try {
          // Launching Steam directly instead of protocol to avoid permission issues
          const steamPath = 'C:\\Program Files (x86)\\Steam\\steam.exe';
          if (fs.existsSync(steamPath)) {
            exec(`"${steamPath}"`);
          } else {
            await shell.openExternal('steam://open/main');
          }
          resolve({ success: true });
        } catch (e) {
          resolve({ success: false, error: e.message });
        }
      }, 2000);
    });
  });
});

ipcMain.handle('get-game-details', async (event, appId) => {
  try {
    // Helper to normalize DLCs to { id: name }
    const normalizeDlcs = (dlcData, currentMap = {}) => {
      const dlcMap = { ...currentMap };
      if (!dlcData) return dlcMap;
      
      if (Array.isArray(dlcData)) {
        dlcData.forEach(id => {
          const sid = String(id).trim();
          if (sid && (!dlcMap[sid] || dlcMap[sid] === sid || dlcMap[sid].startsWith('DLC '))) {
            dlcMap[sid] = remoteGameDB[sid]?.name || dlcMap[sid] || `Shadow DLC ${sid}`;
          }
        });
      } else if (dlcData && typeof dlcData === 'object') {
        Object.entries(dlcData).forEach(([id, name]) => {
          const sid = String(id).trim();
          if (sid) {
            let finalName = name;
            if (!finalName || finalName === sid || finalName.startsWith('DLC ')) {
              finalName = remoteGameDB[sid]?.name || finalName || `Shadow DLC ${sid}`;
            }
            dlcMap[sid] = finalName;
          }
        });
      }
      return dlcMap;
    };

    let remoteGame = remoteGameDB[appId];

    // 1. Check Remote DB first (Source of Truth for IDs)
    if (remoteGame) {
      const steamData = await fetchSteamAppDetailsData(appId);
      const isDenuvo = await resolveDenuvoFromSteam(appId, steamData, remoteGame);
      
      // Merge DLCs: Start with Steam API DLCs, then add/override with Remote DB DLCs
      let mergedDlcs = normalizeDlcs(steamData?.dlc);
      mergedDlcs = normalizeDlcs(remoteGame.dlc, mergedDlcs);
      mergedDlcs = normalizeDlcs(remoteGame.dlcs, mergedDlcs); // Support both 'dlc' and 'dlcs' keys

      return {
        success: true,
        game: {
          id: appId,
          name: remoteGame.name || steamData?.name || "Unknown Game",
          header_image: remoteGame.header_image || steamData?.header_image,
          library_hero: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`,
          dlcs: mergedDlcs,
          isRemote: true,
          isDenuvo,
          desc: remoteGame.description || steamData?.short_description || "Shadow profile retrieved.",
          dev: remoteGame.developer || steamData?.developers?.join(', ') || "Unknown",
          pub: remoteGame.publisher || steamData?.publishers?.join(', ') || "Unknown",
          date: remoteGame.release_date || steamData?.release_date?.date || "Unknown",
          trailer: steamData?.movies?.[0]?.webm?.max?.replace('http://', 'https://')
        }
      };
    }

    // 2. Fallback to Steam API if not in Remote DB
    const [steamData, steamDlcs] = await Promise.all([
      fetchSteamAppDetailsData(appId),
      fetchDlcsFromSteam(appId)
    ]);

    if (steamData) {
      const isDenuvo = await resolveDenuvoFromSteam(appId, steamData, null);
      let mergedDlcs = normalizeDlcs(steamData.dlc);
      mergedDlcs = normalizeDlcs(steamDlcs, mergedDlcs);

      // 3. Final DLC Probe: If still no DLCs, try to fetch from Steam Store Page directly
      if (Object.keys(mergedDlcs).length === 0) {
        console.log(`[DLC] No DLCs found for ${appId}, attempting store page probe...`);
        const extraDlcs = await fetchDlcsFromSteam(appId);
        if (extraDlcs) mergedDlcs = normalizeDlcs(extraDlcs, mergedDlcs);
      }

      return {
        success: true,
        game: {
          id: appId.toString(),
          name: steamData.name,
          header_image: steamData.header_image,
          library_hero: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`,
          dev: steamData.developers?.join(', '),
          pub: steamData.publishers?.join(', '),
          date: steamData.release_date?.date,
          desc: (steamData.short_description || '').replace(/<[^>]*>?/gm, ''),
          trailer: steamData.movies?.[0]?.webm?.max?.replace('http://', 'https://'),
          dlcs: mergedDlcs,
          isDenuvo
        }
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('generate-lua', async (event, { appId, gameName, dlcs }) => {
  const targetDir = 'C:\\Program Files (x86)\\Steam\\config\\stplug-in';
  const filePath = path.join(targetDir, `${appId}.lua`);
  
  try {
    // 0. Ensure Remote Database is loaded
    if (Object.keys(remoteGameDB).length === 0) {
      console.log('[LUA] Remote DB empty, attempting emergency reload...');
      await loadRemoteDatabase();
    }

    let extractedHash = '0';
    let hashPriority = 0;
    let extractedDepotsMap = new Map(); // Map<id, {manifest, priority}>
    let sourceLog = [];

    // Helper to set manifest with priority
    const setManifest = (dId, mId, priority, sourceName) => {
      const sid = String(dId);
      let mid = String(mId);

      // If mId is an object (common in some APIs), try to find the manifest string inside
      if (mId && typeof mId === 'object') {
        mid = String(mId.manifestid || mId.gid || mId.manifest || mId.id || mId.public || Object.values(mId).find(v => typeof v === 'string' && /^\d{18,20}$/.test(v)) || '');
      }

      // Steam manifests are strictly 18-20 digits. Anything else is likely a wrong ID (like a Build ID or Timestamp)
      if (!/^\d+$/.test(sid) || !/^\d{18,20}$/.test(mid)) return;
      
      const current = extractedDepotsMap.get(sid);
      if (!current || priority >= current.priority) {
        extractedDepotsMap.set(sid, { manifest: mid, priority });
        if (!sourceLog.includes(sourceName)) sourceLog.push(sourceName);
        return true;
      }
      return false;
    };

    // Helper to set hash with priority
    const setHash = (h, priority, sourceName) => {
      const sh = String(h);
      if (sh.length < 20 || sh === '0') return false;
      
      if (extractedHash === '0' || priority >= hashPriority) {
        extractedHash = sh;
        hashPriority = priority;
        if (!sourceLog.includes(sourceName)) sourceLog.push(sourceName);
        return true;
      }
      return false;
    };

    // 1. Priority: Check Remote Database (Monarch) - Priority 15
    const dbEntry = remoteGameDB[appId];
    if (dbEntry) {
      const hash = dbEntry.appticket || dbEntry.hash || dbEntry.sha || dbEntry.config?.appticket || dbEntry.appTicket;
      setHash(hash, 15, 'Monarch-DB');
      
      const depots = dbEntry.depots || dbEntry.config?.depots || dbEntry.manifests;
      if (depots && typeof depots === 'object') {
        Object.entries(depots).forEach(([dId, mId]) => {
          let actualMId = (typeof mId === 'object') ? (mId.manifestid || mId.gid || mId.manifest || Object.values(mId)[0]) : mId;
          setManifest(dId, actualMId, 15, 'Monarch-DB');
        });
      }
    }

    // 2. Secondary: Parallel API/GitHub Probing
    const apiUrls = [
      { url: `https://raw.githubusercontent.com/Steammanifest/Steammanifest/master/manifests/${appId}.json`, priority: 20 },
      { url: `https://raw.githubusercontent.com/SteamTools-Team/GameList/master/depots/${appId}.json`, priority: 15 },
      { url: `https://raw.githubusercontent.com/SteamTools-Team/GameList/master/data/${appId}.json`, priority: 15 },
      { url: `https://raw.githubusercontent.com/SteamTools-Team/GameList/master/lua/${appId}.lua`, priority: 15 },
      { url: `https://api.steamcmd.net/v1/info/${appId}`, priority: 18 },
      { url: `https://api.steamcmd.net/v1/app/${appId}`, priority: 18 },
      { url: `https://steamcmd.net/api/v1/app/${appId}`, priority: 18 },
      { url: `https://api.steamtools.net/api/v1/app/${appId}`, priority: 18 },
      { url: `https://raw.githubusercontent.com/SteamTools-Team/SteamTools/master/data/app/${appId}.json`, priority: 18 }
    ];

    console.log(`[LUA] Launching parallel probe of ${apiUrls.length} sources...`);

    const probeResults = await Promise.all(apiUrls.map(async (item) => {
      return new Promise((resolve) => {
        const request = net.request({ url: item.url });
        request.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        let body = '';
        request.on('response', (response) => {
          if (response.statusCode !== 200) { resolve(null); return; }
          response.on('data', (chunk) => { body += chunk; });
          response.on('end', () => { resolve({ url: item.url, text: body, priority: item.priority }); });
        });
        request.on('error', () => resolve(null));
        request.end();
        setTimeout(() => resolve(null), 15000);
      });
    }));

    probeResults.filter(Boolean).forEach(({ url, text, priority }) => {
      const sourceName = url.split('/').slice(-3).join('/');

      // --- Strategy A: JSON Deep Search ---
      try {
        const jsonData = JSON.parse(text);
        
        const processDepots = (depotsObj, p) => {
          if (!depotsObj || typeof depotsObj !== 'object') return;
          Object.entries(depotsObj).forEach(([dId, dVal]) => {
            if (!/^\d+$/.test(dId)) return;
            
            let mId = null;
            if (typeof dVal === 'object') {
              // 1. Look for public branch specifically (Steam Metadata style)
              if (dVal.manifests && dVal.manifests.public) {
                const pub = dVal.manifests.public;
                mId = typeof pub === 'object' ? (pub.gid || pub.manifestid || pub.manifest) : pub;
              }
              // 2. Look for direct gid/manifestid (steamcmd style)
              if (!mId) mId = dVal.gid || dVal.manifestid || dVal.manifest || dVal.id;
              // 3. Brute force within the object
              if (!mId) mId = Object.values(dVal).find(v => typeof v === 'string' && /^\d{18,20}$/.test(v));
            } else {
              mId = dVal;
            }
            
            if (mId) setManifest(dId, mId, p, sourceName);
          });
        };

        const deepSearch = (obj) => {
          if (!obj || typeof obj !== 'object') return;
          
          // Hash Search
          const h = obj.appticket || obj.app_ticket || obj.appTicket || obj.hash || obj.sha || obj.ticket || obj.app_ticket_id || obj.AppTicket || obj.config?.appticket;
          setHash(h, priority, sourceName);

          // Specific Depot Search
          const depots = obj.depots || obj.manifests || obj.config?.depots;
          if (depots) processDepots(depots, priority);

          // Continue deep search for other potential objects
          Object.entries(obj).forEach(([key, val]) => {
            if (val && typeof val === 'object' && key !== 'depots' && key !== 'manifests') {
              deepSearch(val);
            }
          });
        };

        deepSearch(jsonData);
      } catch (e) {}

      // --- Strategy B: Regex Pattern Matching (LUA/Text) ---
      const mMatches = text.matchAll(/(?:addappid|setmanifestid|ManifestID|setmanifest|adddepot)\s*\(?\s*(\d+)\s*,\s*["']?(\d{18,20})["']?\s*\)?/gi);
      for (const m of mMatches) {
        setManifest(m[1], m[2], priority, sourceName);
      }

      const hMatches = text.matchAll(/(?:addappid|setappticket|AppTicket|Ticket|App_Ticket|appticket)\s*\(?\s*(\d+)\s*,\s*0\s*,\s*["']?([a-fA-F0-9]{32,})["']?\s*\)?/gi);
      for (const h of hMatches) {
        if (h[1] === String(appId)) setHash(h[2], priority, sourceName);
      }

      // --- Strategy C: Brute Force ---
      const bruteMatches = text.matchAll(/["']?(\d{5,8})["']?\s*[:=,]\s*["']?(\d{18,20})["']?/g);
      for (const b of bruteMatches) {
        setManifest(b[1], b[2], priority - 1, sourceName);
      }
    });

    // 2.5 Emergency Brute Force on RemoteDB (Priority 5)
    if (dbEntry) {
       const str = JSON.stringify(dbEntry);
       const manifestMatches = str.matchAll(/["']?(\d{5,8})["']?\s*[:=]\s*["']?(\d{18,20})["']?/g);
       for (const match of manifestMatches) {
         setManifest(match[1], match[2], 5, 'RemoteDB-Brute');
       }
    }

    // 2.6 FINAL ATTEMPT: Only if we found ABSOLUTELY NOTHING
    if (extractedDepotsMap.size === 0) {
      console.log('[LUA] No depots found. Attempting desperate fallback...');
      probeResults.filter(Boolean).forEach(({ text }) => {
        // Find the most frequent 18-20 digit number that isn't the appId
        const allNums = text.match(/\b\d{18,20}\b/g) || [];
        if (allNums.length > 0) {
          const counts = {};
          allNums.forEach(n => counts[n] = (counts[n] || 0) + 1);
          const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
          // Use the most frequent one as the main manifest for the AppID
          setManifest(appId, sorted[0][0], 1, 'Emergency-Fallback');
        }
      });
    }

    console.log(`[LUA] Final: ${extractedDepotsMap.size} depots, Hash: ${extractedHash !== '0' ? 'OK' : 'FAIL'}`);

    // 3. Construct LUA File
    let lua = `-- Added with Monarch System\n`;
    lua += `-- Game: ${gameName}\n`;
    lua += `-- AppID: ${appId}\n`;
    if (sourceLog.length > 0) lua += `-- Sources: ${[...new Set(sourceLog)].join(', ')}\n`;
    lua += `\naddappid(${appId})\n\n`;

    const sortedIds = Array.from(extractedDepotsMap.keys()).sort((a, b) => parseInt(a) - parseInt(b));
    sortedIds.forEach(id => {
      const d = extractedDepotsMap.get(id);
      lua += `-- Depot ID: ${id}\n`;
      lua += `-- Displaying manifest: ${d.manifest}\n`;
      lua += `addappid(${id}, "${d.manifest}")\n\n`;
    });

    if (extractedHash !== '0') {
      lua += `-- AppTicket Hash\n`;
      lua += `addappid(${appId}, 0, "${extractedHash}")\n`;
    }

    lua += `\n-- DLCs\n`;
    if (dlcs && typeof dlcs === 'object' && Object.keys(dlcs).length > 0) {
      Object.keys(dlcs).sort((a, b) => parseInt(a) - parseInt(b)).forEach(id => {
        lua += `-- DLC ID: ${id}\n`;
        lua += `addappid(${id}, 1); -- ${dlcs[id]}\n`;
      });
    }

    // Ensure directory exists and write
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(filePath, lua);
    console.log(`[LUA] File written: ${filePath} (${lua.length} bytes)`);
    
    return { 
      success: true, 
      hash: extractedHash, 
      depotsCount: extractedDepotsMap.size,
      hashStatus: extractedHash && extractedHash !== '0' ? 'CAPTURED' : 'SKIPPED (0)',
      sources: [...new Set(sourceLog)]
    };

  } catch (error) {
    console.error('[LUA] Fatal Error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('check-lua-exists', async (event, appId) => {
  const filePath = path.join('C:\\Program Files (x86)\\Steam\\config\\stplug-in', `${appId}.lua`);
  try {
    return { success: true, exists: fs.existsSync(filePath) };
  } catch (error) {
    return { success: true, exists: false };
  }
});

ipcMain.handle('remove-lua', async (event, appId) => {
  const filePath = path.join('C:\\Program Files (x86)\\Steam\\config\\stplug-in', `${appId}.lua`);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-placeholder', async (event, gameName) => {
  const filePath = path.join(app.getPath('userData'), `${gameName.replace(/\s+/g, '_')}_injection.txt`);
  try {
    fs.writeFileSync(filePath, `Placeholder for ${gameName}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
});

const getSteamPath = () => {
  const commonPaths = [
    'C:\\Program Files (x86)\\Steam',
    'C:\\Program Files\\Steam',
  ];
  
  for (const p of commonPaths) {
    if (fs.existsSync(p)) return p;
  }

  // Try to find from Registry if on Windows
  try {
    const { execSync } = require('child_process');
    const regPath = execSync('reg query "HKCU\\Software\\Valve\\Steam" /v "SteamPath"').toString();
    const match = regPath.match(/REG_SZ\s+(.+)/);
    if (match) {
      const p = match[1].trim().replace(/\//g, '\\');
      if (fs.existsSync(p)) return p;
    }
  } catch (e) {}

  return 'C:\\Program Files (x86)\\Steam'; 
};

// Metadata Cache for unknown games to avoid re-fetching
let metadataCache = {};

ipcMain.handle('get-my-games', async () => {
  const steamBase = getSteamPath();
  const addedGamesDir = path.join(steamBase, 'config', 'stplug-in');
  const steamAppsDir = path.join(steamBase, 'steamapps');
  const myGames = [];

  console.log(`[System] Scanning for My Games...`);
  console.log(`[System] Detected Steam Base: ${steamBase}`);

  try {
    // 1. Get Added Games (LUA files)
    if (fs.existsSync(addedGamesDir)) {
      const files = fs.readdirSync(addedGamesDir).filter(f => f.endsWith('.lua'));
      
      const addedGames = await Promise.all(files.map(async (file) => {
        const appId = file.replace('.lua', '');
        let gameInfo = remoteGameDB[appId] || metadataCache[appId] || {};
        
        // If still unknown, try a quick background fetch if not already in cache
        if (!gameInfo.name && !metadataCache[appId]) {
          try {
            const detailsUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`;
            const detailsResponse = await new Promise((resolve) => {
              const request = net.request(detailsUrl);
              request.on('response', (response) => {
                let data = '';
                response.on('data', (chunk) => { data += chunk; });
                response.on('end', () => {
                  try { resolve(JSON.parse(data)); } catch(e) { resolve(null); }
                });
              });
              request.on('error', () => resolve(null));
              request.end();
            });

            if (detailsResponse?.[appId]?.success) {
              const data = detailsResponse[appId].data;
              metadataCache[appId] = {
                name: data.name,
                header_image: data.header_image
              };
              gameInfo = metadataCache[appId];
            }
          } catch (e) {
            console.error(`[System] Failed to fetch metadata for ${appId}`);
          }
        }

        return {
          id: appId,
          name: gameInfo.name || `Unknown Game (${appId})`,
          header_image: gameInfo.header_image || `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`,
          capsule_image: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`,
          hero_image: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/hero_capsule.jpg`,
          type: 'added'
        };
      }));

      myGames.push(...addedGames);
    }

    // 2. Get Installed Steam Games from ALL libraries
    const libraries = [steamAppsDir];
    const libraryFoldersPath = path.join(steamAppsDir, 'libraryfolders.vdf');
    
    if (fs.existsSync(libraryFoldersPath)) {
      const content = fs.readFileSync(libraryFoldersPath, 'utf-8');
      const pathRegex = /"path"\s+"([^"]+)"/g;
      let match;
      while ((match = pathRegex.exec(content)) !== null) {
        const libPath = match[1].replace(/\\\\/g, '\\');
        const fullLibPath = path.join(libPath, 'steamapps');
        if (fs.existsSync(fullLibPath) && !libraries.includes(fullLibPath)) {
          libraries.push(fullLibPath);
        }
      }
    }

    // Process libraries in parallel for faster scanning
    const libraryPromises = libraries.map(async (lib) => {
      const libGames = [];
      if (fs.existsSync(lib)) {
        const files = fs.readdirSync(lib);
        const manifestFiles = files.filter(file => file.startsWith('appmanifest_') && file.endsWith('.acf'));
        
        for (const file of manifestFiles) {
          const appId = file.replace('appmanifest_', '').replace('.acf', '');
          
          let name = `Steam Game (${appId})`;
          try {
            const acfContent = fs.readFileSync(path.join(lib, file), 'utf-8');
            const nameMatch = acfContent.match(/"name"\s+"([^"]+)"/);
            if (nameMatch) name = nameMatch[1];
          } catch (e) {}

          let gameInfo = remoteGameDB[appId] || metadataCache[appId] || {};
          
          // If name is still generic, try background fetch
          if (name.includes('Steam Game') && !gameInfo.name && !metadataCache[appId]) {
            try {
              const detailsUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`;
              const detailsResponse = await new Promise((resolve) => {
                const request = net.request(detailsUrl);
                request.on('response', (response) => {
                  let data = '';
                  response.on('data', (chunk) => { data += chunk; });
                  response.on('end', () => {
                    try { resolve(JSON.parse(data)); } catch(e) { resolve(null); }
                  });
                });
                request.on('error', () => resolve(null));
                request.end();
              });

              if (detailsResponse?.[appId]?.success) {
                const data = detailsResponse[appId].data;
                metadataCache[appId] = {
                  name: data.name,
                  header_image: data.header_image
                };
                gameInfo = metadataCache[appId];
              }
            } catch (e) {}
          }

          libGames.push({
            id: appId,
            name: gameInfo.name || name,
            header_image: gameInfo.header_image || `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`,
            capsule_image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`,
            library_image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`,
            type: 'steam'
          });
        }
      }
      return libGames;
    });

    const libraryResults = await Promise.all(libraryPromises);
    libraryResults.forEach(libGames => {
      libGames.forEach(game => {
        if (!myGames.find(g => g.id === game.id)) {
          myGames.push(game);
        }
      });
    });

    console.log(`[System] Total games indexed: ${myGames.length}`);
    return { success: true, games: myGames };
  } catch (error) {
    console.error('[System] Failed to retrieve My Games:', error);
    return { success: false, error: error.message };
  }
});

// Settings Protocol: Save/Load System Configuration
const SETTINGS_PATH = path.join(app.getPath('userData'), 'system_settings.json');

ipcMain.handle('save-settings', async (event, settings) => {
  try {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
    return { success: true };
  } catch (error) {
    console.error('[System] Settings Save Failed:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-settings', async () => {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const data = fs.readFileSync(SETTINGS_PATH, 'utf-8');
      return { success: true, settings: JSON.parse(data) };
    }
    return { success: true, settings: {} };
  } catch (error) {
    console.error('[System] Settings Load Failed:', error);
    return { success: false, error: error.message };
  }
});

// License Key Generation System
const KEYS_PATH = path.join(app.getPath('userData'), 'generated_keys.json');

// Load existing keys
function loadGeneratedKeys() {
  try {
    if (fs.existsSync(KEYS_PATH)) {
      const data = fs.readFileSync(KEYS_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('[Keys] Failed to load keys:', error);
  }
  return {};
}

// Save keys
function saveGeneratedKeys(keys) {
  try {
    fs.writeFileSync(KEYS_PATH, JSON.stringify(keys, null, 2));
  } catch (error) {
    console.error('[Keys] Failed to save keys:', error);
  }
}

// Generate a new license key
ipcMain.handle('generate-key', async () => {
  try {
    const keys = loadGeneratedKeys();
    
    // Generate unique key: XXXX-XXXX-XXXX format
    const generateSegment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const newKey = `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
    
    // Store key with metadata
    keys[newKey] = {
      createdAt: new Date().toISOString(),
      used: false,
      usedBy: null,
      usedAt: null
    };
    
    saveGeneratedKeys(keys);
    console.log('[Keys] Generated new key:', newKey);
    
    return { success: true, key: newKey };
  } catch (error) {
    console.error('[Keys] Generation failed:', error);
    return { success: false, error: error.message };
  }
});

// Validate a license key
ipcMain.handle('validate-key', async (event, key, deviceId) => {
  try {
    const keys = loadGeneratedKeys();
    const upperKey = String(key || '').toUpperCase();
    const normalizedDeviceId = String(deviceId || '').trim();
    
    // Master key acts like a device-bound key
    if (upperKey === 'ARISE-2026') {
      const keyData = keys[upperKey];
      if (keyData?.used) {
        if (normalizedDeviceId && keyData.usedBy === normalizedDeviceId) {
          return {
            success: true,
            valid: true,
            used: true,
            sameDevice: true,
            isMaster: true,
            message: 'Master key accepted for this device',
            usedBy: keyData.usedBy,
          };
        }
        return {
          success: true,
          valid: false,
          used: true,
          isMaster: true,
          message: 'Master key already activated on another device',
          usedBy: keyData.usedBy,
        };
      }
      return { success: true, valid: true, isMaster: true, message: 'Master key accepted' };
    }
    
    // Check if key exists
    if (!keys[upperKey]) {
      return { success: false, valid: false, message: 'Invalid key' };
    }
    
    const keyData = keys[upperKey];
    
    // Check if already used
    if (keyData.used) {
      if (normalizedDeviceId && keyData.usedBy === normalizedDeviceId) {
        return {
          success: true,
          valid: true,
          used: true,
          sameDevice: true,
          message: 'Key already activated on this device',
          usedBy: keyData.usedBy,
        };
      }
      return { success: true, valid: false, used: true, message: 'Key already used', usedBy: keyData.usedBy };
    }
    
    return { success: true, valid: true, message: 'Key is valid' };
  } catch (error) {
    console.error('[Keys] Validation failed:', error);
    return { success: false, error: error.message };
  }
});

// Mark key as used
ipcMain.handle('mark-key-used', async (event, { key, deviceId }) => {
  try {
    const keys = loadGeneratedKeys();
    const upperKey = String(key || '').toUpperCase();
    const normalizedDeviceId = String(deviceId || '').trim();
    
    if (!upperKey) {
      return { success: false, message: 'Invalid key' };
    }

    if (!keys[upperKey]) {
      keys[upperKey] = {
        createdAt: new Date().toISOString(),
        used: false,
        usedBy: null,
        usedAt: null,
      };
    }

    if (keys[upperKey].used) {
      if (normalizedDeviceId && keys[upperKey].usedBy === normalizedDeviceId) {
        return { success: true, message: 'Key already bound to this device', isMaster: upperKey === 'ARISE-2026' };
      }
      return { success: false, message: 'Key already bound to another device' };
    }

    keys[upperKey].used = true;
    keys[upperKey].usedBy = normalizedDeviceId || 'UNKNOWN_DEVICE';
    keys[upperKey].usedAt = new Date().toISOString();
    saveGeneratedKeys(keys);

    if (upperKey === 'ARISE-2026') {
      console.log('[Keys] Master key bound to device:', normalizedDeviceId);
      return { success: true, isMaster: true };
    }

    console.log('[Keys] Marked as used:', upperKey, 'by device:', normalizedDeviceId);
    return { success: true };
  } catch (error) {
    console.error('[Keys] Mark used failed:', error);
    return { success: false, error: error.message };
  }
});

// Get all generated keys (for admin)
ipcMain.handle('get-all-keys', async () => {
  try {
    const keys = loadGeneratedKeys();
    return { success: true, keys };
  } catch (error) {
    console.error('[Keys] Get all failed:', error);
    return { success: false, error: error.message };
  }
});
