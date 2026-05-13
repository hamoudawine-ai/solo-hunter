import React, { useState, useEffect, useCallback, useMemo } from 'react'
// SOLO HUNTER App
import { Search, MoreVertical, ChevronRight, X, Minus, Square, Zap, Settings2, Activity, Eye, EyeOff, ShieldAlert, MessageSquare, RefreshCcw, RefreshCw, Key, Package } from 'lucide-react'

const DiscordIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.0741 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2914a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
  </svg>
)

const RANKS = [
  { 
    minLv: 1, 
    maxLv: 10, 
    label: 'E', 
    color: '#00d2ff', 
    wallpaper: '/themes/wallpaper.mp4',
    font: "'Cinzel', serif",
    glow: 'shadow-neon',
    character: {
      name: 'SUNG JIN-WOO',
      subName: '(성진우)',
      title: 'The Weakest Hunter of All Mankind',
      desc: 'Initially an E-rank Hunter, he was known as the world\'s weakest. After a double dungeon incident, he became a Player of the System, allowing him to level up without limits.'
    }
  },
  { 
    minLv: 11, 
    maxLv: 20, 
    label: 'D', 
    color: '#4ade80', 
    wallpaper: '/themes/sung-jin-woo-vs-architect-solo-hunter-moewalls-com.mp4',
    font: "'Orbitron', sans-serif",
    glow: 'shadow-[0_0_15px_#4ade80]',
    character: {
      name: 'THE ARCHITECT',
      subName: '(설계자)',
      title: 'System Creator Confrontation',
      desc: 'The creator of the System that chose Sung Jin-Woo. This battle marks the moment Jin-Woo begins to uncover the truth behind his powers and the true purpose of the SOLO HUNTER System.'
    }
  },
  { 
    minLv: 21, 
    maxLv: 30, 
    label: 'C', 
    color: '#facc15', 
    wallpaper: '/themes/cha-hae-in.1920x1080.mp4',
    font: "'Cinzel', serif",
    glow: 'shadow-[0_0_15px_#facc15]',
    character: {
      name: 'CHA HAE-IN',
      subName: '(차해인)',
      title: 'S-Rank Hunter / Sword Dancer',
      desc: 'One of the strongest S-Rank hunters in South Korea. Known for her incredible speed and "The Dancer" sword style. She possesses a unique sense of smell for mana.'
    }
  },
  { 
    minLv: 31, 
    maxLv: 40, 
    label: 'B', 
    color: '#fb923c', 
    wallpaper: '/themes/igris-silent-knight.1920x1080.mp4',
    font: "'MedievalSharp', cursive",
    glow: 'shadow-[0_0_15px_#fb923c]',
    character: {
      name: 'BLOOD-RED IGRIS',
      subName: '(핏빛의 이그리트)',
      title: 'The Commander of the Shadow Army',
      desc: 'A legendary knight of the Shadow Army. Known for his unwavering loyalty and unmatched speed, he is the first commander of the SOLO HUNTER.'
    }
  },
  { 
    minLv: 41, 
    maxLv: 50, 
    label: 'A', 
    color: '#ef4444', 
    wallpaper: '/themes/sung-jin-woo-necromancer-solo-hunter-moewalls-com.mp4',
    font: "'Russo One', sans-serif",
    glow: 'shadow-[0_0_20px_#ef4444]',
    character: {
      name: 'THE NECROMANCER',
      subName: '(강령술사)',
      title: 'Shadow Extraction Unlocked',
      desc: 'After the job change quest, Jin-Woo obtained the power to extract shadows from the dead. "Arise" - the word that commands the army of the fallen.'
    }
  },
  { 
    minLv: 51, 
    maxLv: 70, 
    label: 'S', 
    color: '#a855f7', 
    wallpaper: '/themes/beru.mp4',
    font: "'Exo 2', sans-serif",
    glow: 'shadow-[0_0_25px_#a855f7]',
    character: {
      name: 'BERU',
      subName: '(베르)',
      title: 'Shadow Ant King / Marshal Grade',
      desc: 'The former King of the Ants from Jeju Island. After being reborn as a shadow, he became one of Jin-Woo\'s most loyal and powerful marshals, possessing terrifying speed and strength.'
    }
  },
  { 
    minLv: 71, 
    maxLv: 90, 
    label: 'SS', 
    color: '#ffffff', 
    wallpaper: '/themes/sung-jinwoo-shadow-monarch-solo-hunter-moewalls-com.mp4',
    font: "'Exo 2', sans-serif",
    glow: 'shadow-[0_0_30px_#ffffff]',
    character: {
      name: 'ASHBORN\'S SUCCESSOR',
      subName: '(아스본의 후계자)',
      title: 'SOLO HUNTER Protocol',
      desc: 'Inheritor of the SOLO HUNTER\'s true power. The boundaries between life and death blur as the Hunter\'s will becomes the law of the universe.'
    }
  },
  { 
    minLv: 91, 
    maxLv: 999, 
    label: 'SSS+', 
    color: '#ffffff', 
    wallpaper: '/themes/Sung Jinwoo King Darkness SOLO HUNTER Live Wallpaper - MoeWalls.mp4',
    font: "'Exo 2', sans-serif",
    glow: 'shadow-[0_0_40px_#ffffff]',
    character: {
      name: 'KING OF DARKNESS',
      subName: '(어둠의 왕)',
      title: 'Supreme Hunter Unleashed',
      desc: 'The final evolution. A being that has surpassed all dimensions and rules. The entire universe trembles before the King of Darkness.'
    }
  },
]

const playSuccessSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    oscillator.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.error('Audio Protocol Failed:', e);
  }
};

function splitGameDetailTitle(name) {
  const raw = typeof name === 'string' ? name : ''
  if (!raw.trim()) return { main: 'ELDEN RING', sub: '' }
  const idx = raw.indexOf(':')
  if (idx === -1) return { main: raw.trim(), sub: '' }
  const main = raw.slice(0, idx).trim()
  const sub = raw.slice(idx + 1).trim()
  return { main: main || raw.trim(), sub: sub || '' }
}

/** Official-style logos from Steam CDN; cycle on error, then fallback to styled text */
function steamGameLogoUrlCandidates(appId) {
  const id = appId != null ? String(appId).trim() : ''
  if (!id) return []
  const urls = [
    // Primary: White library logos (best for dark themes)
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/library_logo_white.png`,
    `https://cdn.akamai.steamstatic.com/steam/apps/${id}/library_logo_white.png`,
    // Secondary: Regular library logos
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/library_logo.png`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/library_logo.jpg`,
    // Tertiary: General logos
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/logo.png`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/logo.jpg`,
    // Additional logo variants from different CDNs
    `https://cdn.akamai.steamstatic.com/steam/apps/${id}/logo.png`,
    `https://cdn.akamai.steamstatic.com/steam/apps/${id}/library_logo.png`,
    // Fallback: Header/capsule images as logo alternatives
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/header.png`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/header.jpg`,
    `https://cdn.akamai.steamstatic.com/steam/apps/${id}/capsule_231x87.png`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/capsule_231x87.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/capsule_616x353.jpg`,
    // Additional fallbacks for older games
    `https://cdn.akamai.steamstatic.com/steam/apps/${id}/capsule_sm_120.jpg`,
  ]
  const uniqueUrls = [...new Set(urls)];
  console.log(`[Logo Debug] Generated ${uniqueUrls.length} unique URLs for AppID ${id}:`, uniqueUrls)
  return uniqueUrls
}

const ONLINE_FIX_ONLY_GAME_TITLES = ['ينابلي', 'ونليني']

function isOnlineFixOnlyGame(game) {
  if (!game || !game.name) return false
  return ONLINE_FIX_ONLY_GAME_TITLES.some((title) => game.name.includes(title))
}

function GameDetailTitleBlock({ game }) {
  const candidates = useMemo(() => steamGameLogoUrlCandidates(game?.id), [game?.id])
  const [logoIx, setLogoIx] = useState(0)
  const [logoLoadFailed, setLogoLoadFailed] = useState(false)

  useEffect(() => {
    setLogoIx(0)
    setLogoLoadFailed(false)
  }, [game?.id])

  const hasCandidates = candidates.length > 0
  const logoSrc =
    hasCandidates && logoIx < candidates.length && !logoLoadFailed ? candidates[logoIx] : null
  
  // No longer using header image as fallback for logo
  const fallbackLogoSrc = null;

  const { main: titleMain, sub: titleSub } = splitGameDetailTitle(game?.name)
  const titleLen = titleMain.length + titleSub.length
  const sizeClass =
    titleLen > 42 ? 'text-3xl' :
    titleLen > 30 ? 'text-4xl' :
    titleLen > 16 ? 'text-5xl' :
    'text-6xl'

  const handleLogoError = () => {
    console.log(`[Logo Debug] Failed to load logo ${logoIx + 1}/${candidates.length}: ${logoSrc}`)
    if (logoIx < candidates.length - 1) {
      setLogoIx((i) => i + 1)
    } else {
      console.log(`[Logo Debug] All ${candidates.length} logo candidates failed for AppID ${game?.id}`)
      setLogoLoadFailed(true)
    }
  }

  return (
    <div className="max-w-2xl">
      {logoSrc ? (
        <div className="mb-1 flex min-h-[4.75rem] items-center">
          <img
            key={logoSrc}
            src={logoSrc}
            alt={game?.name || 'Game'}
            className="h-auto max-h-[5.75rem] w-auto max-w-full object-contain object-left drop-shadow-[0_6px_32px_rgba(0,0,0,0.9)] md:max-h-[7rem]"
            onError={handleLogoError}
            onLoad={() => {
              console.log(`[Logo Debug] Successfully loaded logo ${logoIx + 1}/${candidates.length}: ${logoSrc}`)
              setLogoLoadFailed(false)
            }}
            loading="eager"
            draggable={false}
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <h2 className={`font-black italic uppercase leading-[0.85] tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] ${sizeClass}`} style={{ fontFamily: "'Cinzel', serif" }}>
            {titleMain}
          </h2>
          {titleSub ? (
            <p className="mt-1 text-2xl font-black italic uppercase tracking-tight text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" style={{ fontFamily: "'Cinzel', serif" }}>
              {titleSub}
            </p>
          ) : null}
        </div>
      )}
      <p className="text-blue-400/60 text-[10px] font-bold tracking-[0.5em] uppercase pl-2 mt-3">
        {game?.dev || 'FromSoftware'} | {game?.pub || 'Bandai Namco'}
      </p>
    </div>
  )
}

// DLC Image Component with multiple fallback URLs
function DlcImage({ dlcId, gameId }) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0)
  const [hasError, setHasError] = useState(false)

  // Clean the IDs to ensure they are just numbers
  const cleanDlcId = useMemo(() => String(dlcId).trim(), [dlcId])
  const cleanGameId = useMemo(() => String(gameId).trim(), [gameId])
  
  // Generate multiple URL candidates for DLC images
  const imageUrls = useMemo(() => {
    if (!cleanDlcId) return []
    const urls = [
      // Primary: DLC header image (Cloudflare)
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${cleanDlcId}/header.jpg`,
      // Akamai mirror for header
      `https://cdn.akamai.steamstatic.com/steam/apps/${cleanDlcId}/header.jpg`,
      // Secondary: DLC capsule
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${cleanDlcId}/capsule_231x87.jpg`,
      `https://cdn.akamai.steamstatic.com/steam/apps/${cleanDlcId}/capsule_231x87.jpg`,
      // Tertiary: DLC library capsule
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${cleanDlcId}/library_600x900.jpg`,
      // Quaternary: DLC page background (small)
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${cleanDlcId}/page_bg_generated.jpg`,
      // Fallback: Use main game header as last resort
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${cleanGameId}/header.jpg`,
    ].filter(Boolean)
    return [...new Set(urls)]
  }, [cleanDlcId, cleanGameId])
  
  // Reset state when dlcId changes
  useEffect(() => {
    setCurrentUrlIndex(0)
    setHasError(false)
  }, [cleanDlcId])

  const currentUrl = imageUrls[currentUrlIndex]
  
  const handleError = () => {
    if (currentUrlIndex < imageUrls.length - 1) {
      setCurrentUrlIndex(prev => prev + 1)
    } else {
      setHasError(true)
    }
  }
  
  if (hasError) {
    // Show placeholder with DLC icon
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800/50 to-black/50">
        <Package className="w-8 h-8 text-white/30 mb-2" />
        <span className="text-[8px] text-white/40 uppercase tracking-wider">DLC</span>
      </div>
    )
  }
  
  return (
    <img
      src={currentUrl}
      alt={`DLC ${dlcId}`}
      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
      onError={handleError}
      loading="lazy"
    />
  )
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  // Progress is now stored per key - each key has its own level and exp
  const [level, setLevel] = useState(1)
  const [exp, setExp] = useState(0)
  const [activeCode, setActiveCode] = useState('')
  // Generate unique device ID
  const getOrCreateDeviceId = () => {
    let deviceId = localStorage.getItem('system_device_id')
    if (!deviceId) {
      deviceId = 'DEV-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36).toUpperCase()
      localStorage.setItem('system_device_id', deviceId)
    }
    return deviceId
  }

  const [systemLogoUrl, setSystemLogoUrl] = useState('system-logo.png');
  const [resolvedThemes, setResolvedThemes] = useState({});

  // Fetch app version from main process
  useEffect(() => {
    const fetchVersion = async () => {
      if (window.electronAPI?.getAppVersion) {
        try {
          const versionResult = await window.electronAPI.getAppVersion();
          if (versionResult?.success) {
            setAppVersion(versionResult.version);
          }
        } catch (error) {
          console.error('[Version] Failed to fetch app version:', error);
        }
      }
    };
    fetchVersion();
  }, []);

  useEffect(() => {
    const resolveAssets = async () => {
      if (window.electronAPI?.getResourcePath) {
        try {
          // Resolve Logo
          const resolvedLogo = await window.electronAPI.getResourcePath('public/system-logo.png');
          setSystemLogoUrl(resolvedLogo);

          // Resolve Themes
          const themePaths = {};
          for (const rank of RANKS) {
            if (rank.wallpaper) {
              const cleanPath = rank.wallpaper.startsWith('/') ? rank.wallpaper.slice(1) : rank.wallpaper;
              const resolved = await window.electronAPI.getResourcePath(`public/${cleanPath}`);
              themePaths[rank.wallpaper] = resolved;
            }
          }
          
          // Default wallpaper
          const defaultWp = await window.electronAPI.getResourcePath('public/themes/wallpaper.mp4');
          themePaths['/themes/wallpaper.mp4'] = defaultWp;
          
          setResolvedThemes(themePaths);
        } catch (e) {
          console.error('Failed to resolve paths', e);
        }
      }
    };
    resolveAssets();
  }, []);

  const [deviceId] = useState(() => getOrCreateDeviceId())
  const [isActivated, setIsActivated] = useState(() => {
    const activated = localStorage.getItem('system_activated') === 'true'
    const storedDeviceId = localStorage.getItem('system_activated_device_id')
    // If activated but on different device, require re-activation
    if (activated && storedDeviceId && storedDeviceId !== getOrCreateDeviceId()) {
      return false
    }
    return activated
  })
  const [showActivationModal, setShowActivationModal] = useState(false)
  const [activationCode, setActivationCode] = useState(() => localStorage.getItem('system_last_code') || '')
  const [activationError, setActivationError] = useState(false)
  const [deviceMismatchError, setDeviceMismatchError] = useState(false)
  const [userSelectedRank, setUserSelectedRank] = useState(() => {
    const savedRank = localStorage.getItem('system_selected_rank')
    return savedRank ? JSON.parse(savedRank) : null
  })
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState({ show: false, message: '', onConfirm: null })
  const [notifications, setNotifications] = useState([])
  const [generatedKey, setGeneratedKey] = useState('')
  const [autoExpEnabled, setAutoExpEnabled] = useState(() => localStorage.getItem('system_auto_exp') !== 'false')
  const [discordRpcEnabled, setDiscordRpcEnabled] = useState(() => localStorage.getItem('system_discord_rpc') !== 'false')
  const [uiTransparency, setUiTransparency] = useState(() => Number(localStorage.getItem('system_ui_transparency')) || 70)
  const [contentAlignment, setContentAlignment] = useState(() => localStorage.getItem('system_content_alignment') || 'left')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentView, setCurrentView] = useState('HOME') // HOME, MY_GAMES, ONLINE_FIX, ONLINE_FIX
  const [myGames, setMyGames] = useState([])
  const [isLoadingMyGames, setIsLoadingMyGames] = useState(false)
  const [onlineGames, setOnlineGames] = useState([])
  const [isLoadingOnlineGames, setIsLoadingOnlineGames] = useState(false)
  const [activeGameView, setActiveGameView] = useState(null)
  const [selectedDlcs, setSelectedDlcs] = useState(new Set())
  const [isInjected, setIsInjected] = useState(false)
  const [isGameDetailLoading, setIsGameDetailLoading] = useState(false)
  const [injectionFailed, setInjectionFailed] = useState(false)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [isExtracting, setIsExtraction] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [removingId, setRemovingId] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [showDlcs, setShowDlcs] = useState(true)
  const [onlineFixEnabled, setOnlineFixEnabled] = useState(false)
  const [comingSoon, setComingSoon] = useState(false)
  const [terminalMessages, setTerminalMessages] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showStartupScreen, setShowStartupScreen] = useState(true)
  const [appVersion, setAppVersion] = useState('3.0.0')

  const maxExp = level * 100
  const currentRank = useMemo(() => {
    if (userSelectedRank) return userSelectedRank
    return RANKS.find(r => level >= r.minLv && level <= r.maxLv) || RANKS[0]
  }, [level, userSelectedRank])

  const [isDeploying, setIsDeploying] = useState(false)

  const handleDeployTheme = (rank) => {
    setIsDeploying(true)
    // Small delay to simulate system deployment protocol
    setTimeout(() => {
      setUserSelectedRank(rank)
      localStorage.setItem('system_selected_rank', JSON.stringify(rank))
      addNotification(`SYSTEM: PROTOCOL ${rank.label} DEPLOYED`, 'success')
      
      // End deployment animation after theme switch
      setTimeout(() => {
        setIsDeploying(false)
        setShowThemeModal(false)
      }, 1000)
    }, 1500)
  }

  const activeGameBackground = useMemo(() => {
    if (!activeGameView) return null
    return activeGameView.library_hero || activeGameView.background_raw || activeGameView.background || activeGameView.header_image
  }, [activeGameView])

  const hasDenuvoProtection = useMemo(() => {
    if (!activeGameView) return false
    if (activeGameView.isDenuvo) return true
    const desc = (activeGameView.desc || '').toLowerCase()
    return desc.includes('denuvo') || desc.includes('tamper')
  }, [activeGameView])

  const hasGameUpdate = useMemo(() => {
    if (!activeGameView) return false
    return false 
  }, [activeGameView])

  const protocolPillCount = useMemo(() => {
    let count = 1
    if (activeGameView?.launcher) count++
    if (activeGameView?.online_fix) count++
    return count
  }, [activeGameView])

  const protocolPillBase = "group relative flex items-center justify-center space-x-3 px-6 py-3.5 rounded-xl text-[10px] font-black tracking-[0.25em] uppercase transition-all duration-300 overflow-hidden"
  
  const gameActionLabel = useMemo(() => {
    if (isExtracting) return 'Extracting Shadow...'
    if (isInjected) return 'Update Shadow'
    if (injectionFailed) return 'Extraction Failed'
    return 'Add Game'
  }, [isExtracting, isInjected, injectionFailed])

  const launcherProtocolEligible = activeGameView?.launcher || false
  const onlineFixProtocolEligible = activeGameView?.online_fix || false

  // Move fetchMyGames to a useCallback to keep it stable
  const fetchMyGames = useCallback(async () => {
    if (!isActivated) return;
    setIsLoadingMyGames(true);
    try {
      const res = await window.electronAPI.getMyGames();
      if (res.success) {
        const filteredGames = res.games.filter((game) => !isOnlineFixOnlyGame(game));
        setMyGames(filteredGames);
      }
    } catch (err) {
      console.error('Failed to fetch my games:', err);
    } finally {
      setIsLoadingMyGames(false);
    }
  }, [isActivated]);

  const fetchOnlineGames = useCallback(async () => {
    if (!isActivated) return;
    setIsLoadingOnlineGames(true);
    try {
      const res = await window.electronAPI.getInstalledGames();
      if (res.success) {
        setOnlineGames(res.games);
      }
    } catch (err) {
      console.error('Failed to fetch installed games:', err);
    } finally {
      setIsLoadingOnlineGames(false);
    }
  }, [isActivated]);

  const handleRemoveGameById = async (appId, name) => {
    if (!appId || isRemoving) return;
    
    try {
      setIsRemoving(true);
      setRemovingId(appId);
      addNotification(`[SYSTEM]: Initiating Shadow Erasure for ${name || appId}...`, 'info');
      const res = await window.electronAPI.removeLua(appId);
      
      if (res.success) {
        if (activeGameView && activeGameView.id === appId) {
          setIsInjected(false);
        }
        addNotification('[SYSTEM]: Shadow Successfully Erased from the Army.', 'success');
        // Refresh the list if we are in My Games view
        if (currentView === 'MY_GAMES') {
          fetchMyGames();
        }
      } else {
        addNotification(`[SYSTEM]: Erasure Failed: ${res.error}`, 'error');
      }
    } catch (err) {
      addNotification('[SYSTEM]: Protocol Error during Erasure.', 'error');
    } finally {
      setIsRemoving(false);
      setRemovingId(null);
    }
  };

  const handleRemoveGame = () => {
    if (activeGameView) {
      handleRemoveGameById(activeGameView.id, activeGameView.name);
    }
  };

  useEffect(() => {
    localStorage.setItem('system_level', level.toString())
    localStorage.setItem('system_exp', exp.toString())
    localStorage.setItem('system_activated', isActivated.toString())
    localStorage.setItem('system_active_code', activeCode)
    localStorage.setItem('system_last_code', activationCode)
    localStorage.setItem('system_auto_exp', autoExpEnabled.toString())
    localStorage.setItem('system_discord_rpc', discordRpcEnabled.toString())
    localStorage.setItem('system_ui_transparency', uiTransparency.toString())
    localStorage.setItem('system_content_alignment', contentAlignment)
    localStorage.setItem('system_selected_rank', JSON.stringify(userSelectedRank))
    
    // Save progress per key - each key has its own level and exp
    if (activeCode && isActivated) {
      localStorage.setItem(`progress_${activeCode}_level`, level.toString())
      localStorage.setItem(`progress_${activeCode}_exp`, exp.toString())
    }

    // Backup to Electron Settings Protocol
    window.electronAPI?.saveSettings({
      level, exp, isActivated, activeCode, activationCode, 
      autoExpEnabled, discordRpcEnabled, uiTransparency, contentAlignment, 
      userSelectedRank
    })
  }, [level, exp, isActivated, activeCode, activationCode, autoExpEnabled, discordRpcEnabled, uiTransparency, contentAlignment, userSelectedRank])

  // Check on startup if device ID matches stored activation and load progress
  useEffect(() => {
    const activated = localStorage.getItem('system_activated') === 'true'
    const storedDeviceId = localStorage.getItem('system_activated_device_id')
    const storedKey = localStorage.getItem('system_active_key')
    
    if (activated && storedDeviceId && storedDeviceId !== deviceId) {
      // Key is being used on different device - deactivate
      setIsActivated(false)
      setShowActivationModal(true)
      setDeviceMismatchError(true)
      addNotification('ACTIVATION REVOKED: KEY IN USE ON ANOTHER DEVICE', 'error')
      return
    }
    
    // If already activated, load the key-specific progress
    if (activated && storedKey) {
      setActiveCode(storedKey)
      
      // Master key always gets max level
      if (storedKey === 'ARISE-2026') {
        setLevel(999)
        setExp(99999)
      } else {
        const keyLevel = localStorage.getItem(`progress_${storedKey}_level`)
        const keyExp = localStorage.getItem(`progress_${storedKey}_exp`)
        if (keyLevel) {
          setLevel(Number(keyLevel))
          setExp(Number(keyExp) || 0)
        }
      }
    }
  }, [deviceId])

  // Separate effect for fetching games to avoid scroll reset and animation drop
  useEffect(() => {
    if (isActivated && currentView === 'MY_GAMES') {
      fetchMyGames();
    }
  }, [isActivated, currentView, fetchMyGames]);

  // Separate effect for fetching online games
  useEffect(() => {
    if (isActivated && currentView === 'ONLINE_FIX') {
      fetchOnlineGames();
    }
  }, [isActivated, currentView, fetchOnlineGames]);

  // Listen for RPC Status
  useEffect(() => {
    if (window.electronAPI?.onRPCStatus) {
      window.electronAPI.onRPCStatus((status, error) => {
        console.log(`[Discord RPC] Status: ${status}${error ? ` - Error: ${error}` : ''}`);
      });
    }
  }, [])

  // Automatic EXP gain
  useEffect(() => {
    if (!isActivated || !autoExpEnabled) return // Don't gain EXP if not activated or disabled
    const timer = setInterval(() => {
      addExp(10) // 10 EXP every 5 seconds
    }, 5000)
    return () => clearInterval(timer)
  }, [level, isActivated, autoExpEnabled])

  useEffect(() => {
    // If not activated, use a default neutral color
    const themeColor = isActivated ? currentRank.color : '#ffffff'
    document.documentElement.style.setProperty('--system-color', themeColor)
    document.documentElement.style.setProperty('--system-font', isActivated ? currentRank.font : "'Exo 2', sans-serif")

    // Update Discord RPC if enabled
    if (discordRpcEnabled) {
      if (isActivated) {
        let details = `Level ${level} - ${currentRank.character.name}`
        let state = `Rank: ${currentRank.label}`
        
        // Context-aware RPC status
        if (activeGameView) {
          details = `Analyzing: ${activeGameView.name}`
          state = `LV. ${level} | Rank ${currentRank.label}`
        } else if (currentView === 'MY_GAMES') {
          details = 'Browsing Shadow Army'
          state = `Total Profiles: ${myGames.length}`
        }

        window.electronAPI?.updateRPC({ details, state })
      } else {
        window.electronAPI?.updateRPC({
          details: 'System Status: Restricted',
          state: 'Waiting for Authentication...'
        })
      }
    } else {
      window.electronAPI?.updateRPC({ clear: true })
    }
  }, [currentRank, isActivated, level, discordRpcEnabled, activeGameView, currentView, myGames.length])

  // Search Suggestions Logic
  useEffect(() => {
    let isMounted = true

    const initVersionCheck = async () => {
      try {
        const versionResult = await window.electronAPI?.getAppVersion?.()
        if (isMounted && versionResult?.success) {
          setAppVersion(versionResult.version)
        }
      } catch (err) {
        console.error('Version check failed:', err)
      }
    }

    initVersionCheck()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const query = searchQuery.trim();
      if (query.length >= 2) { // Minimum 2 characters
        try {
          const res = await window.electronAPI?.searchGame(query);
          if (res && res.success && res.games) {
            setSuggestions(res.games);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        } catch (err) {
          console.error('Suggestion fetch failed', err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 600); // Increased debounce to 600ms to avoid rate limits

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      const query = searchQuery.toLowerCase().trim()
      
      if (query === 'exit' || query === 'back') {
        setActiveGameView(null)
        setSearchQuery('')
        setShowSuggestions(false)
        addNotification('RETURNING TO SYSTEM INTERFACE', 'info')
        return
      }

      if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      } else if (query.length >= 2) {
        setIsSearching(true);
        addNotification(`SYSTEM: SCANNING STEAM FOR ${query.toUpperCase()}...`, 'info');
        try {
          const res = await window.electronAPI?.searchGame(query);
          if (res.success && res.games && res.games.length > 0) {
            handleSelectSuggestion(res.games[0]);
          } else {
            addNotification('GAME NOT FOUND IN STEAM DATABASE', 'error');
            setIsSearching(false);
          }
        } catch (err) {
          addNotification('SEARCH PROTOCOL FAILED', 'error');
          setIsSearching(false);
        }
      }
    }
  }

  useEffect(() => {
    let timer;
    if (activeGameView && activeGameView.trailer) {
      setShowTrailer(false);
      console.log('[Trailer] Protocol Initialized. Waiting 5s...');
      timer = setTimeout(() => {
        setShowTrailer(true);
        console.log('[Trailer] Deploying Video Protocol...');
      }, 5000); // Reduced to 5 seconds
    }
    return () => clearTimeout(timer);
  }, [activeGameView]);

  const handleSelectSuggestion = async (game) => {
    if (!game || (!game.id && !game.appid)) return;
    
    const appId = game.id || game.appid;
    setIsSearching(true);
    setIsGameDetailLoading(true);
    setSearchQuery('');
    setShowSuggestions(false);
    addNotification(`GAME PROTOCOL: ${game.name.toUpperCase()} DETECTED`, 'success');
    
    try {
      console.log(`[Frontend] Fetching details for AppID: ${appId}`);
      const detailsRes = await window.electronAPI.getGameDetails(appId.toString());
      console.log('[Frontend] Details Response:', detailsRes);
      
      if (detailsRes && detailsRes.success && detailsRes.game) {
        setIsTransitioning(true);
        
        // Don't auto-select DLCs anymore, let the user choose
        setSelectedDlcs(new Set());
        
        // Reset game-specific settings
        setOnlineFixEnabled(false);
        setComingSoon(false);
        
        // Check if Lua already exists
        if (window.electronAPI?.checkLuaExists) {
          const existsRes = await window.electronAPI.checkLuaExists(appId.toString());
          if (existsRes?.success) {
            setIsInjected(existsRes.exists);
          }
        }

        setActiveGameView(detailsRes.game);
          setIsTransitioning(false);
          setIsSearching(false);
          // Keep loading visible for 2 seconds to ensure all images/content load
          setTimeout(() => {
            setIsGameDetailLoading(false);
          }, 2000);
      } else {
        console.error('Details retrieval failed:', detailsRes);
        addNotification('FAILED TO RETRIEVE GAME DATA', 'error');
        setIsSearching(false);
        setIsGameDetailLoading(false);
      }
    } catch (err) {
      console.error('Data protocol error:', err);
      addNotification('DATA PROTOCOL ERROR', 'error');
      setIsSearching(false);
      setIsGameDetailLoading(false);
    }
  };

  const addExp = (amount) => {
    if (!isActivated) return
    setExp(prevExp => {
      let newExp = prevExp + amount
      
      if (newExp >= maxExp) {
        newExp -= maxExp
        setLevel(l => {
          const nextLvl = l + 1
          addNotification(`LEVEL UP! REACHED LEVEL ${nextLvl}`, 'success')
          return nextLvl
        })
        return newExp
      }
      return newExp
    })
  }

  const addNotification = (message, type = 'info') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 4000)
  }

  const handleActivate = async () => {
    const upperCode = activationCode.toUpperCase().trim()
    
    if (!upperCode) {
      setActivationError(true)
      setTimeout(() => setActivationError(false), 2000)
      return
    }
    
    try {
      // Validate key against backend, including device binding
      const validation = await window.electronAPI.validateKey(upperCode, deviceId)
      
      if (!validation.success) {
        setActivationError(true)
        setTimeout(() => setActivationError(false), 2000)
        return
      }
      
      const isSameDeviceReuse = validation.used && validation.sameDevice
      if (!validation.valid && !isSameDeviceReuse) {
        if (validation.used) {
          // Key already used on another device
          setDeviceMismatchError(true)
          setTimeout(() => setDeviceMismatchError(false), 3000)
        } else {
          setActivationError(true)
          setTimeout(() => setActivationError(false), 2000)
        }
        return
      }
      
      // Key is valid and unused, or valid because it was previously activated on this same device
      if (!validation.used) {
        await window.electronAPI.markKeyUsed(upperCode, deviceId)
      }
      
      // Activate the system
      setIsActivated(true)
      setActiveCode(upperCode)
      setShowActivationModal(false)
      setActivationError(false)
      setDeviceMismatchError(false)
      // Store this device as the activated device
      localStorage.setItem('system_activated_device_id', deviceId)
      localStorage.setItem('system_active_key', upperCode)
      
      // Master key (ARISE-2026) gets MAX LEVEL (999) and MAX RANK (SSS+)
      if (upperCode === 'ARISE-2026') {
        setLevel(999)
        setExp(99999) // Max EXP
        addNotification('WELCOME, SOLO HUNTER. MAXIMUM POWER UNLOCKED.', 'success')
      } else {
        // Load progress for this specific key (or start fresh if new key)
        const keyProgress = localStorage.getItem(`progress_${upperCode}_level`)
        const keyExp = localStorage.getItem(`progress_${upperCode}_exp`)
        if (keyProgress) {
          setLevel(Number(keyProgress))
          setExp(Number(keyExp) || 0)
        } else {
          // New key - start fresh at Level 1
          setLevel(1)
          setExp(0)
        }
        addNotification('WELCOME, PLAYER. SYSTEM INITIALIZED.', 'success')
      }
    } catch (error) {
      console.error('Activation failed:', error)
      setActivationError(true)
      setTimeout(() => setActivationError(false), 2000)
    }
  }

  const changeAlignment = (alignment) => {
    if (contentAlignment === alignment) return;
    setIsTransitioning(true);
    
    // Close settings modal immediately
    setShowSettingsModal(false);

    setTimeout(() => {
      setContentAlignment(alignment);
      addNotification(`SYSTEM RECONFIGURED: ALIGNMENT SET TO ${alignment.toUpperCase()}`, 'info');
      // Wait for the state change to settle then fade back in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  }

  const handleRestartSteam = async () => {
    setShowConfirmModal({
      show: true,
      message: 'SYSTEM PROTOCOL: RESTART STEAM? THIS WILL CLOSE AND REOPEN THE STEAM CLIENT.',
      onConfirm: async () => {
        addNotification('STEAM: RESTART PROTOCOL INITIALIZED...', 'info')
        setShowConfirmModal({ show: false, message: '', onConfirm: null })
        const res = await window.electronAPI?.restartSteam()
        if (res.success) {
          addNotification('STEAM: RESTART COMMAND SENT', 'success')
        } else {
          addNotification('STEAM: RESTART FAILED', 'error')
        }
      }
    })
  }

  const handleLogout = () => {
    setShowConfirmModal({
      show: true,
      message: 'ARE YOU SURE YOU WANT TO LOGOUT? ACCESS TO THE SOLO HUNTER SYSTEM WILL BE RESTRICTED.',
      onConfirm: () => {
        setIsActivated(false)
        setActiveCode('')
        setUserSelectedRank(null)
        addNotification('SYSTEM DEACTIVATED. RETURNING TO SHADOW STATE.', 'info')
        setShowConfirmModal({ show: false, message: '', onConfirm: null })
      }
    })
  }

  const handleAddGameProtocol = async () => {
    if (!activeGameView || isExtracting || injectionFailed) return;
    
    const protocolType = isInjected ? 'UPDATE' : 'ADD';
    try {
      setIsExtraction(true);
      setExtractionProgress(0);
      setTerminalMessages([`[SYSTEM]: ${protocolType} PROTOCOL INITIATED...`] );
      addNotification(`[SYSTEM]: ${protocolType} GAME PROTOCOL STARTED`, 'info');
      
      const addMsg = (msg) => setTerminalMessages(prev => [...prev, msg]);

      // Filter only selected DLCs
      const finalDlcs = {};
      if (activeGameView.dlcs) {
        Object.entries(activeGameView.dlcs).forEach(([id, name]) => {
          if (selectedDlcs.has(id.toString())) {
            finalDlcs[id] = name || `DLC ${id}`;
          }
        });
      }

      // Stage 1: Search
      setTimeout(() => {
        addMsg('[SYSTEM]: Searching for Manifest Hash...');
        setExtractionProgress(30);
      }, 800);

      const res = await window.electronAPI.generateLua({
        appId: activeGameView.id,
        gameName: activeGameView.name,
        dlcs: finalDlcs
      });
      
      // Stage 2: Result
      setTimeout(() => {
        if (res.success) {
          addMsg(`[SYSTEM]: Hash: ${res.hashStatus}...`);
          addMsg(`[SYSTEM]: Depots: ${res.depotsCount || 0} extracted...`);
          setExtractionProgress(70);
          
          setTimeout(() => {
            addMsg('[SYSTEM]: Extraction Complete.');
            setExtractionProgress(100);
            
            setTimeout(() => {
              setIsExtraction(false);
              setIsInjected(true);
              setInjectionFailed(false);
              playSuccessSound(); // Trigger light success sound
              addNotification('[SYSTEM]: Shadow Extraction Complete. The game has joined your army.', 'success');
            }, 1000);
          }, 1000);
        } else {
          setIsExtraction(false);
          setInjectionFailed(true);
          addNotification(`[SYSTEM]: Extraction Failed: ${res.error}`, 'error');
          setTimeout(() => setInjectionFailed(false), 5000);
        }
      }, 1500);

    } catch (err) {
      setIsExtraction(false);
      setInjectionFailed(true);
      addNotification('[SYSTEM]: Protocol Error during Extraction.', 'error');
      setTimeout(() => setInjectionFailed(false), 5000);
    }
  };

  const isOnlineFixVisible = useMemo(() => {
    return currentView === 'ONLINE_FIX'
  }, [currentView])

  useEffect(() => {
    if (!activeGameView) {
      setIsInjected(false);
      setInjectionFailed(false);
      setOnlineFixEnabled(false);
    } else {
      // Check if this game has online_fix enabled
      setOnlineFixEnabled(activeGameView.online_fix || false);
    }
  }, [activeGameView]);

  useEffect(() => {
    if (activeGameView && currentView !== 'ONLINE_FIX' && isOnlineFixOnlyGame(activeGameView)) {
      setActiveGameView(null);
    }
  }, [currentView, activeGameView]);

  const handleToggleOnlineFix = async () => {
    if (!activeGameView) return;
    
    try {
      const newState = !onlineFixEnabled;
      setOnlineFixEnabled(newState);
      
      if (newState) {
        addNotification(`[ONLINE FIX]: Enabling online features for ${activeGameView.name}...`, 'info');
        setTimeout(() => {
          addNotification(`[ONLINE FIX]: Online protocol enabled successfully!`, 'success');
          playSuccessSound();
        }, 1500);
      } else {
        addNotification(`[ONLINE FIX]: Disabling online features for ${activeGameView.name}...`, 'info');
        setTimeout(() => {
          addNotification(`[ONLINE FIX]: Online protocol disabled.`, 'success');
        }, 1500);
      }
      
      // Update the activeGameView with new online_fix status
      setActiveGameView({
        ...activeGameView,
        online_fix: newState
      });
      
      // Also update the game in onlineGames array
      setOnlineGames(prevGames => 
        prevGames.map(g => 
          g.id === activeGameView.id ? { ...g, online_fix: newState } : g
        )
      );
    } catch (err) {
      addNotification('[ONLINE FIX]: Protocol Error', 'error');
    }
  };

  const handleToggleOnlineFixDirect = async (game, e) => {
    e.stopPropagation(); // Prevent triggering the game selection
    
    try {
      const newState = !game.online_fix;
      
      // Update the game in onlineGames array
      setOnlineGames(prevGames => 
        prevGames.map(g => 
          g.id === game.id ? { ...g, online_fix: newState } : g
        )
      );
      
      if (newState) {
        addNotification(`[ONLINE FIX]: Enabling online features for ${game.name}...`, 'info');
        setTimeout(() => {
          addNotification(`[ONLINE FIX]: Online protocol enabled successfully!`, 'success');
          playSuccessSound();
        }, 1500);
      } else {
        addNotification(`[ONLINE FIX]: Disabling online features for ${game.name}...`, 'info');
        setTimeout(() => {
          addNotification(`[ONLINE FIX]: Online protocol disabled.`, 'success');
        }, 1500);
      }
    } catch (err) {
      addNotification('[ONLINE FIX]: Protocol Error', 'error');
    }
  };

  const handleMinimize = () => window.electronAPI?.minimize()
  const handleMaximize = () => window.electronAPI?.maximize()
  const handleClose = () => window.electronAPI?.close()

  useEffect(() => {
    const timer = setTimeout(() => setShowStartupScreen(false), 3200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`relative flex flex-col h-screen bg-black text-white overflow-hidden transition-all duration-500`}>
      {/* Startup Splash Overlay */}
      {showStartupScreen && (
        <div className="startup-splash">
          <div className="startup-overlay"></div>
          <div className="startup-stars"></div>
          <div className="startup-glow"></div>
          <div className="startup-corner startup-topLeft">SOLO HUNTER</div>
          <div className="startup-corner startup-topRight">v{appVersion}</div>
          <div className="startup-corner startup-bottomLeft">SH</div>
          <div className="startup-corner startup-bottomRight">2026</div>
          <div className="startup-wave"></div>
          <div className="startup-wave startup-wave2"></div>
          <div className="startup-content">
            <img className="startup-logo" src={systemLogoUrl} alt="logo" />
            <div className="startup-title">SOLO HUNTER</div>
            <div className="startup-subtitle">STEAMTOOLS • DENUVO GAMES • ONLINE FIX</div>
            <div className="startup-loading-text">LOADING</div>
            <div className="startup-loading">
              <div className="startup-dot"></div>
              <div className="startup-dot"></div>
              <div className="startup-dot"></div>
              <div className="startup-dot"></div>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Protocol Overlay */}
      {isDeploying && (
        <div className="fixed inset-0 z-[6000] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-system-blue border-t-transparent rounded-full animate-spin mb-8 shadow-neon" />
            <h2 className="text-2xl font-black tracking-[0.5em] text-white uppercase animate-pulse">Deploying Protocol</h2>
            <p className="text-[10px] text-system-blue font-bold tracking-[0.3em] uppercase mt-4">Reconfiguring System Environment...</p>
          </div>
        </div>
      )}

      {/* Custom Title Bar */}
      <div className={`relative z-[100] flex items-center justify-between h-7 ${level > 30 ? 'bg-purple-900/20' : 'bg-black/90'} select-none drag-region border-b border-white/5`}>
        <div className="flex items-center pl-3 space-x-2 no-drag">
          <img src={systemLogoUrl} alt="" className="w-3.5 h-3.5 opacity-80" />
          <div className={`flex items-center space-x-2 px-2 py-0.5 bg-system-blue/10 border border-system-blue/30 rounded text-[8px] text-system-blue font-bold tracking-widest ${currentRank.glow}`}>
            <Zap className="w-2 h-2 fill-current" />
            <span>LV. {level}</span>
          </div>
        </div>
        
        <div className={`absolute left-1/2 -translate-x-1/2 text-[9px] ${level > 30 ? 'tracking-[0.8em]' : 'tracking-[0.5em]'} text-white/40 uppercase font-bold pointer-events-none transition-all duration-1000`}>
          {level > 30 ? 'SOLO HUNTER' : 'SOLO HUNTER'}
        </div>

        <div className="flex items-center h-full no-drag">
          <button onClick={() => addExp(50)} className="px-3 h-full hover:bg-system-blue/10 text-[8px] font-bold text-system-blue/50 hover:text-system-blue transition-all uppercase tracking-tighter">
            + Gain EXP
          </button>
          <button onClick={handleMinimize} className="flex items-center justify-center w-9 h-full hover:bg-white/10 transition-colors">
            <Minus className="w-2.5 h-2.5" />
          </button>
          <button onClick={handleMaximize} className="flex items-center justify-center w-9 h-full hover:bg-white/10 transition-colors">
            <Square className="w-2 h-2" />
          </button>
          <button onClick={handleClose} className="flex items-center justify-center w-11 h-full hover:bg-red-500/90 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden" style={{ opacity: uiTransparency / 100 }}>
        {/* Notifications Layer */}
        <div className="fixed top-20 right-8 z-[1000] flex flex-col space-y-4 pointer-events-none">
          {notifications.map(n => (
            <div key={n.id} className="flex items-center space-x-4 bg-black/80 border-l-4 border-system-blue p-4 backdrop-blur-md shadow-neon min-w-[300px] animate-pulse">
              <Zap className="w-5 h-5 text-system-blue" />
              <p className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">{n.message}</p>
            </div>
          ))}
        </div>

        {/* Help Modal */}
        {showHelpModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/95 backdrop-blur-3xl transition-all duration-500 p-4">
            <div className="w-full max-w-4xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col p-10 max-h-[90vh]">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-system-blue/10 border border-system-blue/30 rounded-2xl flex items-center justify-center shadow-neon">
                    <MessageSquare className="w-8 h-8 text-system-blue" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold tracking-[0.4em] text-white uppercase">System <span className="text-system-blue">Guide</span></h2>
                    <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase mt-1">Player Instructions & Protocols</p>
                  </div>
                </div>
                <button onClick={() => setShowHelpModal(false)} className="p-3 hover:bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all group">
                  <X className="w-10 h-10 group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-10 overflow-y-auto pr-4 custom-scrollbar">
                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-system-blue font-bold tracking-widest uppercase mb-4 flex items-center">
                      <Zap className="w-4 h-4 mr-2" /> How to Level Up
                    </h3>
                    <ul className="space-y-4 text-[11px] text-white/70 tracking-wide leading-relaxed">
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 text-system-blue mr-2 shrink-0" />
                        <span><b className="text-white">DAILY QUESTS:</b> Stay active in the system. Gain 10 EXP every 5s automatically.</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 text-system-blue mr-2 shrink-0" />
                        <span><b className="text-white">MANUAL TRAINING:</b> Use "+ Gain EXP" button in title bar.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-system-blue font-bold tracking-widest uppercase mb-4 flex items-center">
                      <RefreshCcw className="w-4 h-4 mr-2" /> Daily Quests
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'System Activity', target: 'Stay Online', progress: 'In Progress' },
                        { name: 'SOLO HUNTER Presence', target: 'Discord RPC On', progress: discordRpcEnabled ? 'Completed' : 'Pending' },
                        { name: 'Style Mastery', target: 'Change Theme', progress: userSelectedRank ? 'Completed' : 'Pending' }
                      ].map((q, i) => (
                        <div key={i} className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5">
                          <div>
                            <p className="text-[9px] font-bold text-white uppercase">{q.name}</p>
                            <p className="text-[8px] text-white/30 uppercase tracking-tighter">{q.target}</p>
                          </div>
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${q.progress === 'Completed' ? 'bg-green-500/20 text-green-500' : 'bg-system-blue/20 text-system-blue animate-pulse'}`}>
                            {q.progress}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-system-blue font-bold tracking-widest uppercase mb-4 flex items-center">
                      <Eye className="w-4 h-4 mr-2" /> Theme Protocols
                    </h3>
                    <div className="space-y-2">
                      {RANKS.map(r => (
                        <div key={r.label} className="flex items-center justify-between text-[10px] py-2 border-b border-white/5">
                          <span className="font-bold" style={{ color: r.color }}>RANK {r.label}</span>
                          <span className="text-white/40 uppercase tracking-tighter">LV. {r.minLv}+</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-system-blue/5 border border-system-blue/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Zap className="w-24 h-24 text-system-blue fill-current" />
                    </div>
                    <h3 className="text-white font-bold tracking-widest uppercase mb-2">System Message</h3>
                    <p className="text-[10px] text-white/60 leading-relaxed italic">
                      "Every challenge is an opportunity to grow. The SOLO HUNTER does not wait for power; he takes it."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* EXP Bar - Top of Content */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-white/5 z-50">
          <div 
            className="h-full bg-system-blue shadow-neon transition-all duration-500" 
            style={{ width: `${(exp / maxExp) * 100}%` }}
          />
        </div>

        {/* Game Detail Loading Overlay */}
        {isGameDetailLoading && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-xl">
            <img
              src={systemLogoUrl}
              alt="System Logo"
              className="w-24 h-24 object-contain opacity-95 animate-pulse"
            />
          </div>
        )}

        {/* Game View Layer */}
        {activeGameView && (
          <div className="fixed inset-0 z-[60] overflow-hidden bg-[#0b0e14] animate-in fade-in duration-1000">
            
            {/* Exit Protocol - Top Left (Increased Z-Index) */}
            <button 
              onClick={() => {
                setActiveGameView(null);
                setIsGameDetailLoading(false);
              }}
              className="absolute top-10 left-10 z-[100] group flex items-center space-x-3 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white/50 hover:text-white transition-all shadow-2xl"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase">Return</span>
            </button>

            {/* High-Res Steam Hero Background */}
            {showTrailer && activeGameView.trailer ? (
              <div className="absolute inset-0 opacity-80 animate-in fade-in duration-1000 overflow-hidden">
                <iframe
                  src={`${activeGameView.trailer}&autoplay=1&muted=1&controls=0&loop=1`}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
                  style={{
                    width: '100vw',
                    height: '56.25vw',
                    minHeight: '100vh',
                    minWidth: '177.77vh',
                  }}
                  allow="autoplay; encrypted-media"
                />
              </div>
            ) : (
              <div className="absolute inset-0 overflow-hidden bg-[#0b0e14]">
                <img
                  src={activeGameBackground}
                  className="game-detail-bg-breathe h-full w-full object-cover"
                  alt="Game Background"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_58%,rgba(11,14,20,0.85),rgba(11,14,20,0.6)_35%,rgba(11,14,20,0.3)_58%,transparent_76%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/40 to-transparent" />

            {/* Game Content Container - Scrollable */}
            <div className="absolute inset-0 z-10 overflow-y-auto custom-scrollbar pt-28 pb-12 px-12">
              <div className="max-w-4xl space-y-8 animate-in slide-in-from-left-8 duration-700">
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 text-blue-400 text-[9px] font-bold tracking-[0.3em] uppercase rounded-sm">{activeGameView.id || '1245620'}</div>
                    <div className="px-3 py-1 bg-yellow-600/20 border border-yellow-600/50 text-yellow-500 text-[9px] font-bold tracking-[0.3em] uppercase rounded-sm">SteamDB Verified</div>
                    {hasDenuvoProtection && (
                      <div className="px-3 py-1 bg-red-600/20 border border-red-600/50 text-red-500 text-[9px] font-bold tracking-[0.3em] uppercase rounded-sm flex items-center">
                        <ShieldAlert className="w-3 h-3 mr-1.5" />
                        Denuvo Protected
                      </div>
                    )}
                  </div>
                  
                  <GameDetailTitleBlock game={activeGameView} />

                  {hasDenuvoProtection && (
                    <div className="max-w-md rounded-xl border border-red-500/45 bg-black/70 px-4 py-3 backdrop-blur-md shadow-[0_0_24px_rgba(239,68,68,0.22)]">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-md border border-red-500/50 bg-red-500/15 p-1.5">
                          <ShieldAlert className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.26em] text-red-400">Security Alert</p>
                          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/90">Denuvo Anti-Tamper Detected</p>
                          <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/50">This title uses anti-tamper protection.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-white/50 text-sm leading-relaxed tracking-wide font-medium max-w-2xl">
                    {activeGameView.desc || 'Shadow profile retrieved.'}
                  </p>
                </div>

                {/* DLC Selection Protocol */}
                {activeGameView.dlcs && (Array.isArray(activeGameView.dlcs) ? activeGameView.dlcs.length > 0 : Object.keys(activeGameView.dlcs).length > 0) && (
                  <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md max-w-3xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <Package className="w-4 h-4 text-system-blue" />
                        <h3 className="text-xs font-bold tracking-[0.3em] text-white uppercase">Shadow DLC Protocol</h3>
                        <button 
                          onClick={() => setShowDlcs(!showDlcs)}
                          className="ml-4 flex items-center space-x-2 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group/toggle"
                          title={showDlcs ? 'Hide DLCs' : 'Show DLCs'}
                        >
                          {showDlcs ? <EyeOff className="w-3 h-3 text-white/40 group-hover/toggle:text-system-blue" /> : <Eye className="w-3 h-3 text-white/40 group-hover/toggle:text-system-blue" />}
                          <span className="text-[9px] font-bold tracking-widest text-white/40 group-hover/toggle:text-white uppercase">
                            {showDlcs ? 'Hide' : 'Show'}
                          </span>
                        </button>
                      </div>
                      
                      {showDlcs && (
                        <button 
                          onClick={() => {
                            const allIds = Object.keys(activeGameView.dlcs);
                            if (selectedDlcs.size === allIds.length) {
                              setSelectedDlcs(new Set());
                            } else {
                              setSelectedDlcs(new Set(allIds.map(id => id.toString())));
                            }
                          }}
                          className="text-[9px] font-bold tracking-widest text-system-blue uppercase hover:text-white transition-colors border border-system-blue/30 px-3 py-1 rounded-full hover:bg-system-blue/10"
                        >
                          {selectedDlcs.size === (Array.isArray(activeGameView.dlcs) ? activeGameView.dlcs.length : Object.keys(activeGameView.dlcs).length) ? 'Deselect All' : 'Select All'}
                        </button>
                      )}
                    </div>
                    
                    {showDlcs && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 animate-in fade-in slide-in-from-top-4 duration-500">
                        {activeGameView.dlcs && Object.entries(activeGameView.dlcs).map(([key, value]) => {
                            const isArrayFormat = Array.isArray(activeGameView.dlcs);
                            const dlcId = isArrayFormat ? String(value) : String(key);
                            const dlcName = isArrayFormat ? String(value) : String(value);

                            return (
                              <label key={dlcId} className="group cursor-pointer">
                                <div
                                  onClick={() => {
                                    const next = new Set(selectedDlcs);
                                    if (next.has(dlcId)) next.delete(dlcId);
                                    else next.add(dlcId);
                                    setSelectedDlcs(next);
                                  }}
                                  className={`relative overflow-hidden rounded-xl border transition-all cursor-pointer ${selectedDlcs.has(dlcId) ? 'border-system-blue shadow-[0_0_15px_rgba(0,210,255,0.3)]' : 'border-white/10 group-hover:border-white/30 bg-black/40'}`}
                                >
                                  <div className="relative h-28 w-full overflow-hidden bg-black/50">
                                    <DlcImage dlcId={dlcId} gameId={activeGameView.id} />
                                    {selectedDlcs.has(dlcId) && <div className="absolute inset-0 bg-system-blue/20" />}
                                    {selectedDlcs.has(dlcId) && (
                                      <div className="absolute top-2 right-2 z-20 w-5 h-5 rounded-full bg-system-blue flex items-center justify-center shadow-lg border border-black/50">
                                        <span className="text-[10px] text-black font-extrabold">✓</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className={`p-2 text-center border-t border-white/5 transition-colors ${selectedDlcs.has(dlcId) ? 'bg-system-blue/10' : 'bg-black/20'}`}>
                                    <span className={`text-[9px] uppercase tracking-wider line-clamp-1 transition-colors ${selectedDlcs.has(dlcId) ? 'text-white font-bold' : 'text-white/40 group-hover:text-white/70'}`}>
                                      {dlcName}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            );
                          })
                        }
                      </div>
                    )}
                  </div>
                )}
                
                {/* COMING SOON Badge */}
                {comingSoon && (
                  <div className="max-w-3xl mb-6">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <span className="text-amber-400 text-lg">⏳</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold tracking-widest text-amber-400 uppercase">Coming Soon</h4>
                        <p className="text-[9px] text-white/40 uppercase tracking-wider">This title is awaiting system integration. Check back later.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SteamDB Style Info Grid */}
                <div className="grid grid-cols-3 gap-8 py-8 border-y border-white/5 max-w-3xl">
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Developer</p>
                    <p className="text-xs text-white/80 font-bold uppercase">{activeGameView.dev?.split(',')[0] || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Release Date</p>
                    <p className="text-xs text-white/80 font-bold uppercase">{activeGameView.date || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Status</p>
                    <p className={`text-xs font-bold uppercase ${comingSoon ? 'text-amber-400' : 'text-blue-400'}`}>
                      {comingSoon ? 'Coming Soon' : 'Ready'}
                    </p>
                  </div>
                </div>

                <div className={isExtracting ? 'max-w-md pb-12' : `grid max-w-md gap-3 pb-12 ${protocolPillCount <= 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {isExtracting ? (
                    <div className="col-span-full w-full max-w-md rounded-2xl border border-system-blue/30 bg-gradient-to-br from-[#0a1118]/90 via-[#0b141f]/85 to-[#090c14]/95 px-5 py-4 shadow-[0_0_24px_rgba(0,210,255,0.12)] backdrop-blur-xl">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-system-blue/35 bg-system-blue/10">
                            <Activity className="h-5 w-5 text-system-blue animate-pulse" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black tracking-[0.28em] text-system-blue uppercase">System Status</p>
                            <p className="mt-1 text-xs font-semibold tracking-[0.1em] text-white uppercase">
                              {extractionProgress >= 100 ? 'Protocol Complete' : 'Extraction in Progress'}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-right">
                          <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">Progress</p>
                          <p className="text-xl font-black leading-none text-system-blue">{extractionProgress}%</p>
                        </div>
                      </div>

                      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-system-blue via-cyan-300 to-system-blue shadow-[0_0_10px_rgba(0,210,255,0.45)] transition-all duration-500 ease-out"
                          style={{ width: `${extractionProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={handleAddGameProtocol}
                      disabled={injectionFailed}
                      className={`${protocolPillBase} h-14 ${
                        injectionFailed
                          ? 'border border-red-500/70 bg-red-950/25 text-red-400 animate-pulse'
                          : isInjected
                            ? 'border border-amber-500/55 bg-amber-950/20 text-amber-400 hover:border-amber-400/80 hover:bg-amber-500/15'
                            : 'border border-cyan-500/55 bg-slate-950/30 text-white/95 hover:border-cyan-400/80 hover:bg-cyan-500/15'
                      } disabled:opacity-60`}
                    >
                      {injectionFailed ? <ShieldAlert className="h-4 w-4 shrink-0" /> : isInjected ? <RefreshCcw className="h-4 w-4 shrink-0" /> : <Zap className="h-4 w-4 shrink-0" />}
                      <span className="text-xs font-bold">{gameActionLabel}</span>
                    </button>
                  )}

                  {!isExtracting && isInjected ? (
                    <button 
                      type="button"
                      onClick={handleRemoveGame}
                      disabled={isRemoving}
                      className={`${protocolPillBase} h-14 border border-red-700/55 bg-red-950/25 text-red-400/95 hover:border-red-500/80 hover:bg-red-950/35`}
                    >
                      <X className="h-4 w-4 shrink-0" />
                      <span className="text-xs font-bold">{isRemoving ? 'REMOVING…' : 'REMOVE SHADOW'}</span>
                    </button>
                  ) : null}

                  {isOnlineFixVisible && (
                    <>
                      <button 
                        type="button"
                        onClick={handleToggleOnlineFix}
                        className={`${protocolPillBase} h-14 ${
                          onlineFixEnabled
                            ? 'border border-green-500/55 bg-green-950/20 text-green-400 hover:border-green-400/80 hover:bg-green-500/15'
                            : 'border border-orange-500/55 bg-orange-950/20 text-orange-400 hover:border-orange-400/80 hover:bg-orange-500/15'
                        }`}
                      >
                        {onlineFixEnabled ? <Zap className="h-4 w-4 shrink-0" /> : <Zap className="h-4 w-4 shrink-0" />}
                        <span className="text-xs font-bold">{onlineFixEnabled ? 'DISABLE ONLINE' : 'ENABLE ONLINE'}</span>
                      </button>

                      {onlineFixEnabled && activeGameView?.onlineFixPath && (
                        <div className="col-span-2 px-4 py-3 border border-green-500/30 bg-green-950/10 rounded-lg">
                          <p className="text-[10px] text-green-400/70 font-mono uppercase tracking-wider mb-1">Online Files Location:</p>
                          <p className="text-xs text-green-300 font-mono break-all leading-relaxed">{activeGameView.onlineFixPath}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Floating Game Stats Decoration */}
            <div className="absolute top-10 right-10 flex flex-col items-end space-y-4 z-[70]">
              {/* System Status - Top Right */}
              <div className="text-right">
                <p className="text-[10px] text-yellow-500 font-bold tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">System Integration: Stable</p>
                <p className="text-[8px] text-white/20 font-mono uppercase tracking-tighter mt-1">ID: ST-{(level * 99).toString(16).toUpperCase()}</p>
              </div>

              <button 
                onClick={handleRestartSteam}
                className="group relative flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 h-10 w-10 hover:w-44 rounded-full transition-all duration-500 shadow-2xl hover:border-system-blue/50 overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                  <RefreshCw className="w-5 h-5 text-system-blue" />
                </div>
                <div className="flex items-center flex-row-reverse whitespace-nowrap px-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <RefreshCw className="w-5 h-5 text-system-blue rotate-180 transition-all duration-700 flex-shrink-0" />
                  <span className="mr-3 text-[10px] font-bold tracking-[0.2em] text-white/60 group-hover:text-system-blue uppercase transform translate-x-4 group-hover:translate-x-0 transition-transform duration-500">
                    Restart Steam
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Background Video/Image with Overlay */}
        {!isActivated ? (
          <video
            key={resolvedThemes['/themes/wallpaper.mp4'] || 'default-bg'}
            autoPlay
            muted
            loop
            className="absolute inset-0 z-0 w-full h-full object-cover grayscale opacity-30"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src={resolvedThemes['/themes/wallpaper.mp4'] || "/themes/wallpaper.mp4"}
          />
        ) : currentRank.wallpaper.endsWith('.mp4') ? (
          <video
            key={resolvedThemes[currentRank.wallpaper] || currentRank.wallpaper}
            autoPlay
            muted
            loop
            className="absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', filter: 'brightness(0.7)' }}
            src={resolvedThemes[currentRank.wallpaper] || currentRank.wallpaper}
          />
        ) : (
          <div 
            key={currentRank.wallpaper}
            className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${resolvedThemes[currentRank.wallpaper] || currentRank.wallpaper})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0.6)' 
            }}
          />
        )}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        
        {/* Header */}
        <header className="relative z-50 flex items-center justify-between px-12 py-6">
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-4">
              <img src={systemLogoUrl} alt="System Logo" className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_var(--system-color)] transition-all duration-1000" />
              <h1 className="text-2xl font-bold tracking-[0.2em] italic">SOLO <span className="block text-xs font-normal tracking-[0.5em] -mt-1 opacity-70">HUNTER</span></h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" onClick={(e) => { e.preventDefault(); if(isActivated) { setCurrentView('HOME'); setActiveGameView(null); } }} className={`nav-link ${isActivated && currentView === 'HOME' ? 'text-system-blue font-bold' : isActivated ? '' : 'opacity-20 cursor-not-allowed'}`}>Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); if(isActivated) { setCurrentView('MY_GAMES'); setActiveGameView(null); } }} className={`nav-link ${isActivated && currentView === 'MY_GAMES' ? 'text-system-blue font-bold' : isActivated ? '' : 'opacity-20 cursor-not-allowed'}`}>My Games</a>
              <a href="#" onClick={(e) => { e.preventDefault(); if(isActivated) addNotification('COMING SOON', 'info'); }} className={`nav-link ${isActivated ? '' : 'opacity-20 cursor-not-allowed'}`}>Denuvo Games</a>
              
              <a 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if(isActivated) { setCurrentView('ONLINE_FIX'); setActiveGameView(null); } 
                }} 
                className={`nav-link ${isActivated && currentView === 'ONLINE_FIX' ? 'text-system-blue font-bold' : isActivated ? '' : 'opacity-20 cursor-not-allowed'}`}
              >
                Online Fix
              </a>
              
              <a href="#" onClick={(e) => { e.preventDefault(); if(isActivated) setShowHelpModal(true); }} className={`nav-link ${isActivated ? '' : 'opacity-20 cursor-not-allowed'}`}>Help</a>
            </nav>
          </div>

          <div className="flex items-center space-x-8">
            {isActivated ? (
              <div className="flex items-center space-x-2 px-4 py-1.5 bg-system-blue/10 border border-system-blue/30 rounded-full">
                <div className="w-1.5 h-1.5 bg-system-blue rounded-full animate-pulse shadow-neon" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-system-blue uppercase">Activated</span>
              </div>
            ) : (
              <button 
                onClick={() => setShowActivationModal(true)}
                className="nav-link text-system-blue font-bold animate-pulse"
              >
                Sign Up
              </button>
            )}
            <div className={`relative group no-drag search-container ${!isActivated && 'opacity-20'}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-system-blue transition-colors" />
              <input 
                type="text" 
                placeholder="Search here..." 
                disabled={!isActivated}
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-system-blue/50 focus:bg-white/10 transition-all w-48 no-drag disabled:cursor-not-allowed"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />

              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 right-0 w-[400px] bg-[#1a1d26] border border-white/10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[1000] animate-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
                  <div className="p-3 border-b border-white/5 bg-black/40">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Search results</p>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-black/20">
                    {suggestions.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => handleSelectSuggestion(game)}
                        className="w-full flex items-center space-x-4 p-3 hover:bg-white/5 transition-colors text-left group border-b border-white/5 last:border-0"
                      >
                        <div className="relative">
                          <img 
                            src={game.tiny_image} 
                            alt="" 
                            className="w-24 h-11 object-fill rounded shadow-lg border border-white/10 group-hover:border-system-blue/50 transition-colors"
                          />
                          {/* Coming Soon Badge */}
                          {game.comingSoon && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded">
                              <span className="text-[7px] font-bold text-amber-400 uppercase tracking-wider">Soon</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate group-hover:text-system-blue transition-colors uppercase tracking-tight">{game.name}</p>
                        </div>
                        {/* Coming Soon Tag */}
                        {game.comingSoon && (
                          <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-[8px] font-bold text-amber-400 uppercase tracking-wider">
                            Soon
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        {currentView === 'HOME' ? (
          <main className={`relative z-10 flex h-[calc(100vh-120px)] px-12 pb-12 home-main transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
            isTransitioning 
              ? `opacity-0 blur-md ${contentAlignment === 'left' ? 'translate-x-20' : '-translate-x-20'}` 
              : 'opacity-100 blur-0 translate-x-0'
          } ${contentAlignment === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Left Section: Character Info */}
            {!isActivated ? (
              <div className={`flex-1 flex flex-col justify-center max-w-xl ${contentAlignment === 'right' ? 'items-end text-right ml-auto' : 'items-start text-left'}`}>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-black italic text-white/20 mr-2">?</span>
                  <span className="text-white/20 tracking-[0.3em] uppercase text-xs font-bold">STATUS: RESTRICTED</span>
                </div>
                <div className="mb-8">
                  <h2 className="text-7xl font-bold tracking-tight uppercase mb-4 opacity-20">SYSTEM LOCKED</h2>
                  <p className="text-white/30 leading-relaxed tracking-wide text-sm max-w-md">
                    Please use the "Sign Up" protocol to authenticate your access to the SOLO HUNTER System. Enter your unique activation key to unlock the full potential of the interface.
                  </p>
                </div>
              </div>
            ) : (
              <div className={`flex-1 flex flex-col justify-center max-w-xl ${contentAlignment === 'right' ? 'items-end text-right ml-auto' : 'items-start text-left'}`}>
                <div className="flex items-baseline mb-4">
                  <span className="rank-badge !text-system-blue transition-colors duration-300">{currentRank.label}</span>
                  <span className="text-white/50 tracking-[0.3em] uppercase text-xs font-bold">RANK</span>
                </div>
                
                <div className="mb-8">
                  <p className={`text-white/40 tracking-[0.5em] uppercase text-[10px] font-bold mb-3 border-system-blue transition-all duration-300 ${contentAlignment === 'right' ? 'border-r-2 pr-3' : 'border-l-2 pl-3'}`}>{currentRank.character.title}</p>
                  <h2 className="character-info-title transition-all duration-300">{currentRank.character.name}</h2>
                  <h3 className="character-info-subname transition-all duration-300">{currentRank.character.subName}</h3>
                </div>

                <p className="text-white/70 leading-relaxed tracking-wide text-sm max-w-md">
                  {currentRank.character.desc}
                </p>
                <div className="mt-6 flex items-center space-x-6">
                  <div className="px-4 py-1 border border-system-blue/30 bg-system-blue/5 rounded text-[10px] font-bold tracking-widest text-system-blue uppercase">
                    LV. {level}
                  </div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">
                    System Status: Online
                  </div>
                </div>
              </div>
            )}

            {/* Right Section: Sidebar Menu */}
            <div className={`flex flex-col items-end justify-center ${contentAlignment === 'right' ? 'mr-auto items-start' : 'ml-auto items-end'} ${!isActivated && 'opacity-20 pointer-events-none'}`}>
              <div className={`${contentAlignment === 'right' ? 'text-left' : 'text-right'} mb-8`}>
                <h2 className="text-3xl font-bold tracking-[0.2em] uppercase text-white/90">ABOUT</h2>
              </div>
              <nav className={`flex flex-col space-y-2 ${contentAlignment === 'right' ? 'items-start' : 'items-end'}`}>
                {[
                  { label: 'PROFILE', action: () => setShowProfileModal(true) },
                  { label: 'THEMES', action: () => setShowThemeModal(true) },
                  { label: 'SETTINGS', action: () => setShowSettingsModal(true) },
                  { label: 'RESTART STEAM', action: () => handleRestartSteam() },
                  { label: 'LOGOUT', action: () => handleLogout(), isLogout: true }
                ].map((item, idx) => (
                  <a 
                    key={idx} 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.action) item.action();
                    }}
                    className={`sidebar-item group pr-0 ${item.isLogout ? 'logout-item' : ''}`}
                  >
                    <span className={`text-xs font-bold tracking-[0.3em] uppercase ${item.isLogout ? 'text-red-500/70 group-hover:text-red-500' : ''}`}>{item.label}</span>
                    <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 -mr-2 transition-all ${item.isLogout ? 'text-red-500' : 'text-system-blue'}`} />
                  </a>
                ))}
              </nav>
            </div>
          </main>
        ) : currentView === 'MY_GAMES' ? (
          /* MY GAMES VIEW */
          <main className="relative z-10 flex flex-col h-[calc(100vh-120px)] px-12 pb-12 overflow-y-auto animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold tracking-[0.2em] text-white uppercase italic">MY <span className="text-system-blue">GAMES</span></h2>
                <p className="text-[10px] text-white/40 tracking-[0.5em] uppercase mt-2">Shadow Army: {myGames.length} Profiles Indexed</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={fetchMyGames}
                  disabled={isLoadingMyGames}
                  className="flex items-center space-x-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all active:scale-95 disabled:opacity-50"
                >
                  <RefreshCcw className={`w-3 h-3 text-system-blue ${isLoadingMyGames ? 'animate-spin' : ''}`} />
                  <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">Refresh</span>
                </button>
                <button 
                  onClick={handleRestartSteam}
                  className="flex items-center space-x-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all active:scale-95 group"
                >
                  <RefreshCw className="w-3 h-3 text-system-blue group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">Restart Steam</span>
                </button>
                <div className="px-4 py-1.5 bg-system-blue/10 border border-system-blue/30 rounded-full">
                  <span className="text-[10px] font-bold tracking-widest text-system-blue uppercase">Status: Online</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
              {isLoadingMyGames ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <RefreshCcw className="w-12 h-12 text-system-blue animate-spin" />
                  <p className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">Synchronizing with Shadow Realm...</p>
                </div>
              ) : myGames.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {myGames.map((game) => (
                    <div
                      key={game.id}
                      className="group relative bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-system-blue/50 transition-all hover:scale-[1.02] hover:shadow-neon h-full flex flex-col"
                    >
                      {/* Delete Button Overlay */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveGameById(game.id, game.name);
                        }}
                        disabled={isRemoving && removingId === game.id}
                        className="absolute top-2 left-2 z-30 p-1.5 bg-black/60 hover:bg-red-600 border border-white/10 rounded-lg text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove Shadow"
                      >
                        {isRemoving && removingId === game.id ? (
                          <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <div 
                        className="relative w-full h-32 bg-gray-900 overflow-hidden flex items-center justify-center border-b border-white/5 cursor-pointer"
                        onClick={() => handleSelectSuggestion(game)}
                      >
                        {/* Shadow Placeholder (Visible if image fails) */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900">
                          <Zap className="w-10 h-10 text-system-blue/40 mb-2 animate-pulse" />
                          <span className="text-[9px] font-mono tracking-[0.2em] text-system-blue/60 uppercase">Shadow Profile</span>
                          <span className="text-[7px] font-mono tracking-widest text-white/20 mt-1">DATA_PENDING_{game.id}</span>
                        </div>
                        
                        <img 
                          src={game.header_image} 
                          alt={game.name}
                          className="relative z-10 w-full h-full object-fill opacity-0 transition-opacity duration-700"
                          onLoad={(e) => {
                            e.target.classList.remove('opacity-0');
                            e.target.classList.add('opacity-100');
                          }}
                          onError={(e) => {
                            const fallbacks = [
                              game.capsule_image,
                              game.library_image,
                              `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.id}/header.jpg`,
                              `https://steamcdn-a.akamaihd.net/steam/apps/${game.id}/library_600x900_2x.jpg`
                            ];
                            
                            let currentFallbackIdx = parseInt(e.target.getAttribute('data-fallback-idx') || 0);

                            if (currentFallbackIdx < fallbacks.length) {
                              e.target.setAttribute('data-fallback-idx', currentFallbackIdx + 1);
                              e.target.src = fallbacks[currentFallbackIdx];
                            } else {
                              // If all fail, hide the image and show placeholder
                              e.target.style.opacity = '0';
                              e.target.style.pointerEvents = 'none';
                            }
                          }}
                        />
                        
                        {/* Status Overlay */}
                        <div className="absolute top-2 right-2 z-20">
                          <div className={`w-1.5 h-1.5 rounded-full ${game.type === 'added' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'} animate-pulse`} />
                        </div>
                        
                        {/* Coming Soon Overlay */}
                        {game.comingSoon && (
                          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
                            <div className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded-full">
                              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Coming Soon</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div 
                        className="p-4 bg-gradient-to-t from-black to-transparent flex-1 flex flex-col justify-between relative cursor-pointer"
                        onClick={() => handleSelectSuggestion(game)}
                      >
                        {/* Scanning effect for unknown games */}
                        {game.name.includes('Unknown') && (
                          <div className="absolute inset-x-0 top-0 h-[1px] bg-system-blue/50 animate-scan shadow-[0_0_10px_var(--system-color)]" />
                        )}
                        
                        <p className={`text-sm font-bold uppercase tracking-tighter truncate mb-2 ${game.name.includes('Unknown') ? 'text-white/40 italic' : 'text-white'}`}>
                          {game.name.includes('Unknown') ? 'DECRYPTING PROFILE...' : game.name}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${game.type === 'added' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'} uppercase tracking-widest`}>
                            {game.type === 'added' ? 'Arise Protocol' : 'Steam Protocol'}
                          </span>
                          <span className="text-[8px] text-white/20 font-mono italic">{game.id}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <ShieldAlert className="w-20 h-20 text-white/10" />
                  <div>
                    <h3 className="text-xl font-bold text-white/40 uppercase tracking-widest">No Shadows Extracted</h3>
                    <p className="text-sm text-white/20 mt-2">Your army is empty. Search for games and use the "Add Game" protocol to begin.</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        ) : currentView === 'ONLINE_FIX' ? (
          /* INSTALLED GAMES VIEW */
          <main className="relative z-10 flex flex-col h-[calc(100vh-120px)] px-12 pb-12 overflow-y-auto animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold tracking-[0.2em] text-white uppercase italic">ONLINE <span className="text-system-blue">FIX</span></h2>
                <p className="text-[10px] text-white/40 tracking-[0.5em] uppercase mt-2">Online Fix Candidates: {onlineGames.filter(game => game.online_fix).length} Profiles Indexed</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={fetchOnlineGames}
                  className="px-4 py-2 bg-system-blue/20 hover:bg-system-blue/30 border border-system-blue/50 rounded-lg text-system-blue font-bold tracking-widest uppercase text-xs transition-all hover:shadow-neon"
                >
                  Refresh
                </button>
              </div>
            </div>
            
            {isLoadingOnlineGames ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-6">
                <div className="w-12 h-12 border-4 border-system-blue/30 border-t-system-blue rounded-full animate-spin"></div>
                <div>
                  <h3 className="text-xl font-bold text-white/60 uppercase tracking-widest">Scanning Steam Libraries</h3>
                  <p className="text-sm text-white/40 mt-2">Detecting installed games...</p>
                </div>
              </div>
            ) : onlineGames.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {onlineGames.map((game) => (
                  <div 
                    key={game.id}
                    className="relative w-full flex items-center space-x-3 p-3 hover:bg-white/5 transition-colors text-left group border-b border-white/5 last:border-0"
                  >
                    <div 
                      className="flex-1 flex items-center space-x-4 min-w-0 cursor-pointer"
                      onClick={() => setActiveGameView(game)}
                    >
                      <div className="relative">
                        <img 
                          src={game.header_image} 
                          alt="" 
                          className="w-24 h-11 object-fill rounded shadow-lg border border-white/10 group-hover:border-system-blue/50 transition-colors"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate group-hover:text-system-blue transition-colors uppercase tracking-tight">{game.name}</p>
                      </div>
                      <span className="text-[8px] text-white/20 font-mono italic">{game.id}</span>
                    </div>

                    <button
                      onClick={(e) => handleToggleOnlineFixDirect(game, e)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                        game.online_fix
                          ? 'border border-green-500/55 bg-green-950/20 text-green-400 hover:border-green-400/80 hover:bg-green-500/15'
                          : 'border border-orange-500/55 bg-orange-950/20 text-orange-400 hover:border-orange-400/80 hover:bg-orange-500/15'
                      }`}
                    >
                      <Zap className="inline-block w-3 h-3 mr-1" />
                      {game.online_fix ? 'DISABLE ONLINE' : 'ENABLE ONLINE'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <ShieldAlert className="w-20 h-20 text-white/10" />
                <div>
                  <h3 className="text-xl font-bold text-white/40 uppercase tracking-widest">No Installed Games Found</h3>
                  <p className="text-sm text-white/20 mt-2">No Steam games detected. Make sure Steam is installed and games are installed.</p>
                </div>
              </div>
            )}
          </main>
        ) : null}

        {/* Activation Modal */}
        {showActivationModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/95 backdrop-blur-2xl transition-all duration-500 p-4">
            <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-system-blue/10 border border-system-blue/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-neon">
                  <Zap className="w-8 h-8 text-system-blue fill-current" />
                </div>
                <h2 className="text-2xl font-bold tracking-[0.4em] text-white uppercase">System Activation</h2>
                <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase mt-2">Enter your unique SOLO HUNTER Key</p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="XXXX-XXXX-XXXX" 
                    className={`w-full bg-white/5 border ${activationError || deviceMismatchError ? 'border-red-500' : 'border-white/10 group-focus-within:border-system-blue/50'} rounded-xl py-4 px-6 text-center text-xl font-mono tracking-[0.3em] uppercase transition-all outline-none`}
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
                  />
                  {activationError && (
                    <p className="absolute -bottom-6 left-0 w-full text-center text-[10px] text-red-500 font-bold uppercase tracking-widest animate-bounce">
                      Invalid Activation Key
                    </p>
                  )}
                  {deviceMismatchError && (
                    <p className="absolute -bottom-6 left-0 w-full text-center text-[10px] text-red-500 font-bold uppercase tracking-widest animate-bounce">
                      Key Already In Use On Another Device
                    </p>
                  )}
                </div>

                <button 
                  onClick={handleActivate}
                  className="w-full py-4 bg-system-blue text-black font-bold tracking-[0.4em] uppercase rounded-xl hover:shadow-neon transition-all active:scale-95"
                >
                  Authenticate
                </button>

                <button 
                  onClick={() => setShowActivationModal(false)}
                  className="w-full py-2 text-[10px] text-white/20 hover:text-white/50 font-bold tracking-[0.2em] uppercase transition-all"
                >
                  Return to Shadow State
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-[9px] text-white/20 uppercase tracking-widest leading-relaxed">
                  Only authorized players can access the system.<br/>Contact the Developer for your access key.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Theme Selection Modal */}
        {showThemeModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl transition-all duration-500 p-4">
            <div className="w-full max-w-5xl bg-black/40 border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div>
                  <h2 className="text-2xl font-bold tracking-[0.4em] text-system-blue uppercase">System Themes</h2>
                  <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase mt-1">Select a theme based on your current Rank status</p>
                </div>
                <button 
                  onClick={() => setShowThemeModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Themes Grid */}
              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-6 custom-scrollbar">
                {RANKS.map((rank) => {
                  // Lock themes based on actual level
                  const isActuallyUnlocked = level >= rank.minLv;
                  const isSelected = currentRank.label === rank.label;
                  
                  return (
                    <div 
                      key={rank.label}
                      className={`group relative rounded-xl border-2 transition-all duration-500 overflow-hidden flex flex-col h-48 ${
                        isSelected ? 'border-system-blue shadow-neon' : 'border-white/5 hover:border-white/20'
                      } ${!isActuallyUnlocked ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                    >
                      {/* Theme Preview Background */}
                      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
                        {rank.wallpaper.endsWith('.mp4') ? (
                          <video muted loop className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity duration-500">
                            <source src={resolvedThemes[rank.wallpaper] || rank.wallpaper} type="video/mp4" />
                          </video>
                        ) : (
                          <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 group-hover:opacity-80 transition-opacity duration-500" style={{ backgroundImage: `url(${resolvedThemes[rank.wallpaper] || rank.wallpaper})` }} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                      </div>

                      {/* Content Overlaid on Background */}
                      <div className="relative z-10 p-6 flex-1 flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-baseline mb-2">
                            <span className="text-5xl font-black italic mr-3" style={{ color: rank.color, textShadow: `0 0 20px ${rank.color}` }}>{rank.label}</span>
                            <span className="text-[10px] font-bold text-white/50 tracking-widest uppercase">RANK</span>
                          </div>
                          <h3 className="text-sm font-bold tracking-[0.2em] text-white/90 uppercase">Protocol {rank.label}</h3>
                          <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Status: {isActuallyUnlocked ? 'Available' : 'Restricted'}</p>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          {isActuallyUnlocked ? (
                            <button
                              onClick={() => handleDeployTheme(rank)}
                              disabled={isDeploying}
                              className={`px-8 py-2.5 rounded-lg text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-system-blue text-black shadow-neon ring-2 ring-system-blue/50' 
                                  : 'bg-white/10 text-white hover:bg-system-blue hover:text-black hover:shadow-neon'
                              } ${isDeploying ? 'opacity-50 cursor-wait' : ''}`}
                            >
                              {isDeploying && isSelected ? 'Deploying...' : (isSelected ? 'Active' : 'Deploy')}
                            </button>
                          ) : (
                            <div className="bg-red-500/20 border border-red-500/50 px-4 py-2 rounded-lg flex flex-col items-center backdrop-blur-sm">
                              <ShieldAlert className="w-4 h-4 text-red-500 mb-1" />
                              <span className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em]">Locked</span>
                              <span className="text-[8px] text-white/70 uppercase mt-1 tracking-tighter font-mono">LV. {rank.minLv}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-black/60 flex justify-center">
                <button 
                  onClick={() => {
                    setUserSelectedRank(null);
                    setShowThemeModal(false);
                  }}
                  className="px-12 py-3 border border-white/10 rounded-lg text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-white/5 transition-all text-white/30 hover:text-white"
                >
                  Reset to Auto-System
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile/Status Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-3xl transition-all duration-500 p-4">
            <div className="w-full max-w-4xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col p-10">
              {/* Animated Background Decor */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-system-blue/10 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-system-blue/10 rounded-full blur-[100px] animate-pulse" />
              
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-12 relative z-10">
                <div className="flex items-center space-x-8">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-2xl border-2 border-system-blue shadow-neon-heavy flex items-center justify-center bg-black overflow-hidden group">
                      <img src={systemLogoUrl} className="w-16 h-16 opacity-90 group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-system-blue/40 via-transparent to-transparent opacity-50" />
                    </div>
                    <div className="absolute -bottom-3 -right-3 px-4 py-1 bg-system-blue text-black font-black italic text-sm rounded-lg shadow-neon rotate-12">
                      RANK {currentRank.label}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-5xl font-bold tracking-[0.3em] text-white uppercase mb-2">SOLO HUNTER <span className="text-system-blue italic">PLAYER</span></h2>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <div className="w-2 h-2 bg-system-blue rounded-full animate-ping" />
                        <span className="text-[10px] text-white/60 font-bold tracking-widest uppercase">System Online</span>
                      </div>
                      <span className="text-[10px] text-white/20 tracking-widest uppercase">ID: ID-{(level * 1234).toString(16).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="p-3 hover:bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all group"
                >
                  <X className="w-10 h-10 group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-12 gap-10 relative z-10">
                {/* Left Stats */}
                <div className="col-span-5 flex flex-col justify-center">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-system-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <label className="text-[10px] text-white/30 tracking-[0.4em] uppercase font-bold block mb-2">Level Progress</label>
                          <span className="text-6xl font-black text-white leading-none tracking-tighter">LV. {level}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-system-blue tracking-widest uppercase">{Math.floor((exp / maxExp) * 100)}%</span>
                          <p className="text-[10px] text-white/30 uppercase mt-1 font-mono">{exp} / {maxExp} EXP</p>
                        </div>
                      </div>
                      <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden p-1 border border-white/10 shadow-inner">
                        <div className="h-full bg-system-blue shadow-neon transition-all duration-1000 rounded-full" style={{ width: `${(exp / maxExp) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Security & Protocol */}
                <div className="col-span-7 space-y-6">
                  <div className="bg-gradient-to-br from-system-blue/10 to-transparent border border-system-blue/20 rounded-2xl p-8 relative overflow-hidden group h-full flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Zap className="w-40 h-40 text-system-blue fill-current" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="w-1 h-8 bg-system-blue shadow-neon" />
                        <h3 className="text-xl font-bold tracking-[0.4em] text-white uppercase">Security Protocol</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <div>
                            <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] block mb-2">Monarch Access Key</span>
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl font-mono tracking-[0.1em] text-system-blue font-black bg-system-blue/5 px-4 py-2 rounded-lg border border-system-blue/10 shadow-[0_0_15px_rgba(0,210,255,0.1)]">
                                {activeCode ? `${activeCode.split('-')[0]}-****` : 'ARISE-****'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] block mb-2">Protocol Status</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
                              <span className="text-sm font-bold text-green-500 uppercase tracking-widest">Authorized Access</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6 border-l border-white/5 pl-10">
                          <div>
                            <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] block mb-2">Current Theme</span>
                            <span className="text-lg font-bold text-white uppercase tracking-widest block">{currentRank.character.name}</span>
                            <span className="text-[9px] text-white/20 uppercase tracking-tighter italic">Protocol Version {currentRank.label}.0.4</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] block mb-2">Last Sync</span>
                            <span className="text-xs font-mono text-white/50 tracking-widest uppercase">{new Date().toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quote */}
              <div className="mt-12 text-center relative z-10">
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto mb-6" />
                <p className="text-[9px] italic tracking-[0.8em] uppercase text-white/20 animate-pulse">"THE SYSTEM WILL ALWAYS BE WITH YOU"</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/95 backdrop-blur-3xl transition-all duration-500 p-4">
            <div className="w-full max-w-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col p-10">
              {/* Background Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-system-blue/10 blur-[120px] -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-system-blue/5 blur-[120px] -ml-32 -mb-32" />

              {/* Header */}
              <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-neon relative group">
                    <Settings2 className="w-8 h-8 text-system-blue group-hover:rotate-90 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-system-blue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold tracking-[0.4em] text-white uppercase">System <span className="text-system-blue">Config</span></h2>
                    <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase mt-1">Adjust SOLO HUNTER parameters</p>
              </div>
            </div>
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="p-3 hover:bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all group"
            >
              <X className="w-10 h-10 group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-2 gap-6 relative z-10">
                {/* Left Column: Toggles */}
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-system-blue" />
                        <h3 className="text-sm font-bold tracking-widest text-white uppercase">Auto-EXP</h3>
                      </div>
                      <button 
                        onClick={() => setAutoExpEnabled(!autoExpEnabled)}
                        className={`w-12 h-6 rounded-full transition-all duration-500 relative ${autoExpEnabled ? 'bg-system-blue' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${autoExpEnabled ? 'left-7 shadow-[0_0_10px_white]' : 'left-1 opacity-20'}`} />
                      </button>
                    </div>
                    <p className="text-[9px] text-white/30 uppercase tracking-tighter leading-relaxed">Gain experience automatically while active</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <DiscordIcon className="w-5 h-5 text-system-blue" />
                        <h3 className="text-sm font-bold tracking-widest text-white uppercase">Discord RPC</h3>
                      </div>
                      <button 
                        onClick={() => setDiscordRpcEnabled(!discordRpcEnabled)}
                        className={`w-12 h-6 rounded-full transition-all duration-500 relative ${discordRpcEnabled ? 'bg-system-blue' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${discordRpcEnabled ? 'left-7 shadow-[0_0_10px_white]' : 'left-1 opacity-20'}`} />
                      </button>
                    </div>
                    <p className="text-[9px] text-white/30 uppercase tracking-tighter leading-relaxed">Show your Rank and Level on Discord profile</p>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <RefreshCcw className="w-5 h-5 text-system-blue" />
                        <h3 className="text-sm font-bold tracking-widest text-white uppercase">Alignment</h3>
                      </div>
                      <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                        <button 
                          onClick={() => changeAlignment('left')}
                          className={`px-3 py-1 text-[8px] font-bold tracking-widest uppercase rounded transition-all ${contentAlignment === 'left' ? 'bg-system-blue text-black shadow-neon' : 'text-white/40 hover:text-white'}`}
                        >
                          Left
                        </button>
                        <button 
                          onClick={() => changeAlignment('right')}
                          className={`px-3 py-1 text-[8px] font-bold tracking-widest uppercase rounded transition-all ${contentAlignment === 'right' ? 'bg-system-blue text-black shadow-neon' : 'text-white/40 hover:text-white'}`}
                        >
                          Right
                        </button>
                      </div>
                    </div>
                    <p className="text-[9px] text-white/30 uppercase tracking-tighter leading-relaxed">Switch main content to Left or Right side</p>
                  </div>
                </div>

                {/* Right Column: Sliders & Actions */}
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                    <div className="justify-between items-center mb-4">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5 text-system-blue" />
                        <h3 className="text-sm font-bold tracking-widest text-white uppercase">Opacity</h3>
                      </div>
                      <span className="text-xs font-mono text-system-blue font-bold">{uiTransparency}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={uiTransparency}
                      onChange={(e) => setUiTransparency(e.target.value)}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-system-blue"
                    />
                  </div>

                  {/* License Key Generator - Developer Only (ARISE-2026) */}
                  {activeCode === 'ARISE-2026' && (
                    <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-6 hover:bg-green-500/10 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Key className="w-5 h-5 text-green-500" />
                          <h3 className="text-sm font-bold tracking-widest text-green-500 uppercase">License Keys</h3>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <button 
                          onClick={async () => {
                            try {
                              const result = await window.electronAPI.generateKey()
                              if (result.success) {
                                setGeneratedKey(result.key)
                                addNotification(`NEW KEY GENERATED: ${result.key}`, 'success')
                              } else {
                                addNotification('KEY GENERATION FAILED', 'error')
                              }
                            } catch (error) {
                              addNotification('ERROR GENERATING KEY', 'error')
                            }
                          }}
                          className="w-full py-3 border border-green-500/20 text-green-500 text-[9px] font-bold tracking-[0.3em] uppercase rounded-xl hover:bg-green-500 hover:text-black transition-all flex items-center justify-center space-x-2"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Generate New Key</span>
                        </button>
                        
                        {generatedKey && (
                          <div className="mt-3 p-3 bg-black/40 rounded-lg border border-green-500/20">
                            <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Generated Key:</p>
                            <p className="text-sm font-mono text-green-400 tracking-wider">{generatedKey}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-6 hover:bg-yellow-500/10 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-sm font-bold tracking-widest text-yellow-500 uppercase">Update Cache</h3>
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        try {
                          const result = await window.electronAPI.clearUpdateCache();
                          if (result.success) {
                            addNotification('UPDATE CACHE CLEARED SUCCESSFULLY', 'success');
                          } else {
                            addNotification(`CACHE CLEAR FAILED: ${result.error}`, 'error');
                          }
                        } catch (error) {
                          addNotification('ERROR CLEARING CACHE', 'error');
                        }
                      }}
                      className="w-full py-3 border border-yellow-500/20 text-yellow-500 text-[9px] font-bold tracking-[0.3em] uppercase rounded-xl hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center space-x-2"
                    >
                      <RefreshCcw className="w-3 h-3" />
                      <span>Clear Update Cache</span>
                    </button>
                  </div>

                  <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 hover:bg-red-500/10 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <h3 className="text-sm font-bold tracking-widest text-red-500 uppercase">Emergency Reset</h3>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setShowConfirmModal({
                          show: true,
                          message: 'ARE YOU SURE? THIS WILL RESET ALL PROGRESS AND LOCAL STORAGE.',
                          onConfirm: () => {
                            localStorage.clear();
                            window.location.reload();
                          }
                        })
                      }}
                      className="w-full py-3 border border-red-500/20 text-red-500 text-[9px] font-bold tracking-[0.3em] uppercase rounded-xl hover:bg-red-500 hover:text-black transition-all flex items-center justify-center space-x-2"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Full System Wipe</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal.show && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <div className="w-full max-w-md bg-black border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
                <h2 className="text-xl font-bold tracking-widest text-white uppercase">Confirm Protocol</h2>
                <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase mt-4 leading-relaxed">
                  {showConfirmModal.message}
                </p>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowConfirmModal({ show: false, message: '', onConfirm: null })}
                  className="flex-1 py-3 bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={showConfirmModal.onConfirm}
                  className="flex-1 py-3 bg-red-500 text-white text-[10px] font-bold tracking-widest uppercase rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="pointer-events-none fixed left-1/2 bottom-4 z-[110] -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-white/70 shadow-[0_0_12px_rgba(0,0,0,0.25)] backdrop-blur-sm">
          PROTOCOL v{appVersion}
        </div>
      </div>
    </div>
  )
}

export default App
