'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Star, Lock, Unlock, Mail, Gift, Sparkles, RefreshCw, Trophy, Heart, ArrowLeft, ChevronRight, Zap, Flame, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

// Types
type GameState = 'landing' | 'letters' | 'game' | 'letter' | 'surprise'
type Particle = { x: number; y: number; vx: number; vy: number; size: number; color: string; rotation: number }

// Refined color palette
const colors = {
  primary: '#7C3AED',
  primaryLight: '#A855F7',
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  background: '#FAFAF9',
  text: '#1C1917',
  textLight: '#57534E',
  glass: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(124, 58, 237, 0.15)'
}

// Confetti component for celebrations
const Confetti = ({ active }: { active: boolean }) => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: -10,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: ['#7C3AED', '#F59E0B', '#A855F7', '#FBBF24', '#EC4899'][Math.floor(Math.random() * 5)],
        rotation: Math.random() * 360
      }))
      setParticles(newParticles)
    }
  }, [active])

  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: `${p.x}%`, y: '-10%', rotate: p.rotation, opacity: 1 }}
          animate={{
            y: '110%',
            x: `calc(${p.x}% + ${p.vx * 20}px)`,
            rotate: p.rotation + 360,
            opacity: 0
          }}
          transition={{ duration: 3, ease: 'easeOut', delay: i * 0.02 }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0'
          }}
        />
      ))}
    </div>
  )
}

// Particle background component
const ParticleBackground = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full opacity-30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// Subtle noise texture overlay
const NoiseOverlay = () => (
  <div 
    className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
    }}
  />
)

// Letter content - more personal and conversational
const letters = [
  {
    id: 1,
    title: 'Hey There',
    content: `So I've been thinking...

You know that feeling when you meet someone and it's just... easy? Like no awkward silences, no trying too hard. It just flows.

That's how I feel when we're together.

You have this way of making me laugh without even trying. And I notice the little things you do - how you listen, how you remember stuff I said weeks ago. Those aren't small things. Those are the things that matter.

I wanted to write this because sometimes the good people in life don't hear it enough. And you're one of the good ones.

Anyway, just wanted you to know.

✨`,
    gameType: 'memory' as const,
    gameTitle: 'Memory Match'
  },
  {
    id: 2,
    title: 'Random Thoughts',
    content: `Okay, random question:

When was the last time you did something just because it made you happy? Not because you were supposed to, or because it looked good on paper. Just pure, simple happiness.

I love that about you. You don't do things for show. You're genuine in a world full of fake.

The other day when you [remember that time we laughed until we cried]? Yeah, that's the stuff life's about.

You make ordinary moments feel like adventures. And I don't say that to just anyone.

Actually, I don't think I've ever said that to anyone before.

Thanks for being you. The real you.

💜`,
    gameType: 'quiz' as const,
    gameTitle: 'Quick Quiz'
  },
  {
    id: 3,
    title: 'Little Things',
    content: `I've been paying attention to the little things lately.

Like how you get excited about small stuff. How you send me memes at 2am knowing I'll laugh. How you notice when I'm having an off day before I even say anything.

Most people miss those things. You don't.

I honestly didn't expect to meet someone who gets me like this. It's rare, you know? Like finding a song that perfectly matches your mood.

You're that song for me.

I'm not great at expressing feelings (if you couldn't tell), but I wanted you to know that I see you. I see all of it. And I really, really appreciate it.

You're kind of amazing. Just saying.

🌟`,
    gameType: 'click' as const,
    gameTitle: 'Star Catcher'
  },
  {
    id: 4,
    title: 'Real Talk',
    content: `Alright, no games. Just honest thoughts:

I look forward to seeing you. Every single time.

When my phone lights up and it's you, I smile. That's the truth, even if I play it cool.

You make my days better without even trying. And I know that sounds cheesy, but I don't care anymore. It's true.

The scary part? I think this could be something special. Like, actually special. Not just "hanging out" special.

I've been hurt before (who hasn't, right?), but with you... I don't feel that worry. I just feel good. Safe. Happy.

That's new for me.

So yeah, just wanted to put that out there. No pressure, just honesty.

From the heart,
Me 💛`,
    gameType: 'math' as const,
    gameTitle: 'Brain Teasers'
  },
  {
    id: 5,
    title: 'One More Thing',
    content: `So this is the last note. Feels kind of weird to write it, honestly.

Through all of this - the games, the notes, everything - I just wanted to say one thing clearly:

You matter to me.

Not as "someone I know" or "a friend" or whatever label people use. You matter as YOU. Your laugh, your thoughts, your bad jokes, your good ones. All of it.

I don't know what happens next. Life's unpredictable like that. But whatever it is, I'm glad you're in it.

Really glad.

Thanks for reading all these. Thanks for playing along. Thanks for being you.

And hey - maybe we can do something fun together sometime? Like, no notes, no games. Just us.

What do you think? 

⭐ Forever grateful,
Someone who thinks you're pretty special ⭐`,
    gameType: 'word' as const,
    gameTitle: 'Word Puzzle'
  }
]

const surpriseLetter = {
  title: '🎉 You Did It! 🎉',
  content: `I can't believe you actually went through all of that.

Seriously, that's kind of amazing.

So here's the thing I've been wanting to say:

I really like you.

Not in a "you're cool" way. In a "I think about you randomly throughout the day and smile" way. In a "you're the first person I want to tell good news to" way. In a way that matters.

Yeah, I know. Pretty forward for someone who hid behind notes and games. But you're worth being brave for.

So now that all the secrets are out... 

Would you want to grab coffee sometime? Or food? Or literally anything where we can just hang out and talk?

No more notes. Just us.

I really, really hope you say yes.

You're extraordinary. Don't ever forget that.

💜🌟💜

P.S. I meant every single word. Every single one.`
}

// More interesting, less generic quiz questions
const quizQuestions = [
  {
    question: "What's something that always makes you smile without fail?",
    options: ['A good joke', 'Being around friends', 'Music', 'All of the above'],
    correct: 3
  },
  {
    question: "What matters more in life?",
    options: ['Looking successful', 'Being happy', 'Having lots of stuff', 'Being famous'],
    correct: 1
  },
  {
    question: "A good friend is someone who...",
    options: ['Has money', 'Shows up when it matters', 'Is popular', 'Agrees with everything'],
    correct: 1
  },
  {
    question: "The best memories come from...",
    options: ['Taking photos', 'Being present', 'Planning everything', 'Posting online'],
    correct: 1
  },
  {
    question: "What makes life worth living?",
    options: ['Achievement', 'Connection', 'Adventure', 'All of it'],
    correct: 3
  }
]

// More meaningful words
const wordWords = ['TRUST', 'CARE', 'LOVE', 'HOPE', 'REAL']

// Ripple effect component
const RippleButton = ({ children, ...props }: any) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples(prev => [...prev, { id, x, y }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600)
    props.onClick?.(e)
  }

  return (
    <Button {...props} onClick={handleClick} className="relative overflow-hidden">
      {children}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10
          }}
        />
      ))}
    </Button>
  )
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('landing')
  const [userName, setUserName] = useState('')
  const [inputName, setInputName] = useState('')
  const [currentLetterId, setCurrentLetterId] = useState<number | null>(null)
  const [unlockedLetters, setUnlockedLetters] = useState<number[]>([])
  const [showSurprise, setShowSurprise] = useState(false)
  const [celebrate, setCelebrate] = useState(false)

  // Game states
  const [memoryCards, setMemoryCards] = useState<Array<{ id: number; emoji: string; isFlipped: boolean; isMatched: boolean }>>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [memoryMoves, setMemoryMoves] = useState(0)

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null)

  const [clickScore, setClickScore] = useState(0)
  const [clickTarget, setClickTarget] = useState<{ x: number; y: number } | null>(null)
  const [clickTimeLeft, setClickTimeLeft] = useState(20)

  const [mathQuestions, setMathQuestions] = useState<Array<{ num1: number; num2: number; operator: string; answer: number }>>([])
  const [currentMathIndex, setCurrentMathIndex] = useState(0)
  const [mathScore, setMathScore] = useState(0)
  const [mathAnswer, setMathAnswer] = useState('')
  const [mathFeedback, setMathFeedback] = useState<'correct' | 'wrong' | null>(null)

  const [wordIndex, setWordIndex] = useState(0)
  const [wordGuess, setWordGuess] = useState('')
  const [wordProgress, setWordProgress] = useState<string[]>([])
  const [wordFeedback, setWordFeedback] = useState<'correct' | 'wrong' | null>(null)

  // Load progress from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('secretNotesUserName')
    const savedProgress = localStorage.getItem('secretNotesUnlocked')
    if (savedName) {
      setUserName(savedName)
      setGameState('letters')
    }
    if (savedProgress) {
      setUnlockedLetters(JSON.parse(savedProgress))
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    if (userName) {
      localStorage.setItem('secretNotesUserName', userName)
    }
    localStorage.setItem('secretNotesUnlocked', JSON.stringify(unlockedLetters))
  }, [userName, unlockedLetters])

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputName.trim()) {
      setUserName(inputName.trim())
      setGameState('letters')
    }
  }

  const unlockLetter = (letterId: number) => {
    setCelebrate(true)
    setTimeout(() => setCelebrate(false), 3000)
    
    setUnlockedLetters(prev => {
      if (!prev.includes(letterId)) {
        const newUnlocked = [...prev, letterId].sort()
        return newUnlocked
      }
      return prev
    })
    setCurrentLetterId(letterId)
    setGameState('letter')
  }

  const startGame = (letterId: number, gameType: string) => {
    setCurrentLetterId(letterId)
    setGameState('game')

    if (gameType === 'memory') {
      initMemoryGame()
    } else if (gameType === 'quiz') {
      setCurrentQuizIndex(0)
      setQuizScore(0)
      setQuizFeedback(null)
    } else if (gameType === 'click') {
      setClickScore(0)
      setClickTimeLeft(20)
      generateClickTarget()
    } else if (gameType === 'math') {
      initMathGame()
    } else if (gameType === 'word') {
      setWordIndex(0)
      setWordGuess('')
      setWordProgress([])
      setWordFeedback(null)
    }
  }

  // Memory Game
  const emojis = ['💜', '⭐', '✨', '🌟', '💫', '💛', '🎯', '🔮']
  
  const initMemoryGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }))
    setMemoryCards(shuffled)
    setSelectedCards([])
    setMemoryMoves(0)
  }

  const handleCardClick = (index: number) => {
    if (selectedCards.length === 2) return
    if (memoryCards[index].isMatched) return
    if (selectedCards.includes(index)) return

    const newCards = [...memoryCards]
    newCards[index].isFlipped = true
    setMemoryCards(newCards)

    const newSelected = [...selectedCards, index]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setMemoryMoves(prev => prev + 1)
      const [first, second] = newSelected
      
      if (memoryCards[first].emoji === memoryCards[second].emoji) {
        setTimeout(() => {
          setMemoryCards(cards => {
            const updated = [...cards]
            updated[first].isMatched = true
            updated[second].isMatched = true
            return updated
          })
          setSelectedCards([])
          
          const allMatched = memoryCards.every(card => 
            card.id === first || card.id === second || card.isMatched
          )
          if (allMatched) {
            setTimeout(() => unlockLetter(1), 500)
          }
        }, 400)
      } else {
        setTimeout(() => {
          setMemoryCards(cards => {
            const updated = [...cards]
            updated[first].isFlipped = false
            updated[second].isFlipped = false
            return updated
          })
          setSelectedCards([])
        }, 800)
      }
    }
  }

  // Quiz Game
  const handleQuizAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === quizQuestions[currentQuizIndex].correct
    setQuizFeedback(isCorrect ? 'correct' : 'wrong')
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1)
    }

    setTimeout(() => {
      setQuizFeedback(null)
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(prev => prev + 1)
      } else {
        unlockLetter(2)
      }
    }, 800)
  }

  // Click Game
  const generateClickTarget = () => {
    const x = Math.random() * 75 + 12.5
    const y = Math.random() * 75 + 12.5
    setClickTarget({ x, y })
  }

  const handleStarClick = () => {
    setClickScore(prev => prev + 1)
    if (clickScore + 1 >= 12) {
      unlockLetter(3)
    } else {
      generateClickTarget()
    }
  }

  useEffect(() => {
    if (gameState === 'game' && currentLetterId === 3 && clickTimeLeft > 0 && clickScore < 12) {
      const timer = setTimeout(() => {
        setClickTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (clickTimeLeft === 0 && clickScore < 12) {
      setClickScore(0)
      setClickTimeLeft(20)
      generateClickTarget()
    }
  }, [gameState, currentLetterId, clickTimeLeft, clickScore])

  // Math Game
  const initMathGame = () => {
    const questions = Array.from({ length: 5 }, () => {
      const operators = ['+', '-', '×']
      const operator = operators[Math.floor(Math.random() * operators.length)]
      const num1 = Math.floor(Math.random() * 25) + 5
      const num2 = Math.floor(Math.random() * 20) + 1
      let answer: number
      if (operator === '+') answer = num1 + num2
      else if (operator === '-') answer = num1 - num2
      else answer = num1 * num2
      return { num1, num2, operator, answer }
    })
    setMathQuestions(questions)
    setCurrentMathIndex(0)
    setMathScore(0)
    setMathAnswer('')
    setMathFeedback(null)
  }

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const correct = parseInt(mathAnswer) === mathQuestions[currentMathIndex].answer
    setMathFeedback(correct ? 'correct' : 'wrong')
    
    if (correct) {
      setMathScore(prev => prev + 1)
    }

    setTimeout(() => {
      setMathFeedback(null)
      if (currentMathIndex < mathQuestions.length - 1) {
        setCurrentMathIndex(prev => prev + 1)
        setMathAnswer('')
      } else {
        unlockLetter(4)
      }
    }, 800)
  }

  // Word Guessing Game
  const handleWordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetWord = wordWords[wordIndex]
    const isCorrect = wordGuess.toUpperCase() === targetWord
    setWordFeedback(isCorrect ? 'correct' : 'wrong')
    
    if (isCorrect) {
      setWordProgress(prev => [...prev, targetWord])
      setTimeout(() => {
        if (wordIndex < wordWords.length - 1) {
          setWordIndex(prev => prev + 1)
          setWordGuess('')
          setWordFeedback(null)
        } else {
          unlockLetter(5)
        }
      }, 500)
    } else {
      setWordGuess('')
      setTimeout(() => setWordFeedback(null), 500)
    }
  }

  const resetProgress = () => {
    localStorage.removeItem('secretNotesUnlocked')
    setUnlockedLetters([])
    setShowSurprise(false)
  }

  // Custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #7C3AED, #A855F7);
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #9333EA, #C084FC);
      }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  // Render Landing Page
  if (gameState === 'landing') {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4" style={{ backgroundColor: colors.background }}>
        <ParticleBackground />
        <NoiseOverlay />
        <Confetti active={false} />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-md w-full relative z-10"
        >
          <Card className="p-8 md:p-10 border-0 shadow-2xl" style={{ background: colors.glass, backdropFilter: 'blur(20px)' }}>
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, ${colors.primary}40 0%, transparent 70%)` }}
                />
                <Star className="w-20 h-20 relative" style={{ color: colors.primary }} fill={colors.primary} />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-center mb-3"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent}, ${colors.primaryLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Secret Notes
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
              style={{ color: colors.textLight }}
            >
              I left some notes for you...
            </motion.p>

            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleNameSubmit} 
              className="space-y-4"
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Your name..."
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="text-lg text-center border-2 transition-all duration-300 focus:scale-[1.02]"
                  style={{ 
                    borderColor: colors.glassBorder,
                    color: colors.text,
                    background: 'rgba(255,255,255,0.6)'
                  }}
                />
                {inputName && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <CheckCircle2 className="w-5 h-5" style={{ color: colors.primary }} />
                  </motion.div>
                )}
              </div>
              
              <RippleButton
                type="submit"
                className="w-full text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                  border: 'none'
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Let's See What's Inside
                  <Sparkles className="w-5 h-5" />
                </span>
              </RippleButton>
            </motion.form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex justify-center items-end gap-1"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -12 * (i % 2 === 0 ? 1 : 0.7), 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut'
                  }}
                >
                  <Star className="w-5 h-5" fill={colors.primary} style={{ color: colors.primary, opacity: 0.6 }} />
                </motion.div>
              ))}
            </motion.div>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Render Letters Page
  if (gameState === 'letters') {
    const allUnlocked = unlockedLetters.length === 5
    
    return (
      <div className="min-h-screen relative p-4 md:p-8" style={{ backgroundColor: colors.background }}>
        <ParticleBackground />
        <NoiseOverlay />
        <Confetti active={celebrate} />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Star className="w-10 h-10" fill={colors.primary} style={{ color: colors.primary }} />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent}, ${colors.primaryLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Notes for {userName}
            </h1>
            <p className="text-lg mb-6" style={{ color: colors.textLight }}>
              Each note has a little challenge...
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${unlockedLetters.length * 20}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})` }}
                />
              </div>
              <p className="text-sm mt-3 font-medium" style={{ color: colors.primary }}>
                {unlockedLetters.length} of 5 notes unlocked
              </p>
            </div>
          </motion.div>

          {/* Letters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {letters.map((letter, index) => {
              const isUnlocked = unlockedLetters.includes(letter.id)
              return (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={`p-6 h-full border-2 transition-all duration-300 ${
                    isUnlocked 
                      ? '' 
                      : ''
                  }`} style={{
                    background: isUnlocked ? colors.glass : 'rgba(255,255,255,0.5)',
                    borderColor: isUnlocked ? colors.primary : 'rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: isUnlocked ? `0 8px 30px ${colors.primary}20` : undefined
                  }}>
                    <div className="flex items-start justify-between mb-5">
                      <div className="p-3 rounded-full" style={{ background: isUnlocked ? `${colors.primary}15` : 'rgba(0,0,0,0.05)' }}>
                        <Mail className={`w-6 h-6 ${isUnlocked ? '' : ''}`} style={{ color: isUnlocked ? colors.primary : '#a1a1aa' }} />
                      </div>
                      {isUnlocked ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', delay: 0.2 }}
                        >
                          <Unlock className="w-6 h-6" style={{ color: '#10B981' }} />
                        </motion.div>
                      ) : (
                        <Lock className="w-6 h-6" style={{ color: '#a1a1aa' }} />
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
                      {letter.title}
                    </h3>
                    
                    {isUnlocked ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-sm mb-5" style={{ color: colors.primary }}>This note is ready to read!</p>
                        <Button
                          onClick={() => {
                            setCurrentLetterId(letter.id)
                            setGameState('letter')
                          }}
                          className="w-full text-white py-5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                          style={{ background: colors.primary }}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Read Note
                        </Button>
                      </motion.div>
                    ) : (
                      <div>
                        <p className="text-sm mb-5" style={{ color: colors.textLight }}>
                          Complete <span className="font-semibold" style={{ color: colors.primary }}>{letter.gameTitle}</span> to unlock
                        </p>
                        <RippleButton
                          onClick={() => startGame(letter.id, letter.gameType)}
                          className="w-full text-white py-5 font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                            border: 'none'
                          }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Start Game
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </RippleButton>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Surprise Button */}
          <AnimatePresence>
            {allUnlocked && !showSurprise && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: 'spring', damping: 20 }}
                className="text-center mb-10"
              >
                <Card className="max-w-md mx-auto p-8 border-0 shadow-2xl" style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.accent}15)`, backdropFilter: 'blur(20px)' }}>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.15, 1],
                      rotate: [0, 8, -8, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex justify-center mb-5"
                  >
                    <Gift className="w-16 h-16" style={{ color: colors.primary }} />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                    You Unlocked Everything! 🎊
                  </h2>
                  <p className="mb-7" style={{ color: colors.textLight }}>
                    There's one more thing waiting for you...
                  </p>
                  <RippleButton
                    onClick={() => setShowSurprise(true)}
                    size="lg"
                    className="w-full text-white py-6 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent}, ${colors.primaryLight})`,
                      border: 'none'
                    }}
                  >
                    <Sparkles className="w-6 h-6 mr-2" />
                    Open the Final Surprise
                    <Sparkles className="w-6 h-6 ml-2" />
                  </RippleButton>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Button
              onClick={() => {
                localStorage.removeItem('secretNotesUserName')
                setGameState('landing')
                setUserName('')
                setInputName('')
              }}
              variant="outline"
              className="transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                borderColor: colors.glassBorder,
                color: colors.textLight
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Render Game Page
  if (gameState === 'game' && currentLetterId) {
    const letter = letters.find(l => l.id === currentLetterId)

    // Memory Game
    if (letter?.gameType === 'memory') {
      const allMatched = memoryCards.every(card => card.isMatched)
      return (
        <div className="min-h-screen relative p-4 md:p-8 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
          <ParticleBackground />
          <NoiseOverlay />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full relative z-10"
          >
            <Card className="p-6 md:p-8 border-0 shadow-2xl" style={{ background: colors.glass, backdropFilter: 'blur(20px)' }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text }}>{letter.gameTitle}</h2>
                <p className="mb-3" style={{ color: colors.textLight }}>Find all the matching pairs</p>
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" style={{ color: colors.accent }} />
                  <span className="text-lg font-semibold" style={{ color: colors.primary }}>Moves: {memoryMoves}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {memoryCards.map((card, index) => (
                  <motion.button
                    key={card.id}
                    whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                    whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square rounded-2xl text-3xl md:text-4xl flex items-center justify-center font-bold transition-all duration-300 ${
                      card.isMatched 
                        ? '' 
                        : card.isFlipped 
                          ? '' 
                          : 'cursor-pointer'
                    }`}
                    style={{
                      background: card.isMatched 
                        ? `${colors.accent}30` 
                        : card.isFlipped 
                          ? colors.glass 
                          : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                      boxShadow: card.isMatched ? `0 4px 15px ${colors.accent}40` : undefined
                    }}
                  >
                    <motion.span
                      animate={card.isFlipped || card.isMatched ? { rotate: [0, 360] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {card.isFlipped || card.isMatched ? card.emoji : '?'}
                    </motion.span>
                  </motion.button>
                ))}
              </div>

              <Button
                onClick={() => setGameState('letters')}
                variant="outline"
                className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ borderColor: colors.glassBorder, color: colors.textLight }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notes
              </Button>
            </Card>
          </motion.div>
        </div>
      )
    }

    // Quiz Game
    if (letter?.gameType === 'quiz') {
      return (
        <div className="min-h-screen relative p-4 md:p-8 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
          <ParticleBackground />
          <NoiseOverlay />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full relative z-10"
          >
            <Card className="p-6 md:p-8 border-0 shadow-2xl" style={{ background: colors.glass, backdropFilter: 'blur(20px)' }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text }}>{letter.gameTitle}</h2>
                <p className="mb-4" style={{ color: colors.textLight }}>Quick questions, honest answers</p>
                
                <div className="max-w-md mx-auto mb-2">
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuizIndex + (quizFeedback ? 1 : 0)) / quizQuestions.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})` }}
                    />
                  </div>
                </div>
                <p className="text-sm font-medium" style={{ color: colors.primary }}>
                  Question {currentQuizIndex + 1} of {quizQuestions.length}
                </p>
              </div>

              {currentQuizIndex < quizQuestions.length && (
                <div className="space-y-4 mb-6">
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={currentQuizIndex}
                    className="text-xl md:text-2xl font-semibold text-center"
                    style={{ color: colors.text }}
                  >
                    {quizQuestions[currentQuizIndex].question}
                  </motion.h3>
                  
                  <AnimatePresence mode="wait">
                    {quizFeedback === null && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      >
                        {quizQuestions[currentQuizIndex].options.map((option, index) => (
                          <RippleButton
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            variant="outline"
                            className="py-5 text-base md:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            style={{ 
                              borderColor: colors.glassBorder,
                              color: colors.text
                            }}
                          >
                            {option}
                          </RippleButton>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {quizFeedback && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`text-center py-4 rounded-xl ${quizFeedback === 'correct' ? 'bg-green-50' : 'bg-red-50'}`}
                      >
                        {quizFeedback === 'correct' ? (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle2 className="w-6 h-6" />
                            <span className="font-semibold">Nice one!</span>
                          </div>
                        ) : (
                          <div className="text-red-500 font-medium">No worries, keep going!</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <Button
                onClick={() => setGameState('letters')}
                variant="outline"
                className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ borderColor: colors.glassBorder, color: colors.textLight }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notes
              </Button>
            </Card>
          </motion.div>
        </div>
      )
    }

    // Click Game
    if (letter?.gameType === 'click') {
      return (
        <div className="min-h-screen relative p-4 md:p-8 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
          <ParticleBackground />
          <NoiseOverlay />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full relative z-10"
          >
            <Card className="p-6 md:p-8 border-0 shadow-2xl" style={{ background: colors.glass, backdropFilter: 'blur(20px)' }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text }}>{letter.gameTitle}</h2>
                <p className="mb-3" style={{ color: colors.textLight }}>Catch the stars!</p>
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5" style={{ color: colors.accent }} />
                    <span className="text-2xl font-bold" style={{ color: colors.primary }}>{clickScore}/12</span>
                  </div>
                  <div className="px-4 py-1 rounded-full" style={{ background: `${colors.primary}15` }}>
                    <span className="text-xl font-bold" style={{ color: colors.primary }}>{clickTimeLeft}s</span>
                  </div>
                </div>
              </div>

              <div className="relative h-80 md:h-96 rounded-2xl border-2 overflow-hidden mb-6" style={{ 
                background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`,
                borderColor: colors.glassBorder
              }}>
                {clickTarget && (
                  <motion.button
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleStarClick}
                    style={{
                      position: 'absolute',
                      left: `${clickTarget.x}%`,
                      top: `${clickTarget.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="text-5xl md:text-6xl transition-all duration-150"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -8, 0],
                        rotate: [0, 15, -15, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <Star className="w-14 h-14 md:w-16 md:h-16" style={{ color: colors.accent }} fill={colors.accent} />
                    </motion.div>
                  </motion.button>
                )}
              </div>

              <Button
                onClick={() => setGameState('letters')}
                variant="outline"
                className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ borderColor: colors.glassBorder, color: colors.textLight }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notes
              </Button>
            </Card>
          </motion.div>
        </div>
      )
    }

    // Math Game
    if (letter?.gameType === 'math') {
      return (
        <div className="min-h-screen relative p-4 md:p-8 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
          <ParticleBackground />
          <NoiseOverlay />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full relative z-10"
          >
            <Card className="p-6 md:p-8 border-0 shadow-2xl" style={{ background: colors.glass, backdropFilter: 'blur(20px)' }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text }}>{letter.gameTitle}</h2>
                <p className="mb-4" style={{ color: colors.textLight }}>Quick mental math</p>
                
                <div className="max-w-md mx-auto mb-2">
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentMathIndex + (mathFeedback ? 1 : 0)) / mathQuestions.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})` }}
                    />
                  </div>
                </div>
                <p className="text-sm font-medium" style={{ color: colors.primary }}>
                  Problem {currentMathIndex + 1} of {mathQuestions.length}
                </p>
              </div>

              {currentMathIndex < mathQuestions.length && (
                <form onSubmit={handleMathSubmit} className="space-y-6 mb-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={currentMathIndex}
                    className="text-center"
                  >
                    <div className="text-5xl md:text-6xl font-bold mb-6" style={{ color: colors.text }}>
                      {mathQuestions[currentMathIndex].num1} {mathQuestions[currentMathIndex].operator} {mathQuestions[currentMathIndex].num2} = ?
                    </div>
                    <Input
                      type="number"
                      value={mathAnswer}
                      onChange={(e) => setMathAnswer(e.target.value)}
                      placeholder="Your answer..."
                      className="text-2xl md:text-3xl text-center border-2 transition-all duration-300 focus:scale-[1.02] py-6"
                      style={{ 
                        borderColor: colors.glassBorder,
                        background: 'rgba(255,255,255,0.6)'
                      }}
                      autoFocus
                    />
                  </motion.div>
                  
                  <AnimatePresence>
                    {mathFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`text-center py-3 rounded-xl ${mathFeedback === 'correct' ? 'bg-green-50' : 'bg-red-50'}`}
                      >
                        {mathFeedback === 'correct' ? (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-semibold">Correct!</span>
                          </div>
                        ) : (
                          <div className="text-red-500 font-medium">Not quite, but you're doing great!</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <RippleButton 
                    type="submit" 
                    className="w-full text-white py-6 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                      border: 'none'
                    }}
                  >
                    Submit Answer
                  </RippleButton>
                </form>
              )}

              <Button
                onClick={() => setGameState('letters')}
                variant="outline"
                className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ borderColor: colors.glassBorder, color: colors.textLight }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notes
              </Button>
            </Card>
          </motion.div>
        </div>
      )
    }

    // Word Guessing Game
    if (letter?.gameType === 'word') {
      return (
        <div className="min-h-screen relative p-4 md:p-8 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
          <ParticleBackground />
          <NoiseOverlay />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full relative z-10"
          >
            <Card className="p-6 md:p-8 border-0 shadow-2xl" style={{ background: colors.glass, backdropFilter: 'blur(20px)' }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text }}>{letter.gameTitle}</h2>
                <p className="mb-4" style={{ color: colors.textLight }}>Guess the meaningful words</p>
                
                <div className="max-w-md mx-auto mb-2">
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((wordIndex + (wordFeedback === 'correct' ? 1 : 0)) / wordWords.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})` }}
                    />
                  </div>
                </div>
                <p className="text-sm font-medium" style={{ color: colors.primary }}>
                  Word {wordIndex + 1} of {wordWords.length}
                </p>
                
                {wordProgress.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {wordProgress.map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                        style={{ background: colors.primary }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              {wordIndex < wordWords.length && (
                <div className="space-y-6 mb-6">
                  <div className="text-center">
                    <p className="mb-4" style={{ color: colors.textLight }}>Guess the word:</p>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={wordIndex}
                      className="text-3xl md:text-4xl font-bold tracking-widest mb-6"
                      style={{ color: colors.primary }}
                    >
                      {wordWords[wordIndex].split('').map(() => '_ ').join('')}
                    </motion.div>
                  </div>

                  <form onSubmit={handleWordSubmit}>
                    <Input
                      type="text"
                      value={wordGuess}
                      onChange={(e) => setWordGuess(e.target.value.toUpperCase())}
                      placeholder="Type your guess..."
                      className="text-xl text-center border-2 transition-all duration-300 focus:scale-[1.02] py-4 mb-4"
                      style={{ 
                        borderColor: colors.glassBorder,
                        background: 'rgba(255,255,255,0.6)'
                      }}
                      autoFocus
                    />
                    
                    <AnimatePresence>
                      {wordFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`text-center py-3 rounded-xl mb-4 ${wordFeedback === 'correct' ? 'bg-green-50' : 'bg-red-50'}`}
                        >
                          {wordFeedback === 'correct' ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="font-semibold">Perfect!</span>
                            </div>
                          ) : (
                            <div className="text-red-500 font-medium">Try again! 💪</div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <RippleButton 
                      type="submit" 
                      className="w-full text-white py-6 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ 
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                        border: 'none'
                      }}
                    >
                      Submit Guess
                    </RippleButton>
                  </form>
                </div>
              )}

              <Button
                onClick={() => setGameState('letters')}
                variant="outline"
                className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ borderColor: colors.glassBorder, color: colors.textLight }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notes
              </Button>
            </Card>
          </motion.div>
        </div>
      )
    }

    return null
  }

  // Render Letter View
  if (gameState === 'letter' && currentLetterId) {
    const letter = letters.find(l => l.id === currentLetterId)
    if (!letter) return null

    return (
      <div className="min-h-screen relative p-4 md:p-8 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ParticleBackground />
        <NoiseOverlay />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-2xl w-full relative z-10"
        >
          <Card className="p-8 md:p-12 border-0 shadow-2xl" style={{ background: colors.glass, backdropFilter: 'blur(20px)' }}>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 8, -8, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="flex justify-center mb-8"
            >
              <Star className="w-14 h-14" fill={colors.primary} style={{ color: colors.primary }} />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-center mb-3"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent}, ${colors.primaryLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {letter.title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
              style={{ color: colors.primary }}
            >
              To {userName} 💜
            </motion.p>

            <div className="space-y-6">
              {letter.content.split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.15, duration: 0.6 }}
                  className="text-lg leading-relaxed whitespace-pre-line"
                  style={{ color: colors.text }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex justify-center mt-10 gap-2"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut'
                  }}
                >
                  <Heart className="w-5 h-5" fill={colors.primary} style={{ color: colors.primary, opacity: 0.7 }} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="mt-10"
            >
              <Button
                onClick={() => setGameState('letters')}
                className="w-full text-white py-5 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: colors.primary }}
              >
                <Mail className="w-5 h-5 mr-2" />
                Back to All Notes
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Render Surprise Letter
  if (gameState === 'surprise' || showSurprise) {
    return (
      <div className="min-h-screen relative p-4 md:p-8 flex items-center justify-center overflow-hidden" style={{ backgroundColor: colors.background }}>
        <ParticleBackground />
        <NoiseOverlay />
        <Confetti active={true} />
        
        {/* Floating stars */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
                scale: Math.random() * 0.6 + 0.4,
                rotate: Math.random() * 360
              }}
              animate={{
                y: -100,
                x: `+=${(Math.random() - 0.5) * 300}`,
                rotate: Math.random() > 0.5 ? 360 : -360
              }}
              transition={{
                duration: Math.random() * 15 + 12,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: 'linear'
              }}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`
              }}
            >
              <Star className="w-8 h-10" fill={colors.primary} style={{ color: colors.primary, opacity: 0.4 }} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl w-full relative z-10"
        >
          <Card className="p-8 md:p-12 border-0 shadow-2xl" style={{ background: colors.glass, backdropFilter: 'blur(20px)' }}>
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, 12, -12, 0]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex justify-center mb-8"
            >
              <Gift className="w-24 h-24" style={{ color: colors.primary }} />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-center mb-10"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent}, ${colors.primaryLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {surpriseLetter.title}
            </motion.h2>

            <div className="space-y-8">
              {surpriseLetter.content.split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.25, duration: 0.8 }}
                  className="text-xl md:text-2xl leading-relaxed text-center whitespace-pre-line"
                  style={{ color: colors.text }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-center mt-12 gap-4"
            >
              <RippleButton
                onClick={() => setGameState('letters')}
                size="lg"
                className="flex-1 text-white py-6 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                  border: 'none'
                }}
              >
                <Mail className="w-5 h-5 mr-2" />
                Back to Notes
              </RippleButton>
              <Button
                onClick={resetProgress}
                size="lg"
                variant="outline"
                className="flex-1 py-6 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ borderColor: colors.glassBorder, color: colors.textLight }}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Start Fresh
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3, type: 'spring', damping: 15 }}
              className="flex justify-center mt-12"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, ${colors.accent}60 0%, transparent 70%)` }}
                />
                <Trophy className="w-20 h-20 relative" style={{ color: colors.accent }} />
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return null
}
