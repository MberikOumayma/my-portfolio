'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Particles from 'react-particles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'
import type { Container } from 'tsparticles-engine'

export default function NeuralEntrance() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showGuide, setShowGuide] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  
  // Statistiques mondiales (valeurs simulées)
  const [dataGenerated, setDataGenerated] = useState(0)
  const [aiModelsTrained, setAiModelsTrained] = useState(0)
  const [algorithmsExecuted, setAlgorithmsExecuted] = useState(0)
  
  const quotes = [
    "In the realm of data, patterns whisper truths that numbers alone cannot speak.",
    "Artificial intelligence is the canvas where mathematics paints its masterpiece.",
    "Every algorithm is a story waiting to be told through the language of data.",
    "The future belongs to those who understand that data is the new poetry.",
    "In the neural networks of possibility, we find the blueprints of tomorrow.",
    "Data science is the art of extracting meaning from the chaos of information."
  ]

  // Vérifier si c'est la première visite
  useEffect(() => {
    const visitedBefore = localStorage.getItem('neuralEntranceVisited')
    if (!visitedBefore) {
      setIsFirstVisit(true)
      localStorage.setItem('neuralEntranceVisited', 'true')
      // Afficher le guide après un délai si première visite
      setTimeout(() => setShowGuide(true), 1500)
    } else {
      setIsFirstVisit(false)
    }
  }, [])

  // Animation des citations qui changent
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Animation des statistiques (compteurs qui augmentent)
  useEffect(() => {
    // Simuler des données générées aujourd'hui (en To)
    const interval = setInterval(() => {
      setDataGenerated(prev => {
        const newValue = prev + Math.random() * 5
        return newValue > 2500 ? 2500 : newValue
      })
    }, 3000)

    // Simuler des modèles IA entraînés aujourd'hui
    const interval2 = setInterval(() => {
      setAiModelsTrained(prev => {
        const newValue = prev + Math.random() * 2
        return newValue > 1000 ? 1000 : newValue
      })
    }, 5000)

    // Simuler des algorithmes exécutés aujourd'hui (en millions)
    const interval3 = setInterval(() => {
      setAlgorithmsExecuted(prev => {
        const newValue = prev + Math.random() * 10
        return newValue > 50000 ? 50000 : newValue
      })
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(interval2)
      clearInterval(interval3)
    }
  }, [])

  // Curseur personnalisé
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

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a18] cursor-none">
      
      {/* Indicateurs de statistiques mondiales */}
      <div className="absolute top-4 left-4 z-30">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="bg-black/20 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 font-mono"
        >
          <div className="text-cyan-400 text-xs mb-1">Données générées aujourd'hui</div>
          <div className="text-cyan-300 text-sm">{dataGenerated.toFixed(0)} To</div>
        </motion.div>
      </div>

      <div className="absolute top-4 right-4 z-30">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="bg-black/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 font-mono"
        >
          <div className="text-purple-400 text-xs mb-1">Modèles IA entraînés</div>
          <div className="text-purple-300 text-sm">{aiModelsTrained.toFixed(0)}</div>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-4 z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="bg-black/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 font-mono"
        >
          <div className="text-blue-400 text-xs mb-1">Algorithmes exécutés</div>
          <div className="text-blue-300 text-sm">{(algorithmsExecuted / 1000).toFixed(1)}M</div>
        </motion.div>
      </div>

      {/* Guide de découverte (première visite seulement) */}
      {isFirstVisit && showGuide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-cyan-900/80 backdrop-blur-md border border-cyan-400/50 rounded-lg p-4 max-w-xs"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5 mr-3 text-cyan-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-cyan-300 text-sm font-medium mb-1">Première connexion</h3>
              <p className="text-cyan-200 text-xs">Cliquez sur "Découvrir mon Univers" pour explorer mon portfolio de data science</p>
            </div>
            <button 
              onClick={() => setShowGuide(false)}
              className="ml-4 flex-shrink-0 text-cyan-500 hover:text-cyan-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

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
              value: ["#00a2ff", "#0066ff", '#a855f7'],
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

      {/* Contenu principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Titre énigmatique */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="text-4xl md:text-6xl font-bold mb-6 font-mono text-cyan-400"
        >
          <span className="text-purple-400">AI</span>
          <span className="text-cyan-300">Mindscape</span>
        </motion.h1>

        {/* Citation inspirante centrale */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="text-lg md:text-xl text-cyan-200/90 mb-6 italic max-w-2xl mx-auto leading-relaxed"
        >
          "{quotes[currentQuote]}"
        </motion.div>

        {/* Paragraphe sur l'importance de la data science et IA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1.5 }}
          className="text-cyan-100/80 mb-10 max-w-3xl mx-auto text-base md:text-lg leading-relaxed font-light"
        >
          <p className="mb-4">
            Aujourd'hui, la <span className="text-cyan-300 font-medium">data science</span> et l'<span className="text-purple-300 font-medium">intelligence artificielle </span> 
             révolutionnent notre monde en transformant des données brutes en insights précieux. 
            Elles sont devenues les piliers de l'innovation moderne, permettant de résoudre des problèmes complexes, 
            de prédire les tendances futures et de créer des systèmes intelligents qui améliorent notre quotidien.
          </p>
          <p>
            De la santé à la finance, en passant par l'environnement et l'éducation, ces technologies 
            transforment chaque industrie et ouvrent la voie à un avenir où les décisions sont éclairées 
            par l'analyse prédictive et l'apprentissage automatique.
          </p>
        </motion.div>

        {/* Bouton d'entrée principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <button 
            className="px-10 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-bold text-white shadow-lg hover:shadow-cyan-500/40 transition-all relative overflow-hidden group"
            onClick={() => {
              // Redirection vers la page DataMind/
              window.location.href = '/DataMind/';
            }}
          >
            <span className="relative z-10">Découvrir mon Univers</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </button>
        </motion.div>
      </motion.div>

      {/* Styles CSS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
        
        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-pulse {
          animation: terminal-blink 1s step-end infinite;
        }
        
        /* Curseur personnalisé pour mobile */
        @media (max-width: 768px) {
          body {
            cursor: auto;
          }
        }
      `}</style>
    </section>
  )
}