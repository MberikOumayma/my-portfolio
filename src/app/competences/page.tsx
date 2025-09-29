'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Particles from 'react-particles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'

// Définir les types TypeScript
interface SkillCategory {
  id: string
  title: string
  skills: Skill[]
  icon: string
  color: string
}

interface Skill {
  name: string
  level: number // 1-100
  description?: string
}

interface NeuralNode {
  id: string
  name: string
  level: number
  category: string
  color: string
  x: number
  y: number
  connections: string[]
  vx: number
  vy: number
}

export default function SkillsPage() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [activeNav, setActiveNav] = useState('skills')
  const [activeTab, setActiveTab] = useState<'list' | 'network'>('list')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

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

  const particlesLoaded = useCallback(async () => {
    // Optional: do something with the container
  }, [])

  // Nouveaux liens de navigation avec les redirections demandées
  const navItems = [
    { name: 'Neural Entrance', id: 'home', path: '/' },
    { name: 'Data Mind', id: 'about', path: '/DataMind' },
    { name: 'Project Gallery', id: 'projects', path: '/Projects' },
    { name: 'Professional Experience', id: 'stages', path: '/stages' },
    { name: 'Neural Skills', id: 'skills', path: '/competences' },
    { name: 'Future Predictions', id: 'predictions', path: '/predictions' },
    { name: 'Contact', id: 'contact', path: '/contact' }
  ]

  // Données des compétences avec niveaux et descriptions
  const skillCategories: SkillCategory[] = [
    {
      id: 'programming',
      title: 'Langages de Programmation',
      skills: [
        { name: 'Python', level: 95, description: 'Développement de scripts, analyses de données, ML, automation' },
        { name: 'R', level: 85, description: 'Analyses statistiques, visualisations, rapports automatisés' },
        { name: 'SQL', level: 90, description: 'Requêtes complexes, optimisation, modélisation de données' },
        { name: 'Java', level: 80, description: 'Développement d&apos;applications backend, Spring Boot' },
        { name: 'Scala', level: 70, description: 'Traitement de données distribué avec Spark' },
        { name: 'C++', level: 75, description: 'Algorithmes performants, calcul scientifique' },
        { name: 'TypeScript/JavaScript', level: 85, description: 'Développement frontend, visualisations interactives' }
      ],
      icon: '💻',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'ml-ai',
      title: 'Machine Learning & IA',
      skills: [
        { name: 'Machine Learning', level: 90, description: 'Modèles prédictifs, classification, régression' },
        { name: 'Deep Learning', level: 85, description: 'Réseaux neuronaux, CNN, RNN, Transformers' },
        { name: 'LLM & GPT', level: 80, description: 'Fine-tuning, prompt engineering, applications génératives' },
        { name: 'Computer Vision', level: 75, description: 'Traitement d&apos;images, détection d&apos;objets, segmentation' },
        { name: 'NLP', level: 85, description: 'Traitement de texte, analyse de sentiment, NER' },
        { name: 'Reinforcement Learning', level: 65, description: 'Algorithmes Q-learning, applications jeux' },
        { name: 'MLOps', level: 80, description: 'Déploiement, monitoring, versioning de modèles' }
      ],
      icon: '🧠',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'data-engineering',
      title: 'Ingénierie des Données',
      skills: [
        { name: 'Apache Spark', level: 85, description: 'Traitement distribué, Spark SQL, Streaming' },
        { name: 'Hadoop Ecosystem', level: 75, description: 'HDFS, Hive, HBase, traitement Big Data' },
        { name: 'ETL/ELT', level: 90, description: 'Pipelines de données, intégration, transformation' },
        { name: 'Airflow', level: 80, description: 'Orchestration de workflows, pipelines automatisés' },
        { name: 'Kafka', level: 70, description: 'Streaming de données en temps réel' },
        { name: 'Data Warehousing', level: 85, description: 'Modélisation en étoile/flocon, Snowflake, Redshift' },
        { name: 'Data Lakes', level: 80, description: 'Architecture Lakehouse, Delta Lake, Iceberg' }
      ],
      icon: '📊',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'databases',
      title: 'Bases de Données',
      skills: [
        { name: 'MySQL', level: 90, description: 'Bases relationnelles, optimisation, administration' },
        { name: 'PostgreSQL', level: 85, description: 'Bases relationnelles avancées, extensions' },
        { name: 'MongoDB', level: 80, description: 'Bases NoSQL, modélisation document' },
        { name: 'Redis', level: 75, description: 'Cache en mémoire, bases clé-valeur' },
        { name: 'Elasticsearch', level: 70, description: 'Moteur de recherche, analyse de logs' },
        { name: 'Neo4j', level: 65, description: 'Bases de données graphes, analyses relationnelles' },
        { name: 'SQLite', level: 85, description: 'Bases embarquées, applications légères' }
      ],
      icon: '🗄️',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'cloud-mlops',
      title: 'Cloud & MLOps',
      skills: [
        { name: 'AWS', level: 85, description: 'S3, EC2, SageMaker, Lambda, services IA' },
        { name: 'Azure', level: 75, description: 'Azure ML, Databricks, services cognitifs' },
        { name: 'Jenkins', level: 70, description: 'BigQuery, Vertex AI, Cloud Functions' },
        { name: 'Docker', level: 90, description: 'Conteneurisation, images, déploiement' },
        { name: 'Kubernetes', level: 75, description: 'Orchestration de conteneurs, scaling' },
        { name: 'MLflow', level: 80, description: 'Tracking d&apos;expériences, gestion de modèles' },
        { name: 'CI/CD', level: 85, description: 'GitHub Actions, Jenkins, automatisation déploiement' }
      ],
      icon: '☁️',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'visualization',
      title: 'Visualisation & BI',
      skills: [
        { name: 'Tableau', level: 90, description: 'Dashboards interactifs, story-telling data' },
        { name: 'Power BI', level: 85, description: 'Reports d&apos;entreprise, modèles data' },
        { name: 'Matplotlib/Seaborn', level: 95, description: 'Visualisations Python, analyses exploratoires' },
        { name: 'Plotly/Dash', level: 80, description: 'Visualisations interactives, applications web' },
        { name: 'D3.js', level: 70, description: 'Visualisations customisées avancées' },
        { name: 'Apache Superset', level: 75, description: 'BI open source, exploration de données' },
        { name: 'Excel Advanced', level: 90, description: 'Modèles complexes, Power Query, VBA' }
      ],
      icon: '📈',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'math-stats',
      title: 'Maths & Statistiques',
      skills: [
        { name: 'Statistiques', level: 90, description: 'Tests d&apos;hypothèses, intervalles de confiance' },
        { name: 'Probabilités', level: 85, description: 'Distributions, Bayes, processus stochastiques' },
        { name: 'Algèbre Linéaire', level: 80, description: 'Matrices, décompositions, optimisation' },
        { name: 'Calcul', level: 75, description: 'Dérivées, intégrales, optimisation continue' },
        { name: 'Optimisation', level: 80, description: 'Algorithmes gradient, convexité, contraintes' },
        { name: 'Recherche Opérationnelle', level: 70, description: 'Optimisation discrète, programmation linéaire' },
        { name: 'Expérimentation', level: 85, description: 'Tests A/B, design d&apos;expérience, causalité' }
      ],
      icon: '🧮',
      color: 'from-cyan-500 to-blue-500'
    }
  ]

  // Fonction pour obtenir toutes les compétences (pour la vue "all")
  const getAllSkills = () => {
    return skillCategories.flatMap(category => category.skills)
  }

  // Fonction pour obtenir les compétences filtrées
  const getFilteredSkills = () => {
    if (activeCategory === 'all') {
      return getAllSkills()
    }
    
    const category = skillCategories.find(cat => cat.id === activeCategory)
    return category ? category.skills : []
  }

  // Obtenir la catégorie d'une compétence
  const getSkillCategory = (skillName: string) => {
    return skillCategories.find(category => 
      category.skills.some(skill => skill.name === skillName)
    )
  }

  // Obtenir le niveau textuel
  const getLevelText = (level: number) => {
    if (level >= 90) return 'Expert'
    if (level >= 70) return 'Avancé'
    if (level >= 50) return 'Intermédiaire'
    return 'Débutant'
  }

  // Composant pour le réseau neuronal
  const NeuralNetwork = () => {
    const networkCanvasRef = useRef<HTMLCanvasElement>(null)
    const [networkHoveredNode, setNetworkHoveredNode] = useState<string | null>(null)
    const nodesRef = useRef<NeuralNode[]>([])
    const animationIdRef = useRef<number | undefined>(undefined)

    useEffect(() => {
      if (!networkCanvasRef.current) return

      const canvas = networkCanvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Redimensionner le canvas
      const resizeCanvas = () => {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
      }

      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)

      // Créer les nœuds du réseau
      const createNeuralNodes = (): NeuralNode[] => {
        const nodes: NeuralNode[] = []
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = Math.min(canvas.width, canvas.height) * 0.35

        const allSkills = getAllSkills()

        allSkills.forEach((skill, i) => {
          const category = getSkillCategory(skill.name)
          // Couleurs simplifiées pour le réseau
          const colorMap: Record<string, string> = {
            'programming': '#3b82f6',
            'ml-ai': '#8b5cf6',
            'data-engineering': '#10b981',
            'databases': '#f59e0b',
            'cloud-mlops': '#6366f1',
            'visualization': '#ef4444',
            'math-stats': '#06b6d4'
          }
          
          const color = category ? colorMap[category.id] || '#888' : '#888'

          // Position en cercle avec un peu d'aléatoire
          const angle = (i / allSkills.length) * Math.PI * 2
          const randomRadius = radius * (0.8 + Math.random() * 0.4)
          const x = centerX + Math.cos(angle) * randomRadius
          const y = centerY + Math.sin(angle) * randomRadius

          nodes.push({
            id: `node-${skill.name}`,
            name: skill.name,
            level: skill.level,
            category: category ? category.title : 'Other',
            color,
            x,
            y,
            connections: [],
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3
          })
        })

        // Créer des connexions entre les nœuds
        nodes.forEach((node: NeuralNode, i: number) => {
          // Connecter à quelques nœuds aléatoires (plus de connexions pour les compétences importantes)
          const numConnections = Math.floor((node.level / 30)) + 1
          for (let j = 0; j < numConnections; j++) {
            const randomIndex = Math.floor(Math.random() * nodes.length)
            if (randomIndex !== i && !node.connections.includes(nodes[randomIndex].id)) {
              node.connections.push(nodes[randomIndex].id)
            }
          }
        })

        return nodes
      }

      nodesRef.current = createNeuralNodes()

      // Fonction pour dessiner le réseau
      const drawNetwork = () => {
        if (!ctx) return

        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Dessiner les connexions
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.lineWidth = 1

        nodesRef.current.forEach((node: NeuralNode) => {
          node.connections.forEach((connectionId: string) => {
            const targetNode = nodesRef.current.find((n: NeuralNode) => n.id === connectionId)
            if (targetNode) {
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(targetNode.x, targetNode.y)
              ctx.stroke()
            }
          })
        })

        // Dessiner les nœuds
        nodesRef.current.forEach((node: NeuralNode) => {
          const size = 5 + (node.level / 100) * 20 // Taille basée sur le niveau

          // Halo
          const gradient = ctx.createRadialGradient(
            node.x, node.y, size * 0.8,
            node.x, node.y, size * 1.5
          )
          gradient.addColorStop(0, node.color + '80')
          gradient.addColorStop(1, 'transparent')

          ctx.beginPath()
          ctx.arc(node.x, node.y, size * 1.5, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()

          // Nœud principal
          ctx.beginPath()
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
          ctx.fillStyle = node.color
          ctx.fill()

          // Bordure pour le nœud survolé/sélectionné
          if (networkHoveredNode === node.id || selectedSkill?.name === node.name) {
            ctx.beginPath()
            ctx.arc(node.x, node.y, size + 2, 0, Math.PI * 2)
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 2
            ctx.stroke()
          }

          // Étiquette pour le nœud survolé
          if (networkHoveredNode === node.id) {
            ctx.font = '12px sans-serif'
            ctx.fillStyle = '#ffffff'
            ctx.textAlign = 'center'
            ctx.fillText(node.name, node.x, node.y - size - 10)
          }
        })
      }

      // Animation
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate)

        // Mettre à jour les positions avec une légère animation
        nodesRef.current.forEach((node: NeuralNode) => {
          // Mouvement doux
          node.x += node.vx
          node.y += node.vy

          // Rebond sur les bords
          if (node.x < 50 || node.x > canvas.width - 50) node.vx *= -1
          if (node.y < 50 || node.y > canvas.height - 50) node.vy *= -1

          // Attraction vers le centre
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const dx = centerX - node.x
          const dy = centerY - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > Math.min(canvas.width, canvas.height) * 0.4) {
            node.vx += dx * 0.0005
            node.vy += dy * 0.0005
          }

          // Limiter la vitesse
          const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
          if (speed > 2) {
            node.vx = (node.vx / speed) * 2
            node.vy = (node.vy / speed) * 2
          }
        })

        drawNetwork()
      }

      animate()

      // Gestionnaire d'événements pour le survol et le clic
      const handleMouseMove = (e: MouseEvent) => {
        if (!networkCanvasRef.current) return

        const rect = networkCanvasRef.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        // Vérifier si la souris est sur un nœud
        const nodeUnderMouse = nodesRef.current.find((node: NeuralNode) => {
          const size = 5 + (node.level / 100) * 20
          const dx = mouseX - node.x
          const dy = mouseY - node.y
          return Math.sqrt(dx * dx + dy * dy) < size + 5
        })

        setNetworkHoveredNode(nodeUnderMouse ? nodeUnderMouse.id : null)
      }

      const handleClick = (e: MouseEvent) => {
        if (!networkCanvasRef.current) return

        const rect = networkCanvasRef.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        // Vérifier si le clic est sur un nœud
        const clickedNode = nodesRef.current.find((node: NeuralNode) => {
          const size = 5 + (node.level / 100) * 20
          const dx = mouseX - node.x
          const dy = mouseY - node.y
          return Math.sqrt(dx * dx + dy * dy) < size + 5
        })

        if (clickedNode) {
          const skill = getAllSkills().find(s => s.name === clickedNode.name)
          if (skill) setSelectedSkill(skill)
        }
      }

      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('click', handleClick)

      // Nettoyage
      return () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current)
        }
        window.removeEventListener('resize', resizeCanvas)
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('click', handleClick)
      }
    }, [selectedSkill])

    return (
      <div className="relative w-full h-full">
        <canvas 
          ref={networkCanvasRef} 
          className="w-full h-full"
          style={{ background: 'transparent' }}
        />
        
        {/* Overlay d'informations */}
        <div className="absolute bottom-4 left-4 p-4 bg-black/50 backdrop-blur-md rounded-lg border border-cyan-500/30">
          <h3 className="text-cyan-300 font-bold mb-2">Légende</h3>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-white text-sm">Langages de Programmation</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-white text-sm">Machine Learning & IA</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-white text-sm">Ingénierie des Données</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-white text-sm">Bases de Données</span>
            </div>
          </div>
          <p className="text-cyan-200 text-xs mt-2">Taille = Niveau de maîtrise</p>
          <p className="text-cyan-200 text-xs">Cliquez sur un nœud pour voir les détails</p>
        </div>
      </div>
    )
  }

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
                    {/* Souligner "Neural Skills" */}
                    {item.name === 'Neural Skills' && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                        layoutId="neuralSkillsIndicator"
                      />
                    )}
                  </Link>
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
            Mes Compétences
          </h1>
          <p className="text-cyan-300 font-mono text-xl max-w-3xl mx-auto">
            Expertise technique en Data Science, Intelligence Artificielle et Ingénierie des Données
          </p>
        </motion.div>

        {/* Sélecteur d'onglets */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-cyan-900/30 backdrop-blur-md rounded-full p-1 border border-cyan-500/30">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'list'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                  : 'text-cyan-300 hover:bg-cyan-800/40'
              }`}
            >
              📋 Vue Liste
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'network'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                  : 'text-cyan-300 hover:bg-cyan-800/40'
              }`}
            >
              🕸️ Vue Réseau
            </button>
          </div>
        </motion.div>

        {/* Modal de détail de compétence */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
              onClick={() => setSelectedSkill(null)}
            >
              <motion.div 
                className="bg-gradient-to-br from-cyan-900/90 to-purple-900/90 border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-cyan-300">{selectedSkill.name}</h3>
                  <button 
                    onClick={() => setSelectedSkill(null)}
                    className="text-cyan-500 hover:text-cyan-300 text-xl"
                  >
                    &times;
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-cyan-200 mb-1">
                    <span>Maîtrise</span>
                    <span>{getLevelText(selectedSkill.level)}</span>
                  </div>
                  <div className="h-2 bg-cyan-800/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedSkill.level}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    />
                  </div>
                </div>
                
                {selectedSkill.description && (
                  <p className="text-cyan-200 mb-4">{selectedSkill.description}</p>
                )}
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => setSelectedSkill(null)}
                    className="px-4 py-2 bg-cyan-700/50 hover:bg-cyan-600/50 rounded-lg transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenu des onglets */}
        {activeTab === 'list' ? (
          <>
            {/* Filtres de catégories */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-12 px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                key="all"
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center ${
                  activeCategory === 'all'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800/40'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">🌟</span> Toutes
              </motion.button>

              {skillCategories.map(category => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2">{category.icon}</span> 
                  <span className="hidden sm:inline">{category.title}</span>
                  <span className="sm:hidden">{category.title.split(' ')[0]}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* Section des compétences */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {activeCategory === 'all' ? (
                // Affichage de toutes les compétences groupées par catégorie
                skillCategories.map(category => (
                  <motion.div
                    key={category.id}
                    className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/40 shadow-2xl shadow-cyan-500/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`text-2xl mr-3 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                        {category.icon}
                      </div>
                      <h2 className="text-xl font-bold text-cyan-300">{category.title}</h2>
                    </div>
                    
                    <div className="space-y-3">
                      {category.skills.map(skill => (
                        <motion.div
                          key={skill.name}
                          className="px-4 py-3 bg-cyan-900/40 rounded-lg border border-cyan-500/30 cursor-pointer transition-all duration-300 hover:bg-cyan-800/60"
                          whileHover={{ scale: 1.02 }}
                          onMouseEnter={() => setHoveredSkill(skill.name)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          onClick={() => setSelectedSkill(skill)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-100">{skill.name}</span>
                            <div className="text-xs font-mono text-cyan-400/80">
                              {getLevelText(skill.level)}
                            </div>
                          </div>
                          
                          {/* Barre de progression */}
                          <div className="mt-2 h-1.5 bg-cyan-800/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1.5, delay: 0.1 }}
                              className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))
              ) : (
                // Affichage des compétences filtrées par catégorie
                getFilteredSkills().map(skill => {
                  const category = getSkillCategory(skill.name)!
                  return (
                    <motion.div
                      key={skill.name}
                      className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/40 shadow-2xl shadow-cyan-500/10"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`text-2xl mr-3 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                            {category.icon}
                          </div>
                          <h3 className="text-lg font-bold text-cyan-300">{skill.name}</h3>
                        </div>
                        <div className="text-xs font-mono px-2 py-1 bg-cyan-900/40 rounded-full text-cyan-400">
                          {getLevelText(skill.level)}
                        </div>
                      </div>
                      
                      {/* Visualisation de données animée */}
                      <div className="mt-4 h-2 bg-cyan-800/30 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 2, delay: 0.3 }}
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                        />
                      </div>
                      
                      {/* Tags de métadonnées */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-2 py-1 bg-cyan-900/40 text-cyan-300 rounded-full text-xs">
                          {category.title}
                        </span>
                        <span className="px-2 py-1 bg-cyan-900/40 text-cyan-300 rounded-full text-xs">
                          {getLevelText(skill.level)}
                        </span>
                      </div>
                      
                      {/* Bouton pour voir les détails */}
                      <button className="w-full mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                        Cliquer pour voir les détails →
                      </button>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          </>
        ) : (
          /* Vue Réseau Neuronal */
          <div className="h-[70vh] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
            <NeuralNetwork />
          </div>
        )}

        {/* Légende de compétences en bas de page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 bg-cyan-900/20 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30"
        >
          <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">Niveaux d&apos;expertise</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-2">
                <span className="text-2xl">🟢</span>
              </div>
              <h3 className="text-lg font-semibold text-green-400">Débutant</h3>
              <p className="text-cyan-200/80 text-sm">0-49% - Connaissances de base</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-2">
                <span className="text-2xl">🔵</span>
              </div>
              <h3 className="text-lg font-semibold text-blue-400">Intermédiaire</h3>
              <p className="text-cyan-200/80 text-sm">50-69% - Expérience pratique</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mb-2">
                <span className="text-2xl">🟣</span>
              </div>
              <h3 className="text-lg font-semibold text-purple-400">Avancé</h3>
              <p className="text-cyan-200/80 text-sm">70-89% - Maîtrise technique</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 mb-2">
                <span className="text-2xl">🟠</span>
              </div>
              <h3 className="text-lg font-semibold text-amber-400">Expert</h3>
              <p className="text-cyan-200/80 text-sm">90-100% - Expertise approfondie</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Effet de surbrillance pour la compétence survolée */}
      <AnimatePresence>
        {hoveredSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center"
          >
            <div className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent opacity-10">
              {hoveredSkill}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        
        /* Animation de pulsation pour les éléments de compétence */
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 5px rgba(100, 200, 255, 0.5); }
          50% { box-shadow: 0 0 20px rgba(100, 200, 255, 0.8); }
          100% { box-shadow: 0 0 5px rgba(100, 200, 255, 0.5); }
        }
        
        .skill-item {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </div>
  )
}