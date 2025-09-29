'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Particles from 'react-particles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'

interface Stage {
  id: string;
  entreprise: string;
  poste: string;
  periode: string;
  lieu: string;
  description: string;
  technologies: string[];
  missions: string[];
  achievements?: string[];
  competences: string[];
  image: string;
  video?: string;
  couleur: string;
  icone: string;
  niveau: 'junior' | 'intermediaire' | 'avance' | 'expert';
  outils?: string[];
  tags?: string[];
  imageRatio?: 'wide' | 'square';
  details?: string[];
}

export default function ProfessionalExperiencePage() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [activeNav, setActiveNav] = useState('experience')
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [activeFilter, setActiveFilter] = useState('all')
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [isHoveringClickable, setIsHoveringClickable] = useState(false)
  const [isCursorVisible, setIsCursorVisible] = useState(true)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const cursorRef = useRef<HTMLDivElement>(null)

  const setVideoRef = (id: string) => (el: HTMLVideoElement | null) => {
    videoRefs.current[id] = el
  }

  // Fonction startVideo améliorée
  const startVideo = (id: string) => {
    setIsCursorVisible(false)
    
    if (playingVideo && playingVideo !== id) {
      const currentVideo = videoRefs.current[playingVideo]
      if (currentVideo) {
        currentVideo.pause()
        currentVideo.currentTime = 0
        currentVideo.controls = false
      }
    }
    
    setPlayingVideo(id)
    const video = videoRefs.current[id]
    if (video) {
      video.controls = true
      setTimeout(() => {
        video.play().catch(error => {
          console.log('Erreur de lecture vidéo:', error)
          setIsCursorVisible(true)
        })
      }, 50)
    }
  }

  // Arrêter la vidéo et réafficher le curseur
  const stopVideo = (id: string) => {
    const video = videoRefs.current[id]
    if (video) {
      video.pause()
      video.currentTime = 0
      video.controls = false
    }
    setPlayingVideo(null)
    setIsCursorVisible(true)
  }

  // Gestion optimisée du curseur - CORRIGÉE
  useEffect(() => {
    let animationFrameId: number
    let lastX = 0
    let lastY = 0
    const sensitivity = 1

    const handleMouseMove = (e: MouseEvent) => {
      if (!isCursorVisible) return
      
      cancelAnimationFrame(animationFrameId)
      
      animationFrameId = requestAnimationFrame(() => {
        const deltaX = Math.abs(e.clientX - lastX)
        const deltaY = Math.abs(e.clientY - lastY)
        
        if (deltaX > sensitivity || deltaY > sensitivity) {
          setCursorPosition({ 
            x: Math.max(10, Math.min(window.innerWidth - 10, e.clientX)),
            y: Math.max(10, Math.min(window.innerHeight - 10, e.clientY))
          })
          lastX = e.clientX
          lastY = e.clientY
        }
      })
    }

    const handleMouseOver = (e: MouseEvent) => {
      if (!isCursorVisible) return
      
      const target = e.target as HTMLElement
      const isClickable = target.tagName === 'BUTTON' || 
                         target.tagName === 'A' || 
                         target.closest('button') !== null || 
                         target.closest('a') !== null ||
                         target.closest('.video-container') !== null
      
      setIsHoveringClickable(isClickable)
    }

    const handleMouseOut = () => {
      if (!isCursorVisible) return
      setIsHoveringClickable(false)
    }

    // Détecter si la souris est sur une vidéo
    const handleVideoHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('video') !== null || target.closest('.video-controls') !== null) {
        setIsCursorVisible(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })
    document.addEventListener('mousemove', handleVideoHover, { passive: true })

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mousemove', handleVideoHover)
    }
  }, [isCursorVisible])

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(async () => {}, [])

  const navItems = [
    { name: 'Neural Entrance', id: 'home', path: '/' },
    { name: 'Data Mind', id: 'about', path: '/DataMind' },
    { name: 'Project Gallery', id: 'projects', path: '/Projects' },
    { name: 'Professional Experience', id: 'experience', path: '/experience' },
    { name: 'Neural Skills', id: 'skills', path: '/competences' },
    { name: 'Future Predictions', id: 'predictions', path: '/predictions' },
    { name: 'Contact', id: 'contact', path: '/contact' }
  ]

  const filters = [
    { id: 'all', label: 'Tous les stages' },
    { id: 'ia', label: 'Intelligence Artificielle' },
    { id: 'web', label: 'Développement Web' },
    { id: 'mobile', label: 'Développement Mobile' }
  ]

  const stages: Stage[] = [
    {
      id: 'stage1',
      entreprise: 'BaridVision',
      poste: 'Stagiaire Data Scientist – IA',
      periode: 'Juin 2025 – Septembre 2025',
      lieu: 'BaridVision, Tunisie',
      description: 'Système de vision par ordinateur pour centres de tri postaux',
      technologies: ['YOLOv8', 'ByteTrack', 'ConvNeXtV2-Large', 'Deep Learning', 'Computer Vision', 'Roboflow', 'Python'],
      missions: ['Développement pipeline IA', 'Annotation données', 'Intégration industrielle'],
      achievements: ['Précision >95%', 'Calcul poids volumétrique'],
      competences: ['Computer Vision', 'Deep Learning', 'Traitement temps réel'],
      outils: ['Roboflow', 'YOLOv8', 'Caméras RGB/X-Ray'],
      tags: ['IA Avancée', 'Vision par ordinateur'],
      image: '/baridlogo.png',
      video: '/videos/baridvision.mp4',
      couleur: 'from-blue-600/20 to-cyan-600/20',
      icone: '👁️',
      niveau: 'expert',
      imageRatio: 'wide',
      details: [
        'Annotation et préparation du dataset avec Roboflow, incluant nettoyage, labellisation et gestion des classes pour entraîner les modèles de détection.',
        'Développement d&apos;un pipeline IA complet pour la détection et le suivi en temps réel des colis avec YOLOv8 et ByteTrack, atteignant une précision élevée (>95%) sur données réelles.',
        'Entraînement d&apos;un modèle ConvNeXtV2-Large pour l&apos;estimation précise des dimensions des colis, permettant le calcul automatique du poids volumétrique pour la facturation logistique.',
        'Mise en œuvre d&apos;un modèle de Deep Learning pour l&apos;identification d&apos;objets interdits (armes, liquides, batteries, etc.) à partir de données visuelles issues de caméras rayons-X.',
        'Développement d&apos;un système de classification des colis (intacts/endommagés, petits/grands), contribuant à l&apos;amélioration de la sécurité et fiabilité du tri postal.',
        'Contribution à l&apos;intégration des solutions IA dans l&apos;environnement industriel, avec caméras RGB et X-Ray, en respectant les contraintes de sécurité et performance temps réel.'
      ]
    },
    {
      id: 'stage2',
      entreprise: 'Solartech-Sud',
      poste: 'Stagiaire Développeuse Backend',
      periode: 'Juin 2024 – Juillet 2024',
      lieu: 'Solartech-Sud, Tunisie',
      description: 'Solutions logicielles pour systèmes solaires intelligents',
      technologies: ['Python', 'Flask', 'REST API', 'SQLAlchemy', 'PostgreSQL', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'IoT'],
      missions: ['Développement backend', 'Dashboard interactif', 'API REST'],
      achievements: ['Dashboard temps réel', 'Système SMS IoT'],
      competences: ['Développement Backend', 'API REST', 'IoT'],
      outils: ['Flask', 'PostgreSQL', 'Docker', 'Git/GitHub', 'Postman'],
      tags: ['Backend', 'IoT', 'Énergie Solaire'],
      image: '/solartechlogo.png',
      couleur: 'from-green-600/20 to-emerald-600/20',
      icone: '⚡',
      niveau: 'avance',
      imageRatio: 'wide',
      details: [
        'Développement de fonctionnalités backend avec Flask (Python), incluant un système robuste de gestion des utilisateurs et d&apos;authentification sécurisée.',
        'Conception et déploiement d&apos;un dashboard interactif pour le suivi des données et la supervision des équipements.',
        'Implémentation d&apos;un service de communication automatisée par SMS entre machines (IoT) pour assurer la connectivité temps réel.',
        'Renforcement des compétences en développement backend, API REST, et gestion d&apos;interfaces utilisateurs.',
        '🔹 Technologies & Outils : Python, Flask, REST API, SQLAlchemy, PostgreSQL/MySQL, HTML5, CSS3, JavaScript, Bootstrap, IoT (SMS Gateway), Git/GitHub, Docker (initiation), Postman.'
      ]
    },
    {
      id: 'stage3',
      entreprise: 'Softifi',
      poste: 'Stagiaire Développeuse Mobile',
      periode: 'Juin 2022 – Juillet 2022',
      lieu: 'Softifi, Tunisie',
      description: 'Développement d&apos;applications mobiles multiplateformes',
      technologies: ['Flutter', 'Dart', 'Android', 'iOS', 'REST API', 'Firebase', 'JSON'],
      missions: ['Apps multiplateformes', 'UI/UX moderne', 'Optimisation performances'],
      achievements: ['Apps Android/iOS', 'Interfaces responsives'],
      competences: ['Développement Mobile', 'UI/UX', 'Cross-platform'],
      outils: ['Flutter', 'Dart', 'Android Studio', 'Xcode', 'Visual Studio Code'],
      tags: ['Mobile', 'Cross-platform', 'UI/UX'],
      image: '/softifilogo.jpeg',
      couleur: 'from-purple-600/20 to-pink-600/20',
      icone: '📱',
      niveau: 'intermediaire',
      imageRatio: 'square',
      details: [
        'Conception et développement d&apos;applications mobiles pour Android et iOS avec Flutter, intégrant des APIs RESTful pour des services avancés.',
        'Réalisation d&apos;interfaces modernes et ergonomiques, améliorant l&apos;expérience utilisateur.',
        'Optimisation des performances des applications grâce à des techniques de profiling et de débogage sur Visual Studio Code.',
        'Contribution au cycle complet de développement mobile : design → développement → tests → déploiement.',
        '🔹 Technologies & Outils : Flutter, Dart, Android Studio, Xcode, APIs RESTful, Firebase (Auth/DB/Cloud Messaging), JSON, Git/GitHub, Visual Studio Code, Material Design, Postman.'
      ]
    }
  ]

  const filteredStages = activeFilter === 'all' ? stages : stages.filter(stage => {
    if (activeFilter === 'ia') return stage.technologies.some(tech => 
      ['YOLOv8', 'Deep Learning', 'Computer Vision'].includes(tech)
    )
    if (activeFilter === 'web') return stage.technologies.some(tech => 
      ['Flask', 'REST API', 'PostgreSQL'].includes(tech)
    )
    if (activeFilter === 'mobile') return stage.technologies.some(tech => 
      ['Flutter', 'Dart', 'Android'].includes(tech)
    )
    return true
  })

  const getNiveauColor = (niveau: string) => {
    const colors = {
      junior: 'from-green-500 to-green-600',
      intermediaire: 'from-blue-500 to-blue-600',
      avance: 'from-purple-500 to-purple-600',
      expert: 'from-red-500 to-red-600'
    }
    return colors[niveau as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const getNiveauText = (niveau: string) => {
    const texts = {
      junior: 'Junior',
      intermediaire: 'Intermédiaire',
      avance: 'Avancé',
      expert: 'Expert'
    }
    return texts[niveau as keyof typeof texts] || niveau
  }

  const toggleDetails = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Composant StageMedia amélioré
  const StageMedia = ({ stage, onStartVideo, onStopVideo }: { 
    stage: Stage; 
    onStartVideo: (id: string) => void;
    onStopVideo: (id: string) => void;
  }) => {
    const [mediaError, setMediaError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const isSquareImage = stage.imageRatio === 'square'
    
    const containerClass = isSquareImage 
      ? "w-full max-w-xs mx-auto" 
      : "w-full"
    
    const mediaClass = isSquareImage
      ? "w-64 h-64 object-contain rounded-lg mx-auto"
      : "w-full h-48 object-cover rounded-lg"

    const handleVideoEnd = () => {
      onStopVideo(stage.id)
    }

    const handleVideoClick = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      // Vérification corrigée avec !== null
      if (target.closest('video') !== null || target.closest('.video-controls') !== null) {
        return
      }
      
      if (playingVideo === stage.id) {
        onStopVideo(stage.id)
      } else {
        onStartVideo(stage.id)
      }
    }

    if (stage.video) {
      return (
        <div 
          className={`relative group video-container ${containerClass}`}
          onClick={handleVideoClick}
        >
          <video
            ref={setVideoRef(stage.id)}
            className={`${mediaClass} ${playingVideo === stage.id ? 'ring-2 ring-cyan-400' : ''}`}
            poster={stage.image}
            controls={playingVideo === stage.id}
            muted
            loop
            onError={() => setMediaError(true)}
            onEnded={handleVideoEnd}
            onLoadedData={() => setIsLoading(false)}
            onClick={(e) => e.stopPropagation()}
          >
            <source src={stage.video} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
          
          {playingVideo !== stage.id && (
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 hover:bg-black/20 ${isSquareImage ? 'max-w-xs mx-auto' : ''}`}>
              <div className="w-16 h-16 bg-cyan-500/80 hover:bg-cyan-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Voir la démo
              </div>
            </div>
          )}
          
          {playingVideo === stage.id && (
            <div className="absolute top-4 right-4">
              <button
                onClick={() => onStopVideo(stage.id)}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                title="Fermer la vidéo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )
    }

    if (mediaError) {
      return (
        <div className={`${mediaClass} bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center ${containerClass}`}>
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">🏢</div>
            <div className="text-sm">{stage.entreprise}</div>
          </div>
        </div>
      )
    }

    return (
      <div className={containerClass}>
        {isLoading && (
          <div className={`${mediaClass} bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center`}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          </div>
        )}
        <img 
          src={stage.image} 
          alt={stage.entreprise}
          className={`${mediaClass} transition-transform duration-500 group-hover:scale-105 ${isLoading ? 'hidden' : 'block'}`}
          onError={() => setMediaError(true)}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    )
  }

  const TechBadge = ({ tech, index }: { tech: string; index: number }) => (
    <motion.span 
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="px-3 py-1 bg-gradient-to-r from-cyan-900/40 to-purple-900/40 text-cyan-300 rounded-full text-sm border border-cyan-500/30"
    >
      {tech}
    </motion.span>
  )

  // Curseur personnalisé optimisé
  const CustomCursor = () => (
    <motion.div
      ref={cursorRef}
      className={`fixed z-50 pointer-events-none hidden md:block transition-opacity duration-200 ${
        isCursorVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        left: cursorPosition.x,
        top: cursorPosition.y,
      }}
      animate={{
        x: -10,
        y: -10,
        scale: isHoveringClickable ? 1.3 : 1,
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 400,
        mass: 0.5
      }}
    >
      <div className="relative">
        <motion.div
          className="w-6 h-6 border-2 border-cyan-400 rounded-full"
          animate={{
            scale: isHoveringClickable ? 1.1 : 0.8,
            opacity: isHoveringClickable ? 0.8 : 0.5,
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: isHoveringClickable ? 1.8 : 1,
            backgroundColor: isHoveringClickable ? '#f472b6' : '#22d3ee',
          }}
        />
      </div>
    </motion.div>
  )

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#0a0a18] to-[#1a1a2e] text-white overflow-hidden relative"
      onClick={() => {
        if (playingVideo) {
          stopVideo(playingVideo)
        }
      }}
    >
      <CustomCursor />

      {/* Animation de flux de données simplifiée */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 bg-gradient-to-r from-cyan-400/10 via-purple-500/15 to-pink-500/10"
            initial={{ x: i % 2 === 0 ? '-100%' : '100%', y: `${(i + 1) * 30}%` }}
            animate={{ x: i % 2 === 0 ? '100%' : '-100%' }}
            transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          particles: {
            number: { value: 30, density: { enable: true, value_area: 800 } },
            color: { value: "#00a2ff" },
            shape: { type: "circle" },
            opacity: { value: 0.3 },
            size: { value: { min: 1, max: 2 } },
            move: { enable: true, speed: 0.5, direction: "none" },
            links: {
              enable: true, 
              distance: 100,
              color: { value: "#00a2ff" }, 
              opacity: 0.2,
              width: 1
            },
          },
          interactivity: {
            events: { onHover: { enable: false }, onClick: { enable: false } },
          },
        }}
        className="absolute inset-0"
      />

      {/* Barre de navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-2xl border-b border-cyan-500/30"
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center h-20">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <motion.div key={item.id} className="relative">
                  <Link 
                    href={item.path} 
                    className="text-cyan-300/90 hover:text-cyan-400 transition-colors font-medium text-sm relative py-2 px-1"
                  >
                    {item.name}
                    {activeNav === item.id && (
                      <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" layoutId="navIndicator" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Contenu principal */}
      <div className="relative z-20 container mx-auto px-4 py-16 pt-28">
        {/* En-tête hero */}
        <motion.div className="text-center mb-16">
          <motion.h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Professional Experience
          </motion.h1>
          
          <motion.p className="text-cyan-300 font-mono text-xl md:text-2xl max-w-4xl mx-auto mb-8">
            Parcours d&apos;évolution technologique
          </motion.p>
        </motion.div>

        {/* Filtres */}
        <motion.div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map(filter => (
            <button 
              key={filter.id} 
              onClick={() => setActiveFilter(filter.id)} 
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.id 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-2xl shadow-cyan-500/30' 
                  : 'bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800/40 border border-cyan-500/20'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Timeline des stages */}
        <div className="relative max-w-7xl mx-auto">
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 shadow-2xl" />
          
          {filteredStages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
              className={`relative flex items-center mb-16 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full z-10 border-4 border-[#0a0a18] shadow-2xl flex items-center justify-center">
                <span className="text-white text-lg">{stage.icone}</span>
              </div>
              
              <div className={`ml-20 md:ml-0 md:w-5/12 ${
                index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
              }`}>
                <div className={`bg-gradient-to-br ${stage.couleur} backdrop-blur-2xl rounded-3xl p-8 border-2 border-cyan-500/30 shadow-2xl overflow-hidden relative group`}>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-4xl">{stage.icone}</span>
                          <div>
                            <h3 className="text-2xl font-bold text-cyan-300 mb-1">{stage.poste}</h3>
                            <div className="text-xl font-semibold text-purple-300">{stage.entreprise}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm mb-3">
                          <span className="text-cyan-200/80 bg-cyan-900/30 px-3 py-1 rounded-full">{stage.periode}</span>
                          <span className="text-cyan-200/80">{stage.lieu}</span>
                        </div>
                        
                        <span className={`inline-block px-4 py-2 text-sm font-bold bg-gradient-to-r ${getNiveauColor(stage.niveau)} rounded-full shadow-lg`}>
                          Niveau {getNiveauText(stage.niveau)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6 p-4 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-xl border border-cyan-500/20">
                      <p className="text-cyan-100/80 leading-relaxed">📌 {stage.description}</p>
                    </div>

                    {/* Media avec gestion vidéo améliorée */}
                    <div className="mb-6 overflow-hidden rounded-2xl flex justify-center">
                      <StageMedia 
                        stage={stage} 
                        onStartVideo={startVideo}
                        onStopVideo={stopVideo}
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                      {stage.technologies.slice(0, 6).map((tech, techIndex) => (
                        <TechBadge key={tech} tech={tech} index={techIndex} />
                      ))}
                    </div>

                    <button 
                      onClick={() => toggleDetails(stage.id)}
                      className="w-full py-4 bg-gradient-to-r from-cyan-600/80 to-purple-600/80 rounded-xl font-semibold text-white hover:from-cyan-500 hover:to-purple-500 transition-all duration-300"
                    >
                      {expandedItems[stage.id] ? 'Masquer les détails' : 'Explorer les réalisations'}
                    </button>

                    <AnimatePresence>
                      {expandedItems[stage.id] && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 border-t border-cyan-500/20 mt-6 space-y-6">
                            <div>
                              <h4 className="text-xl font-semibold text-cyan-400 mb-4">Missions détaillées</h4>
                              <div className="grid gap-3">
                                {stage.details?.map((detail, detailIndex) => (
                                  <div key={detailIndex} className="flex items-start p-3 bg-gradient-to-r from-cyan-900/10 to-purple-900/10 rounded-xl">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-xs">
                                      {detailIndex + 1}
                                    </div>
                                    <p className="text-cyan-100/80 leading-relaxed">{detail}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}