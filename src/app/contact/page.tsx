'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Particles from 'react-particles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'
import type { Container } from 'tsparticles-engine'

export default function ContactPage() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [activeNav, setActiveNav] = useState('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeField, setActiveField] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Curseur personnalisé amélioré
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Initialisation des particules
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(async (container?: Container) => {
    // Optional: do something with the container
  }, [])

  // Nouveaux liens de navigation avec les redirections demandées
  const navItems = [
    { name: 'Neural Entrance', id: 'home', path: '/' },
    { name: 'Data Mind', id: 'about', path: '/DataMind' },
    { name: 'Project Gallery', id: 'projects', path: '/Projects' },
    { name: 'Professional Experience', id: 'stages', path: '/stages' },
    { name: 'Neural Skills', id: 'skills', path: '/competences' },
    { name: 'Future Predictions', id: 'skills', path: '/predictions' },
    { name: 'Contact', id: 'contact', path: '/contact' }
  ]

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulation d'envoi
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  // Animation de l'arrière-plan avec canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Configuration du canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Points de connexion pour la carte du monde
    const connectionPoints = [
      { x: 0.3, y: 0.4, active: false },  // Votre position
      { x: 0.7, y: 0.3, active: false },  // Point 1
      { x: 0.8, y: 0.6, active: false },  // Point 2
      { x: 0.2, y: 0.7, active: false },  // Point 3
      { x: 0.5, y: 0.2, active: false },  // Point 4
      { x: 0.4, y: 0.8, active: false }   // Point 5
    ]
    
    // Animation des connexions
    const animateConnections = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Dessiner le réseau de connexions
      ctx.strokeStyle = 'rgba(0, 162, 255, 0.2)'
      ctx.lineWidth = 1
      
      // Votre position (point central)
      const centerX = canvas.width * connectionPoints[0].x
      const centerY = canvas.height * connectionPoints[0].y
      
      // Dessiner les lignes de connexion
      for (let i = 1; i < connectionPoints.length; i++) {
        const pointX = canvas.width * connectionPoints[i].x
        const pointY = canvas.height * connectionPoints[i].y
        
        // Ligne principale
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(pointX, pointY)
        ctx.stroke()
        
        // Effet de pulsation sur les lignes
        if (Math.random() > 0.7) {
          ctx.strokeStyle = 'rgba(0, 162, 255, 0.6)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.lineTo(pointX, pointY)
          ctx.stroke()
          ctx.strokeStyle = 'rgba(0, 162, 255, 0.2)'
          ctx.lineWidth = 1
        }
        
        // Points de connexion
        ctx.fillStyle = connectionPoints[i].active ? '#00a2ff' : 'rgba(0, 162, 255, 0.5)'
        ctx.beginPath()
        ctx.arc(pointX, pointY, 4, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Votre position (point central plus grand)
      ctx.fillStyle = '#00a2ff'
      ctx.beginPath()
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
      ctx.fill()
      
      // Effet de pulsation autour du point central
      ctx.strokeStyle = 'rgba(0, 162, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, 12 + Math.sin(Date.now() / 1000) * 3, 0, Math.PI * 2)
      ctx.stroke()
      
      requestAnimationFrame(animateConnections)
    }
    
    animateConnections()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a18] to-[#1a1a2e] text-white overflow-hidden relative">
      {/* Curseur personnalisé en forme de neurone */}
      <div 
        className="fixed z-40 pointer-events-none hidden md:block"
        style={{ 
          left: `${cursorPosition.x}px`, 
          top: `${cursorPosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="w-6 h-6 relative">
          <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-70 animate-ping"></div>
          <div className="absolute inset-0 bg-cyan-500 rounded-full"></div>
          <div className="absolute -inset-2 border-2 border-cyan-400 rounded-full opacity-40"></div>
          <div className="absolute -inset-1 border border-cyan-300 rounded-full opacity-30"></div>
        </div>
        {/* Traînée lumineuse */}
        <div className="absolute -inset-4 bg-cyan-400 rounded-full blur-md opacity-20"></div>
      </div>

      {/* Animation de flux de données traversant l'écran */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 bg-gradient-to-r from-cyan-400/30 via-purple-500/50 to-pink-500/30"
            initial={{ 
              x: i % 2 === 0 ? '-100%' : '100%', 
              y: `${(i + 1) * 20}%`,
              opacity: 0.3
            }}
            animate={{ 
              x: i % 2 === 0 ? '100%' : '-100%',
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Particles background - Réseau neuronal original */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: ["#00a2ff", "#0066ff", "#a855f7"],
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.7,
            },
            size: {
              value: {
                min: 1,
                max: 3,
              },
            },
            move: {
              enable: true,
              speed: 1.5,
              direction: "none",
              outModes: {
                default: "out",
              },
            },
            links: {
              enable: true,
              distance: 150,
              color: {
                value: "#00a2ff",
              },
              opacity: 0.4,
              width: 1,
            },
          },
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab",
              },
              onClick: {
                enable: true,
                mode: "push",
              },
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.8,
                },
              },
              push: {
                quantity: 4,
              },
            },
          },
          detectRetina: true,
        }}
      />

      {/* Canvas pour l'arrière-plan avec réseau de connexions */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 opacity-60"
      />

      {/* Barre de navigation supérieure améliorée avec design premium */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-2xl border-b border-cyan-500/30 shadow-2xl shadow-cyan-500/10"
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center h-20">
            {/* Liens de navigation améliorés - Centrés */}
            <div className="flex space-x-10">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="relative"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <motion.div
                    onHoverStart={() => setIsHovering(true)}
                    onHoverEnd={() => setIsHovering(false)}
                  >
                    <Link
                      href={item.path}
                      className={`text-cyan-300/90 hover:text-cyan-400 transition-colors font-medium text-sm relative py-2 px-1 ${
                        activeNav === item.id ? 'text-cyan-400' : ''
                      }`}
                      onClick={() => setActiveNav(item.id)}
                    >
                      {item.name}
                      {activeNav === item.id && (
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                          layoutId="navIndicator"
                        />
                      )}
                      {/* Souligner "Contact" */}
                      {item.name === 'Contact' && (
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                          layoutId="contactIndicator"
                        />
                      )}
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-4 py-16 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Contact
          </h1>
          <p className="text-cyan-300 font-mono text-xl max-w-3xl mx-auto">
            Entrez en communication avec le réseau central
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/40 shadow-2xl shadow-cyan-500/10"
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
              <span className="mr-3">📧</span>
              Formulaire de transmission
            </h2>
            
            {isSubmitted ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-green-400 mb-2">Message transmis avec succès</h3>
                <p className="text-cyan-300">Votre message a été envoyé sur le réseau central</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-cyan-300 font-mono text-sm mb-2">
                    IDENTITÉ
                  </label>
                  <div className={`relative rounded-lg p-0.5 ${activeField === 'name' ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-cyan-900/30'}`}>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setActiveField('name')}
                      onBlur={() => setActiveField('')}
                      className="w-full bg-cyan-950/50 border-0 rounded-md py-3 px-4 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      placeholder="Entrez votre identifiant"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-cyan-300 font-mono text-sm mb-2">
                    FRÉQUENCE DE CONTACT
                  </label>
                  <div className={`relative rounded-lg p-0.5 ${activeField === 'email' ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-cyan-900/30'}`}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setActiveField('email')}
                      onBlur={() => setActiveField('')}
                      className="w-full bg-cyan-950/50 border-0 rounded-md py-3 px-4 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      placeholder="votre@frequence.transmission"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-cyan-300 font-mono text-sm mb-2">
                    OBJET DE LA TRANSMISSION
                  </label>
                  <div className={`relative rounded-lg p-0.5 ${activeField === 'subject' ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-cyan-900/30'}`}>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setActiveField('subject')}
                      onBlur={() => setActiveField('')}
                      className="w-full bg-cyan-950/50 border-0 rounded-md py-3 px-4 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      placeholder="Sujet de votre message"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-cyan-300 font-mono text-sm mb-2">
                    CONTENU DU MESSAGE
                  </label>
                  <div className={`relative rounded-lg p-0.5 ${activeField === 'message' ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-cyan-900/30'}`}>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setActiveField('message')}
                      onBlur={() => setActiveField('')}
                      rows={5}
                      className="w-full bg-cyan-950/50 border-0 rounded-md py-3 px-4 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      placeholder="Entrez le contenu de votre transmission..."
                    />
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">📤</span>
                  INITIER LA TRANSMISSION
                </motion.button>
              </form>
            )}
          </motion.div>
          
          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/40 shadow-2xl shadow-purple-500/10">
              <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
                <span className="mr-3">🌐</span>
                Canaux de Communication
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-cyan-900/40 p-3 rounded-lg mr-4">
                    <span className="text-cyan-300 text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-300">Transmission Électronique</h3>
                    <p className="text-cyan-200/80">mberikoumaima74@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cyan-900/40 p-3 rounded-lg mr-4">
                    <span className="text-cyan-300 text-xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-300">Fréquence Mobile</h3>
                    <p className="text-cyan-200/80">+216 24520160</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cyan-900/40 p-3 rounded-lg mr-4">
                    <span className="text-cyan-300 text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-300">Coordonnées Spatiales</h3>
                    <p className="text-cyan-200/80">Tunis, Tunisie</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-cyan-900/40 p-3 rounded-lg mr-4">
                    <span className="text-cyan-300 text-xl">🔗</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-300">Réseaux Sociaux</h3>
                    <p className="text-cyan-200/80">LinkedIn: /in/oumaymamberik</p>
                    <p className="text-cyan-200/80">GitHub: /MberikOumayma</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/40 shadow-2xl shadow-cyan-500/10">
              <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
                <span className="mr-3">⚡</span>
                Statut du Réseau
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300">Capacité de réception</span>
                  <div className="w-24 h-2 bg-cyan-900/50 rounded-full">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-4/5"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300">Vitesse de transmission</span>
                  <div className="w-24 h-2 bg-cyan-900/50 rounded-full">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-3/4"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300">Latence du réseau</span>
                  <div className="w-24 h-2 bg-cyan-900/50 rounded-full">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-1/5"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-cyan-900/30 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 text-sm font-mono">
                  <span className="text-green-400">●</span> Système opérationnel - Prêt à recevoir votre transmission
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pied de page animé */}
      <motion.footer 
        className="text-center py-12 text-cyan-500/50 text-sm relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
      >
        <p>Designed with ❤️ and 🤖 • © 2024 Mberik Oumayma</p>
      </motion.footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          cursor: none;
        }
        
        h1, h2, h3, .font-mono {
          font-family: 'Space Mono', monospace;
        }
        
        @media (max-width: 768px) {
          body {
            cursor: auto;
          }
        }
      `}</style>
    </div>
  )
}