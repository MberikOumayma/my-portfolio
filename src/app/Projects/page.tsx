'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Particles from 'react-particles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'
import type { Container } from 'tsparticles-engine'

// Définir les types TypeScript
interface ComplexityLevel {
  label: string;
  color: string;
}

interface ComplexityLevels {
  low: ComplexityLevel;
  medium: ComplexityLevel;
  high: ComplexityLevel;
  expert: ComplexityLevel;
  [key: string]: ComplexityLevel;
}

interface ProcessStep {
  step: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  category: string[];
  image: string;
  shortDescription: string;
  details: string;
  stack: string[];
  demoUrl: string;
  videoUrl?: string;
  status: string;
  complexity: string;
  metrics: { [key: string]: string };
  process: ProcessStep[];
  challenges: string;
  future: string;
  visualization: string;
  hasVideoDemo?: boolean;
  screenshotCount?: number;
  screenshotTypes?: string[];
}

interface ScreenshotModal {
  isOpen: boolean;
  projectId: string;
  screenshots: { id: number; src: string; alt: string }[];
  currentIndex: number;
}

export default function ProjectsPage() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [activeNav, setActiveNav] = useState('projects')
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [showSkillRadar, setShowSkillRadar] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [screenshotModal, setScreenshotModal] = useState<ScreenshotModal>({
    isOpen: false,
    projectId: '',
    screenshots: [],
    currentIndex: 0
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const networkCanvasRef = useRef<HTMLCanvasElement>(null)
  
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  const setVideoRef = (id: string) => (el: HTMLVideoElement | null) => {
    videoRefs.current[id] = el
  }

  // Fonction pour obtenir le dossier du projet
  const getProjectFolder = (id: string) => {
    const folderMap: { [key: string]: string } = {
      'projet1': 'projet1-newsbot',
      'projet2': 'projet2-novamedica',
      'projet3': 'projet3-face-recognition',
      'projet4': 'projet4-mlops-pipeline',
      'projet5': 'projet5-airline-dashboard',
      'projet6': 'projet6-choubikloubik',
      'lab1': 'lab1-emotion-audio',
      'lab2': 'lab2-telecom-churn'
    };
    return folderMap[id] || id;
  }

  // Fonction améliorée pour obtenir l'image principale d'un projet avec fallback
  const getProjectImage = (projectId: string, imageNumber: number = 1): string => {
    const projectFolder = getProjectFolder(projectId);
    
    // Déterminer les extensions à essayer en fonction du projet
    let extensions = ['png', 'jpg', 'jpeg'];
    
    // Projets avec images JPEG
    if (projectId === 'projet4' || projectId === 'projet5') {
      extensions = ['jpeg', 'jpg', 'png'];
    }
    // Projets avec images PNG
    else if (projectId === 'lab1') {
      extensions = ['png', 'jpg', 'jpeg'];
    }
    
    // Retourner le chemin avec la première extension (sera géré côté composant avec fallback)
    return `/screenshots/${projectFolder}/screenshot-${imageNumber}.${extensions[0]}`;
  }

  // Fonction améliorée pour ouvrir la modal des captures d'écran
  const openScreenshotModal = (projectId: string, screenshotCount: number = 6) => {
    const projectFolder = getProjectFolder(projectId);
    const screenshots = [];
    
    // Déterminer les extensions supportées par projet
    const getSupportedExtensions = (id: string): string[] => {
      switch(id) {
        case 'projet4':
        case 'projet5':
          return ['jpeg', 'jpg']; // Ces projets ont des JPEG
        case 'lab1':
          return ['png', 'jpg']; // Ce lab a des PNG et JPG
        default:
          return ['png', 'jpg', 'jpeg']; // Par défaut, essayer tous
      }
    };
    
    const extensions = getSupportedExtensions(projectId);
    
    // Générer les chemins d'accès avec les extensions supportées
    for (let i = 1; i <= screenshotCount; i++) {
      let imageFound = false;
      
      // Essayer chaque extension jusqu'à trouver une image qui existe
      for (const ext of extensions) {
        const potentialPath = `/screenshots/${projectFolder}/screenshot-${i}.${ext}`;
        
        // En production, on ajoute directement l'image
        screenshots.push({
          id: i,
          src: potentialPath,
          alt: `Capture d'écran ${i} - ${projectId}`,
        });
        imageFound = true;
        break; // On utilise la première extension de la liste
      }
      
      // Si aucune extension ne fonctionne, utiliser png comme fallback
      if (!imageFound) {
        screenshots.push({
          id: i,
          src: `/screenshots/${projectFolder}/screenshot-${i}.png`,
          alt: `Capture d'écran ${i} - ${projectId}`,
        });
      }
    }

    setScreenshotModal({
      isOpen: true,
      projectId,
      screenshots,
      currentIndex: 0
    });
  }

  // Fonction pour fermer la modal
  const closeScreenshotModal = () => {
    setScreenshotModal({
      isOpen: false,
      projectId: '',
      screenshots: [],
      currentIndex: 0
    });
  }

  // Navigation dans la modal
  const nextScreenshot = () => {
    setScreenshotModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.screenshots.length
    }));
  }

  const prevScreenshot = () => {
    setScreenshotModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.screenshots.length) % prev.screenshots.length
    }));
  }

  const goToScreenshot = (index: number) => {
    setScreenshotModal(prev => ({
      ...prev,
      currentIndex: index
    }));
  }

  // Fonction pour démarrer la vidéo directement
  const startVideo = (id: string) => {
    if (playingVideo) {
      // Arrêter la vidéo en cours
      const currentVideo = videoRefs.current[playingVideo]
      if (currentVideo) {
        currentVideo.pause()
        currentVideo.currentTime = 0
      }
    }
    
    // Démarrer la nouvelle vidéo
    setPlayingVideo(id)
    const video = videoRefs.current[id]
    if (video) {
      // Petit délai pour s'assurer que la vidéo est prête
      setTimeout(() => {
        video.play().catch(error => {
          console.log('Erreur de lecture vidéo:', error)
        })
      }, 100)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(async (container?: Container) => {
    // Optional: do something with the container
  }, [])

  const navItems = [
    { name: 'Neural Entrance', id: 'home', path: '/' },
    { name: 'Data Mind', id: 'about', path: '/DataMind' },
    { name: 'Project Gallery', id: 'projects', path: '/Projects' },
    { name: 'Professional Experience', id: 'stages', path: '/stages' },
    { name: 'Neural Skills', id: 'skills', path: '/competences' },
    { name: 'Future Predictions', id: 'skills', path: '/predictions' },
    { name: 'Contact', id: 'contact', path: '/contact' }
  ]

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'nlp', label: 'NLP' },
    { id: 'computer-vision', label: 'Computer Vision' },
    { id: 'dataviz', label: 'DataViz' },
    { id: 'prediction', label: 'Prédiction' },
    { id: 'audio', label: 'Audio Analysis' },
    { id: 'mlops', label: 'MLOps' }
  ]

  const complexityLevels: ComplexityLevels = {
    low: { label: 'Débutant', color: 'bg-green-500' },
    medium: { label: 'Intermédiaire', color: 'bg-yellow-500' },
    high: { label: 'Avancé', color: 'bg-red-500' },
    expert: { label: 'Expert', color: 'bg-purple-500' }
  }

  const getComplexity = (level: string): ComplexityLevel => {
    return complexityLevels[level] || complexityLevels.medium;
  }

  const projects: Project[] = [
    {
id: 'projet1',
title: 'NewsBot – Assistant IA de Personnalisation d\'Actualités',
category: ['NLP', 'deep-learning', 'RAG', 'IA'],
image: getProjectImage('projet1', 1),
shortDescription: 'Développement d\'un assistant intelligent intégrant NLP et Deep Learning pour la collecte, la personnalisation et la synthèse d\'actualités en temps réel, avec détection de fake news, génération automatique de podcasts et prédiction des tendances futures.',
details: 'NewsBot est une solution innovante conçue pour transformer la consommation d\'actualités grâce à l\'IA. Le système intègre un pipeline basé sur les Transformers pour la collecte et la synthèse automatique d\'articles, avec une couche de recommandation personnalisée permettant d\'adapter le contenu aux préférences des utilisateurs. Il inclut un module de détection des Fake News, fondé sur la comparaison multi-sources, ainsi qu\'une analyse des tendances à travers des nuages de mots, timelines dynamiques et prédiction des tendances futures grâce à des modèles de forecasting et de clustering thématique. Une fonctionnalité de Text-to-Speech permet en outre de générer des podcasts automatiques. Le backend est construit avec Flask/FastAPI, tandis que l\'interface utilisateur interactive repose sur React/Next.js, offrant une expérience moderne et fluide.',
stack: ['NLP', 'Deep Learning', 'Transformers', 'Fake News Detection', 'Text-to-Speech', 'Forecasting', 'Trend Prediction', 'Flask', 'FastAPI', 'React', 'Next.js', 'Data Visualization', 'Recommandation personnalisée', 'Podcast IA'],
demoUrl: '#',
videoUrl: undefined,
status: 'En cours',
complexity: 'expert',
metrics: { accuracy: '92%', precision: '89%', recall: '94%', f1: '91%' },
process: [
    { step: 'Collecte des données', description: 'Extraction et agrégation des articles depuis diverses sources' },
    { step: 'Nettoyage et prétraitement', description: 'Tokenization, suppression des stop words, stemming' },
    { step: 'Analyse et classification', description: 'Modèles Transformer pour catégorisation et résumé' },
    { step: 'Détection de fake news', description: 'Analyse comparative multi-sources et vérification de faits' },
    { step: 'Recommandation personnalisée', description: 'Système de profilage utilisateur et suggestions adaptatives' },
    { step: 'Prédiction des tendances futures', description: 'Utilisation de modèles de forecasting et clustering thématique pour anticiper les sujets émergents' },
    { step: 'Génération de podcasts', description: 'Synthèse vocale et création automatique de contenu audio' }
],

      challenges: 'La principale difficulté a été la gestion des différences structurelles entre les sources de données et l\'optimisation des modèles pour un temps de réponse rapide.',
      future: 'Intégration de l\'analyse multimodale (texte + images), amélioration du système de recommandation avec reinforcement learning, et extension à d\'autres langues.',
      visualization: 'line',
      hasVideoDemo: false,
      screenshotCount: 4,
      screenshotTypes: ['png', 'jpg']
    },
    {
      id: 'projet2',
      title: 'NovaMedica',
      category: ['NLP', 'LLM', 'IA'],
      image: getProjectImage('projet2', 1),
      shortDescription: 'Solution web et mobile basée sur l\'IA, permettant l\'extraction automatisée d\'informations médicales depuis des documents manuscrits et imprimés, avec des modules de recommandation de traitements personnalisés et de suggestion de médicaments similaires.',
      details: 'NovaMedica est une application intelligente conçue pour améliorer l\'efficacité et la fiabilité du traitement des données médicales. Elle intègre un pipeline d\'OCR avancé combinant Transformers et CNNs pour extraire avec précision les noms de médicaments, dosages et formes depuis des ordonnances manuscrites ou imprimées. À partir des données patients, le système exploite des modèles prédictifs (RNN, LSTM) pour générer des recommandations de traitements personnalisés. De plus, un module de suggestion de substituts thérapeutiques analyse les propriétés pharmacologiques et interactions afin d\'assurer des alternatives cohérentes. Développée avec Flask et MongoDB, la solution est conforme aux normes de sécurité et confidentialité GDPR/HIPAA, garantissant la protection des données médicales sensibles.',
      stack: ['OCR', 'Transformers', 'CNN', 'RNN', 'LSTM', 'LLM', 'NLP médical', 'Flask', 'MongoDB', 'Sécurité', 'GDPR', 'HIPAA'],
      demoUrl: '#',
      videoUrl: '/videos/novamedica-demo.mp4',
      status: 'Terminé',
      complexity: 'expert',
      metrics: { accuracy: '96%', precision: '95%', recall: '97%', f1: '96%' },
      process: [
        { step: 'Numérisation des documents', description: 'Acquisition et prétraitement des images d\'ordonnances' },
        { step: 'Extraction OCR avancée', description: 'Reconnaissance de texte avec modèles Transformer et CNN' },
        { step: 'Compréhension contextuelle', description: 'Analyse sémantique des relations entre médicaments et posologies' },
        { step: 'Recommandation personnalisée', description: 'Suggestion de traitements basée sur l\'historique patient' },
        { step: 'Vérification des interactions', description: 'Détection des contre-indications et interactions médicamenteuses' },
        { step: 'Génération d\'alertes', description: 'Système de notifications pour les professionnels de santé' }
      ],
      challenges: 'La reconnaissance d\'écriture manuscrite médicale présente des défis importants en raison des variations individuelles et des abréviations spécifiques au domaine.',
      future: 'Intégration avec les dossiers médicaux électroniques, extension aux ordonnances vétérinaires, et développement d\'un module de traduction multilingue.',
      visualization: 'bar',
      hasVideoDemo: true,
      screenshotCount: 5,
      screenshotTypes: ['png', 'jpg']
    },
    {
      id: 'projet3',
      title: 'Face Recognition with Real-Time Database',
      category: ['computer-vision', 'IA'],
      image: getProjectImage('projet3', 1),
      shortDescription: 'Système de reconnaissance faciale en temps réel connecté à Supabase pour la gestion d\'accès intelligente, la présence automatisée et l\'intégration IoT sécurisée.',
      details: 'Ce projet combine l\'intelligence artificielle et une infrastructure moderne pour développer un système de reconnaissance faciale intelligent et réactif. À l\'aide de Python, OpenCV et la librairie face_recognition (Dlib), le système identifie les visages via webcam en temps réel. Les données faciales et les logs d\'accès sont stockés dans Supabase, une plateforme offrant PostgreSQL, API REST et synchronisation temps réel. Grâce à l\'API Supabase et aux bibliothèques Requests / Supabase-py, les mises à jour s\'effectuent automatiquement, permettant une intégration fluide dans des cas d\'usage tels que le contrôle d\'accès, la gestion de présence ou encore des applications IoT sécurisées.',
      stack: ['Python', 'OpenCV', 'Dlib', 'face_recognition', 'Supabase', 'PostgreSQL', 'API REST'],
      demoUrl: '#',
      videoUrl: '/videos/face-recognition-demo.mp4',
      status: 'Terminé',
      complexity: 'high',
      metrics: { accuracy: '98%', precision: '97%', recall: '96%', f1: '97%' },
      process: [
        { step: 'Capture d\'image', description: 'Acquisition des visages via webcam en temps réel' },
        { step: 'Prétraitement', description: 'Normalisation et amélioration de la qualité d\'image' },
        { step: 'Extraction des caractéristiques', description: 'Identification des points clés du visage' },
        { step: 'Reconnaissance', description: 'Comparaison avec la base de données de référence' },
        { step: 'Stockage des données', description: 'Enregistrement dans Supabase avec horodatage' },
        { step: 'Interface de monitoring', description: 'Visualisation des accès et statistiques' }
      ],
      challenges: 'La gestion des variations d\'éclairage et des angles de prise de vue a nécessité un prétraitement avancé des images.',
      future: 'Intégration de la détection de masques faciaux, reconnaissance des émotions, et déploiement sur edge devices.',
      visualization: 'face',
      hasVideoDemo: true,
      screenshotCount: 6,
      screenshotTypes: ['png', 'jpg']
    },
    {
      id: 'projet4',
      title: 'MLOps Pipeline for Telecom Churn Prediction',
      category: ['mlops', 'prediction', 'MachineLearning'],
      image: getProjectImage('projet4', 1),
      shortDescription: 'Mise en place d\'un pipeline MLOps complet pour automatiser le cycle de vie du projet Télécom Churn Prediction, intégrant CI/CD, Docker, Jenkins et Kubernetes.',
      details: 'Ce projet vise à industrialiser le modèle de churn prediction grâce à un pipeline MLOps robuste. L\'architecture mise en place couvre l\'ensemble du cycle de vie : préparation des données, entraînement du modèle, tests, déploiement et monitoring. Les étapes de CI/CD ont été automatisées via Jenkins и Makefile, tandis que l\'environnement d\'exécution a été conteneurisé avec Docker pour garantir la portabilité. Le déploiement a ensuite été orchestré sur Kubernetes, assurant scalabilité et haute disponibilité. Ce pipeline MLOps permet de réduire les délais de mise en production, de fiabiliser le déploiement des modèles et d\'assurer une meilleure traçabilité des versions, rending le système prédictif plus robuste et exploitable dans un contexte réel.',
      stack: ['MLOps', 'CI/CD', 'Jenkins', 'Docker', 'Kubernetes', 'Makefile', 'Machine Learning Lifecycle', 'Model Deployment', 'Model Monitoring', 'Churn Prediction', 'Automation', 'Scalability'],
      demoUrl: '#',
      videoUrl: undefined,
      status: 'Terminé',
      complexity: 'expert',
      metrics: { accuracy: '89%', precision: '91%', recall: '87%', f1: '89%' },
      process: [
        { step: 'Ingestion des données', description: 'Collecte et agrégation des données clients' },
        { step: 'Feature engineering', description: 'Création de variables prédictives pertinentes' },
        { step: 'Entraînement des modèles', description: 'Expérimentation de différents algorithmes' },
        { step: 'Validation et tests', description: 'Évaluation rigoureuse des performances' },
        { step: 'Déploiement automatisé', description: 'Mise en production via pipeline CI/CD' },
        { step: 'Monitoring continu', description: 'Surveillance des performances en temps réel' }
      ],
      challenges: 'La principale difficulté a été la création d\'un pipeline robuste capable de gérer les différentes versions de modèles et de garantir la reproductibilité des expériences.',
      future: 'Intégration de l\'explicabilité des modèles (XAI), automatisation de la détection de drift, et extension à d\'autres cas d\'usage.',
      visualization: 'pipeline',
      hasVideoDemo: false,
      screenshotCount: 4,
      screenshotTypes: ['jpeg', 'jpg']
    },
    {
      id: 'projet5',
      title: 'Airline Business Intelligence Dashboard',
      category: ['dataviz', 'BusinessIntelligence', 'PowerBI'],
      image: getProjectImage('projet5', 1),
      shortDescription: 'Développement d\'un dashboard Power BI de 6 pages pour une compagnie aérienne, offrant des analyses approfondies sur la fidélité client, l\'activité des vols et les tendances temporelles.',
      details: 'Ce projet Power BI marque une étape importante dans mon parcours en data analytics, avec la création d\'un dashboard interactif et robuste destiné à un client du secteur aérien. Construit en collaboration avec une équipe dédiée, le tableau de bord a été structuré en six sections clés : Home (Vue exécutive avec KPI stratégiques), Customer Analysis (Analyse des données démographiques et comportementales), Customer Loyalty (Mesure de la fidélité et des annulations), Loyalty Segmentation (Segmentation selon l\'engagement et la valeur), Flight Activity Analysis (Étude de la fréquence et de la distance des vols) et Temporal Analysis (Exploration des tendances saisonnières et temporelles). Ce tableau de bord aide la compagnie à identifier des leviers de croissance, optimiser ses opérations et cibler ses stratégies de fidélisation grâce à une visualisation claire et exploitable des données.',
      stack: ['Power BI', 'Business Intelligence', 'Data Visualization', 'Customer Loyalty', 'Flight Activity', 'Temporal Analysis', 'KPI', 'Data Analytics', 'Dashboard Design', 'Customer Segmentation'],
      demoUrl: '#',
      videoUrl: undefined,
      status: 'Terminé',
      complexity: 'medium',
      metrics: { satisfaction: '95%', performance: '98%', adoption: '90%', impact: '87%' },
      process: [
        { step: 'Analyse des besoins', description: 'Identification des KPIs et métriques clés' },
        { step: 'Conception de l\'architecture', description: 'Design du dashboard et des interactions' },
        { step: 'ETL et modélisation', description: 'Transformation et préparation des données' },
        { step: 'Développement des visualisations', description: 'Création des graphiques et indicateurs' },
        { step: 'Validation et tests utilisateurs', description: 'Ajustements basés sur les retours' },
        { step: 'Déploiement et formation', description: 'Mise en production et formation des utilisateurs' }
      ],
      challenges: 'L\'intégration de sources de données hétérogènes et la conception d\'une interface à la fois complète et intuitive ont représenté les défis majeurs.',
      future: 'Intégration de prédictions en temps réel, alertes automatisées, et extension mobile.',
      visualization: 'dashboard',
      hasVideoDemo: false,
      screenshotCount: 6,
      screenshotTypes: ['jpeg', 'jpg']
    },
    {
      id: 'projet6',
      title: 'ChoubikLoubik',
      category: ['Symfony', 'JavaFX', 'fullstack', 'web', 'desktop'],
      image: getProjectImage('projet6', 1),
      shortDescription: 'Application web et desktop de restauration intelligente permettant la gestion centralisée des commandes, réservations et livraisons, avec intégration d\'un assistant vocal et d\'un paiement en ligne sécurisé.',
      details: 'ChoubikLoubik est une solution innovante développée pour moderniser l\'expérience de gestion dans le secteur de la restauration. L\'application combine une interface desktop en JavaFX et un backend web en Symfony pour offrir aux restaurateurs une gestion fluide des plats, commandes et réservations en temps réel. Elle intègre un assistant vocal interactif pour simplifier la prise de commande ainsi qu\'un système de paiement sécurisé via l\'API Stripe. De plus, un module de suivi dynamique des livraisons, basé sur une carte interactive, optimise les trajets et améliore la satisfaction client. Ce projet a été distingué lors du Bal des Projets 2024, obtenant la 2ᵉ place parmi les meilleures innovations étudiantes.',
      stack: ['JavaFX', 'Symfony', 'Assistant vocal', 'Stripe API', 'UML Modeling', 'Scrum'],
      demoUrl: '#',
      videoUrl: '/videos/choubikloubik-demo.mp4',
      status: 'Terminé',
      complexity: 'high',
      metrics: { efficiency: '40%', satisfaction: '92%', errors: '-60%', speed: '35%' },
      process: [
        { step: 'Analyse des besoins', description: 'Identification des processus métier à optimiser' },
        { step: 'Conception UX/UI', description: 'Design d\'interfaces utilisateur intuitives' },
        { step: 'Développement frontend', description: 'Création de l\'application desktop avec JavaFX' },
        { step: 'Développement backend', description: 'Implémentation de l\'API avec Symfony' },
        { step: 'Intégration des services', description: 'Connexion avec Stripe et services vocaux' },
        { step: 'Tests et déploiement', description: 'Validation et mise en production' }
      ],
      challenges: 'La synchronisation en temps réel entre l\'application desktop et le backend web a nécessité une architecture soigneusement conçue.',
      future: 'Application mobile dédiée, intégration de l\'IA pour la prédiction de commandes, et expansion à d\'autres secteurs.',
      visualization: 'restaurant',
      hasVideoDemo: true,
      screenshotCount: 5,
      screenshotTypes: ['png', 'jpg']
    }
  ]

  const labs: Project[] = [
    {
      id: 'lab1',
      title: 'Emotion Audio Recognition Lab',
      category: ['audio', 'prediction', 'DeepLearning'],
      image: getProjectImage('lab1', 1),
      shortDescription: 'Projet de reconnaissance des émotions à partir d\'audio, combinant Deep Learning, spectrogrammes, augmentation de données audio et génération de données synthétiques par diffusion.',
      details: 'Emotion Audio Recognition Lab est un projet avancé de Speech Emotion Recognition (SER), utilisant un pipeline complet basé sur Python, TensorFlow, Librosa et Scikit-learn. Les données audio sont enrichies par des techniques d\'augmentation (injection de bruit, changement de hauteur, time stretching) avant d\'être converties en représentations visuelles telles que les Mel-spectrogrammes et les MFCCs. Les modèles entraînés incluent des CNNs, ResNet50 et des architectures hybrides, permettant une meilleure capture des patterns émotionnels. Pour pallier le manque de données, des modèles de diffusion génèrent des exemples synthétiques réalistes. Enfin, la performance est mesurée par des métriques rigoureuses (Précision, Rappel, F1-score, Matrice de confusion), assurant une évaluation robuste du système.',
      stack: ['TensorFlow', 'Librosa', 'Scikit-learn', 'Audio Augmentation', 'Mel-spectrogram', 'MFCC', 'CNN', 'ResNet50', 'Hybrid Models', 'Diffusion Models', 'Speech Emotion Recognition', 'Deep Learning', 'Classification audio'],
      demoUrl: '#',
      videoUrl: undefined,
      status: 'Terminé',
      complexity: 'high',
      metrics: { accuracy: '87%', precision: '85%', recall: '88%', f1: '86%' },
      process: [
        { step: 'Collecte des données audio', description: 'Acquisition d\'échantillons vocaux avec différentes émotions' },
        { step: 'Prétraitement audio', description: 'Nettoyage du signal, normalisation, suppression du bruit' },
        { step: 'Extraction de features', description: 'Calcul des MFCC, spectrogrammes, et autres caractéristiques acoustiques' },
        { step: 'Augmentation des données', description: 'Techniques de synthèse et transformation pour enrichir le dataset' },
        { step: 'Entraînement des modèles', description: 'Expérimentation avec CNN, RNN et architectures hybrides' },
        { step: 'Évaluation et optimisation', description: 'Validation croisée et réglage des hyperparamètres' }
      ],
      challenges: 'La variabilité inter-individuelle dans l\'expression des émotions et le bruit environnemental ont constitué les principaux défis à surmonter.',
      future: 'Extension à d\'autres langues, intégration en temps réel, et combinaison avec l\'analyse faciale pour une reconnaissance multimodale.',
      visualization: 'wave',
      hasVideoDemo: false,
      screenshotCount: 7,
      screenshotTypes: ['png', 'jpg']
    },
    {
      id: 'lab2',
      title: 'Télécom Churn Prediction',
      category: ['prediction', 'MachineLearning', 'classification'],
      image: getProjectImage('lab2', 1),
      shortDescription: 'Projet de prédiction du churn client dans le secteur des télécommunications, utilisant le Machine Learning et déployé via Flask pour fournir des prédictions en temps réel.',
      details: 'Le projet Télécom Churn Prediction a pour objectif d\'anticiper la probabilité qu\'un client se désabonne d\'un service télécom. À partir de données historiques sur le comportement des clients, le système applique des techniques de Machine Learning (Scikit-learn) afin d\'identifiers les profils les plus à risque. L\'application a été déployée avec Flask, offrant une interface web interactive (HTML/CSS/JS) qui permet aux entreprises d\'obtenir des prédictions en temps réel. En complément, des analyses exploratoires et des visualisations (Matplotlib, Seaborn) permettent d\'interpréter les résultats et d\'orienter les actions de rétention. Ce projet fournit un outil stratégique pour améliorer la fidélisation client et réduire le taux de churn.',
      stack: ['Python', 'Flask', 'Scikit-learn', 'Pandas', 'NumPy', 'Machine Learning', 'Classification', 'Data Visualization', 'Matplotlib', 'Seaborn', 'HTML/CSS/JS', 'Churn Prediction', 'Télécommunications', 'Customer Retention'],
      demoUrl: '#',
      videoUrl: '/videos/churn-demo.mp4',
      status: 'Terminé',
      complexity: 'medium',
      metrics: { accuracy: '83%', precision: '81%', recall: '85%', f1: '83%' },
      process: [
        { step: 'Analyse exploratoire', description: 'Identification des facteurs influençant le churn' },
        { step: 'Feature engineering', description: 'Création de variables prédictives pertinentes' },
        { step: 'Entraînement des modèles', description: 'Expérimentation avec différents algorithmes' },
        { step: 'Optimisation', description: 'Réglage des hyperparamètres et sélection du meilleur modèle' },
        { step: 'Développement de l\'application', description: 'Création de l\'interface web avec Flask' },
        { step: 'Déploiement', description: 'Mise en production et tests utilisateurs' }
      ],
      challenges: 'Le déséquilibre des classes (peu de clients qui partent) a nécessité des techniques spécifiques de sampling et d\'évaluation.',
      future: 'Intégration de données temps réel, alertes automatisées, et extension à d\'autres secteurs.',
      visualization: 'churn',
      hasVideoDemo: true,
      screenshotCount: 4,
      screenshotTypes: ['png', 'jpg']
    }
  ]

  const skillData = [
    { skill: 'NLP', level: 90 },
    { skill: 'Computer Vision', level: 85 },
    { skill: 'Deep Learning', level: 95 },
    { skill: 'Data Visualization', level: 80 },
    { skill: 'MLOps', level: 75 },
    { skill: 'Audio Processing', level: 70 },
    { skill: 'Reinforcement Learning', level: 65 }
  ]

  // Composant pour afficher les captures d'écran dans la carte
  const ScreenshotCarousel = ({ projectId, screenshotCount = 6 }: { projectId: string, screenshotCount?: number }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageError, setImageError] = useState(false);
    
    const currentImage = getProjectImage(projectId, currentIndex + 1);

    const getPlaceholderColor = (id: string) => {
      const colors = {
        'projet1': 'from-blue-600/20 to-cyan-600/20',
        'projet2': 'from-green-600/20 to-emerald-600/20', 
        'projet3': 'from-purple-600/20 to-pink-600/20',
        'projet4': 'from-orange-600/20 to-red-600/20',
        'projet5': 'from-teal-600/20 to-blue-600/20',
        'projet6': 'from-violet-600/20 to-purple-600/20',
        'lab1': 'from-amber-600/20 to-yellow-600/20',
        'lab2': 'from-rose-600/20 to-pink-600/20'
      };
      return colors[id as keyof typeof colors] || 'from-cyan-600/20 to-purple-600/20';
    };

    const getProjectIcon = (id: string) => {
      const icons = {
        'projet1': '📰',
        'projet2': '💊',
        'projet3': '👤',
        'projet4': '⚙️',
        'projet5': '📊',
        'projet6': '🍽️',
        'lab1': '🎵',
        'lab2': '📞'
      };
      return icons[id as keyof typeof icons] || '📁';
    };

    // Navigation entre les images
    const nextImage = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setCurrentIndex((prev) => (prev + 1) % screenshotCount);
      setImageError(false);
    };

    const prevImage = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setCurrentIndex((prev) => (prev - 1 + screenshotCount) % screenshotCount);
      setImageError(false);
    };

    return (
      <div 
        className={`h-40 bg-gradient-to-r ${getPlaceholderColor(projectId)} rounded-xl mb-4 overflow-hidden relative cursor-pointer`}
        onClick={() => openScreenshotModal(projectId, screenshotCount)}
      >
        {/* Image réelle */}
        {!imageError ? (
          <div className="w-full h-full relative">
            <Image
              src={currentImage}
              alt={`Capture ${currentIndex + 1} - ${projectId}`}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
            {/* Overlay de navigation */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-between p-2">
              <button 
                onClick={(e) => prevImage(e)}
                className="w-8 h-8 bg-black/50 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              >
                ‹
              </button>
              <button 
                onClick={(e) => nextImage(e)}
                className="w-8 h-8 bg-black/50 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              >
                ›
              </button>
            </div>
            
            {/* Indicateur de position */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {Array.from({ length: Math.min(screenshotCount, 5) }).map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex % 5 ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          // Fallback si l'image n'existe pas
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">{getProjectIcon(projectId)}</div>
              <div className="text-cyan-300 font-semibold capitalize">{projectId.replace('projet', 'Projet ').replace('lab', 'Lab ')}</div>
              <div className="text-cyan-300/70 text-sm mt-1">Cliquez pour voir {screenshotCount} captures</div>
            </div>
          </div>
        )}
        
        {/* Bouton d'action */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 hover:opacity-100 transition-opacity duration-300">
            📸 Voir les captures
          </div>
        </div>
      </div>
    );
  };

  // Composant Modal pour les captures d'écran - AVEC CURSEUR BASIQUE
  const ScreenshotModal = () => {
    if (!screenshotModal.isOpen) return null;

    const currentScreenshot = screenshotModal.screenshots[screenshotModal.currentIndex];
    const projectTitle = [...projects, ...labs].find(p => p.id === screenshotModal.projectId)?.title || 'Projet';

    // Référence pour la modal
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Gestionnaire de clic amélioré
    const handleBackdropClick = (e: React.MouseEvent) => {
      // Vérifier si le clic est sur le backdrop (et non sur le contenu de la modal)
      if (modalRef.current && e.target === modalRef.current) {
        closeScreenshotModal();
      }
    };

    return (
      <div 
        ref={modalRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg cursor-auto" // cursor-auto pour le curseur basique
        onClick={handleBackdropClick}
      >
        <div 
          ref={contentRef}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden cursor-auto" // cursor-auto pour le curseur basique
          onClick={(e) => e.stopPropagation()} // Empêcher la propagation du clic
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-cyan-300">{projectTitle}</h3>
            <button
              onClick={closeScreenshotModal}
              className="text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200 p-1 rounded-full hover:bg-gray-700 w-8 h-8 flex items-center justify-center cursor-pointer" // cursor-pointer pour le bouton
            >
              ×
            </button>
          </div>

          <div className="relative bg-black rounded-lg overflow-hidden mb-4">
            {/* Image principale */}
            <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
              <Image
                src={currentScreenshot.src}
                alt={currentScreenshot.alt}
                width={800}
                height={450}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* Navigation */}
            {screenshotModal.screenshots.length > 1 && (
              <>
                <button
                  onClick={prevScreenshot}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all z-10 cursor-pointer" // cursor-pointer pour les boutons de navigation
                >
                  ‹
                </button>
                <button
                  onClick={nextScreenshot}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all z-10 cursor-pointer" // cursor-pointer pour les boutons de navigation
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Indicateurs */}
          {screenshotModal.screenshots.length > 1 && (
            <div className="flex justify-center space-x-2 mb-4">
              {screenshotModal.screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToScreenshot(index)}
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                    index === screenshotModal.currentIndex ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Informations */}
          <div className="text-center">
            <div className="text-cyan-300 font-semibold">
              Capture {screenshotModal.currentIndex + 1} sur {screenshotModal.screenshots.length}
            </div>
            <div className="text-gray-400 text-sm">
              {currentScreenshot.alt}
            </div>
          </div>

          {/* Contrôles clavier */}
          <div className="text-center text-gray-500 text-sm mt-4">
            Utilisez les flèches ← → pour naviguer ou Échap pour fermer
          </div>
        </div>
      </div>
    );
  };

  // Gestion des touches du clavier pour la modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!screenshotModal.isOpen) return;

      switch (e.key) {
        case 'Escape':
          closeScreenshotModal();
          break;
        case 'ArrowLeft':
          prevScreenshot();
          break;
        case 'ArrowRight':
          nextScreenshot();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screenshotModal.isOpen]);

  // Animation des particules
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
    }))
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        if (particle.x > canvas.width || particle.x < 0) {
          particle.speedX = -particle.speedX
        }
        if (particle.y > canvas.height || particle.y < 0) {
          particle.speedY = -particle.speedY
        }
        
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })
      
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)'
      ctx.lineWidth = 0.5
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Animation du réseau de neurones
  useEffect(() => {
    const canvas = networkCanvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    const layers = [
      { neurons: 4, x: 0.2, values: Array(4).fill(0).map(() => Math.random()) },
      { neurons: 6, x: 0.5, values: Array(6).fill(0).map(() => Math.random()) },
      { neurons: 4, x: 0.8, values: Array(4).fill(0).map(() => Math.random()) }
    ]
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)'
      ctx.lineWidth = 1
      
      for (let l = 0; l < layers.length - 1; l++) {
        const layer1 = layers[l]
        const layer2 = layers[l + 1]
        
        for (let i = 0; i < layer1.neurons; i++) {
          for (let j = 0; j < layer2.neurons; j++) {
            const x1 = layer1.x * canvas.width
            const y1 = (i + 1) * canvas.height / (layer1.neurons + 1)
            const x2 = layer2.x * canvas.width
            const y2 = (j + 1) * canvas.height / (layer2.neurons + 1)
            
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          }
        }
      }
      
      layers.forEach(layer => {
        for (let i = 0; i < layer.neurons; i++) {
          const x = layer.x * canvas.width
          const y = (i + 1) * canvas.height / (layer.neurons + 1)
          const radius = 5 + layer.values[i] * 10
          
          layer.values[i] += (Math.random() - 0.5) * 0.1
          layer.values[i] = Math.max(0, Math.min(1, layer.values[i]))
          
          ctx.fillStyle = `rgba(100, 200, 255, ${0.3 + layer.values[i] * 0.7})`
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category.includes(activeFilter))
  
  const filteredLabs = activeFilter === 'all' 
    ? labs 
    : labs.filter(lab => lab.category.includes(activeFilter))

  const toggleDetails = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0a0a18] to-[#1a1a2e] text-white overflow-hidden relative ${screenshotModal.isOpen ? 'cursor-auto' : 'cursor-none'}`}>
      {/* Curseur personnalisé - SEULEMENT QUAND LA MODAL EST FERMÉE */}
      {!screenshotModal.isOpen && (
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
          </div>
        </div>
      )}

      {/* Animation de flux de données */}
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

      {/* Particles background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 120,
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: ["#00a2ff", '#0066ff', '#a855f7'] },
            shape: { type: "circle" },
            opacity: { value: 0.7 },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 1.5, direction: "none", outModes: { default: "out" } },
            links: {
              enable: true, distance: 150, color: { value: "#00a2ff" }, 
              opacity: 0.4, width: 1
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              grab: { distance: 140, links: { opacity: 0.8 } },
              push: { quantity: 4 },
            },
          },
          detectRetina: true,
        }}
      />

      <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-40" />
      <canvas ref={networkCanvasRef} className="fixed inset-0 z-0 opacity-20" />

      {/* Barre de navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-2xl border-b border-cyan-500/30"
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center h-20">
            <div className="flex space-x-10">
              {navItems.map((item, index) => (
                <motion.div key={item.id} className="relative" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
                  <Link href={item.path} className={`text-cyan-300/90 hover:text-cyan-400 transition-colors font-medium text-sm relative py-2 px-1 ${activeNav === item.id ? 'text-cyan-400' : ''}`}>
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

      {/* Modal des captures d'écran - AVEC CURSEUR BASIQUE */}
      {screenshotModal.isOpen && <ScreenshotModal />}

      {/* Contenu principal */}
      <div className="relative z-20 container mx-auto px-4 py-16 pt-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Projects Gallery
          </h1>
          <p className="text-cyan-300 font-mono text-xl max-w-3xl mx-auto">
            Exploration d'idées innovantes en Data Science et Intelligence Artificielle
          </p>
        </motion.div>

        {/* Contrôles supplémentaires */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <motion.button onClick={() => setShowSkillRadar(!showSkillRadar)} className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="mr-2">📊</span> 
            {showSkillRadar ? 'Masquer les compétences' : 'Voir mes compétences'}
          </motion.button>
          
          <motion.button onClick={() => setShowTimeline(!showTimeline)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="mr-2">⏳</span> 
            {showTimeline ? 'Masquer la timeline' : 'Voir la timeline'}
          </motion.button>
        </div>

        {/* Filtres */}
        <motion.div className="flex flex-wrap justify-center gap-4 mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {filters.map(filter => (
            <motion.button key={filter.id} onClick={() => setActiveFilter(filter.id)} className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${activeFilter === filter.id ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800/40'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {filter.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Section Projets */}
        <motion.section className="mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <h2 className="text-3xl font-bold text-cyan-400 mb-8 flex items-center justify-center">
            <span className="mr-3">🚀</span>Projets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map(project => (
              <motion.div key={project.id} className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/40 shadow-2xl shadow-cyan-500/10 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ y: -5 }}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-cyan-300">{project.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'Terminé' ? 'bg-green-900/40 text-green-300' : 'bg-blue-900/40 text-blue-300'}`}>
                      {project.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexity(project.complexity).color}/40 text-${getComplexity(project.complexity).color.split('-')[1]}-300`}>
                      {getComplexity(project.complexity).label}
                    </span>
                  </div>
                </div>
                
                {/* Affichage selon le type de démo */}
                {project.hasVideoDemo && project.videoUrl ? (
                  // VIDÉO - Lecture automatique au clic
                  <div className="h-40 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-xl mb-4 overflow-hidden relative cursor-pointer" onClick={() => startVideo(project.id)}>
                    <video
                      ref={setVideoRef(project.id)}
                      className="w-full h-full object-cover"
                      poster={project.image}
                      controls={playingVideo === project.id}
                      muted
                      loop
                    >
                      <source src={project.videoUrl} type="video/mp4" />
                    </video>
                    {playingVideo !== project.id && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-16 h-16 bg-cyan-500/80 hover:bg-cyan-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ) : project.id === 'projet1' ? (
                  // NewsBot - pas de démo
                  <div className="h-40 flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl mb-4">
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">🚧</div>
                      <div className="text-cyan-300 font-semibold">Démo pas encore disponible</div>
                      <div className="text-cyan-300/70 text-sm">Projet en cours de développement</div>
                    </div>
                  </div>
                ) : (
                  // CAPTURES D'ÉCRAN - Cliquable pour ouvrir la modal
                  <ScreenshotCarousel projectId={project.id} screenshotCount={project.screenshotCount} />
                )}
                
                <p className="text-cyan-100/80 mb-4">{project.shortDescription}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.category.map(cat => (
                    <span key={cat} className="px-2 py-1 bg-cyan-900/40 text-cyan-300 rounded-full text-xs">
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {project.metrics && Object.entries(project.metrics).map(([key, value]) => (
                    <div key={key} className="bg-cyan-900/30 rounded-lg p-2 text-center">
                      <div className="text-xs text-cyan-300 uppercase">{key}</div>
                      <div className="text-lg font-bold text-cyan-100">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mb-4">
                  <motion.button onClick={() => toggleDetails(project.id)} className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {expandedItems[project.id] ? 'Masquer les détails' : 'Voir les détails'}
                  </motion.button>
                  
                  {project.hasVideoDemo && project.videoUrl ? (
                    <motion.button onClick={() => startVideo(project.id)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <span className="mr-2">🎬</span> Voir Démo
                    </motion.button>
                  ) : project.id === 'projet1' ? (
                    <motion.button className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg font-medium text-white opacity-50 cursor-not-allowed flex items-center" whileHover={{ scale: 1 }} whileTap={{ scale: 1 }}>
                      <span className="mr-2">🚧</span> Pas de démo
                    </motion.button>
                  ) : (
                    <motion.button 
                      onClick={() => openScreenshotModal(project.id, project.screenshotCount)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center" 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-2">🖼️</span> Voir Captures
                    </motion.button>
                  )}
                </div>

                <AnimatePresence>
                  {expandedItems[project.id] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="pt-4 border-t border-cyan-500/20">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-2">Détails du projet:</h4>
                        <p className="text-cyan-100/80 mb-4">{project.details}</p>
                        
                        <h4 className="text-lg font-semibold text-cyan-400 mb-2">Processus de développement:</h4>
                        <div className="mb-4">
                          {project.process.map((step, i) => (
                            <div key={i} className="mb-2 flex">
                              <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center mr-3 flex-shrink-0">
                                <span className="text-cyan-300 font-bold">{i + 1}</span>
                              </div>
                              <div>
                                <div className="font-semibold text-cyan-300">{step.step}</div>
                                <div className="text-cyan-100/70 text-sm">{step.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <h4 className="text-lg font-semibold text-cyan-400 mb-2">Défis rencontrés:</h4>
                        <p className="text-cyan-100/80 mb-4">{project.challenges}</p>
                        
                        <h4 className="text-lg font-semibold text-cyan-400 mb-2">Améliorations futures:</h4>
                        <p className="text-cyan-100/80 mb-4">{project.future}</p>
                        
                        <h4 className="text-lg font-semibold text-cyan-400 mb-2">Technologies utilisées:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.stack.map(tech => (
                            <span key={tech} className="px-3 py-1 bg-cyan-900/40 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section Labs */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <h2 className="text-3xl font-bold text-purple-400 mb-8 flex items-center justify-center">
            <span className="mr-3">🔬</span>Labs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredLabs.map(lab => (
              <motion.div key={lab.id} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/40 shadow-2xl shadow-purple-500/10 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ y: -5 }}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-purple-300">{lab.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${lab.status === 'Terminé' ? 'bg-green-900/40 text-green-300' : 'bg-blue-900/40 text-blue-300'}`}>
                      {lab.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexity(lab.complexity).color}/40 text-${getComplexity(lab.complexity).color.split('-')[1]}-300`}>
                      {getComplexity(lab.complexity).label}
                    </span>
                  </div>
                </div>
                
                {/* Affichage selon le type de démo pour les labs */}
                {lab.hasVideoDemo && lab.videoUrl ? (
                  // VIDÉO - Lecture automatique au clic
                  <div className="h-40 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl mb-4 overflow-hidden relative cursor-pointer" onClick={() => startVideo(lab.id)}>
                    <video
                      ref={setVideoRef(lab.id)}
                      className="w-full h-full object-cover"
                      poster={lab.image}
                      controls={playingVideo === lab.id}
                      muted
                      loop
                    >
                      <source src={lab.videoUrl} type="video/mp4" />
                    </video>
                    {playingVideo !== lab.id && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-16 h-16 bg-purple-500/80 hover:bg-purple-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // CAPTURES D'ÉCRAN
                  <ScreenshotCarousel projectId={lab.id} screenshotCount={lab.screenshotCount} />
                )}
                
                <p className="text-cyan-100/80 mb-4">{lab.shortDescription}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {lab.category.map(cat => (
                    <span key={cat} className="px-2 py-1 bg-purple-900/40 text-purple-300 rounded-full text-xs">
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {lab.metrics && Object.entries(lab.metrics).map(([key, value]) => (
                    <div key={key} className="bg-purple-900/30 rounded-lg p-2 text-center">
                      <div className="text-xs text-purple-300 uppercase">{key}</div>
                      <div className="text-lg font-bold text-purple-100">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mb-4">
                  <motion.button onClick={() => toggleDetails(lab.id)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {expandedItems[lab.id] ? 'Masquer les détails' : 'Voir les détails'}
                  </motion.button>
                  
                  {lab.hasVideoDemo && lab.videoUrl ? (
                    <motion.button onClick={() => startVideo(lab.id)} className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <span className="mr-2">🎬</span> Voir Démo
                    </motion.button>
                  ) : (
                    <motion.button 
                      onClick={() => openScreenshotModal(lab.id, lab.screenshotCount)}
                      className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center" 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-2">🖼️</span> Voir Captures
                    </motion.button>
                  )}
                </div>

                <AnimatePresence>
                  {expandedItems[lab.id] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="pt-4 border-t border-purple-500/20">
                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Détails du lab:</h4>
                        <p className="text-cyan-100/80 mb-4">{lab.details}</p>
                        
                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Processus de développement:</h4>
                        <div className="mb-4">
                          {lab.process.map((step, i) => (
                            <div key={i} className="mb-2 flex">
                              <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center mr-3 flex-shrink-0">
                                <span className="text-purple-300 font-bold">{i + 1}</span>
                              </div>
                              <div>
                                <div className="font-semibold text-purple-300">{step.step}</div>
                                <div className="text-cyan-100/70 text-sm">{step.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Défis rencontrés:</h4>
                        <p className="text-cyan-100/80 mb-4">{lab.challenges}</p>
                        
                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Améliorations futures:</h4>
                        <p className="text-cyan-100/80 mb-4">{lab.future}</p>
                        
                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Technologies utilisées:</h4>
                        <div className="flex flex-wrap gap-2">
                          {lab.stack.map(tech => (
                            <span key={tech} className="px-3 py-1 bg-purple-900/40 text-purple-300 rounded-full text-sm border border-purple-500/30">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      <motion.footer className="text-center py-12 text-cyan-500/50 text-sm relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
        <p>Designed with ❤️ and 🤖 • © 2024 Mberik Oumayma</p>
      </motion.footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
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