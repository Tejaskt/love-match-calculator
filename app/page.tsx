"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Sparkles, Star } from "lucide-react"

interface AnimationStep {
  type: "checking" | "counting" | "reducing" | "final"
  data: any
}

interface LetterState {
  char: string
  isChecking: boolean
  isCrossed: boolean
  count: number
}

export default function LoveMatchCalculator() {
  const [name1, setName1] = useState("")
  const [name2, setName2] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const [animationStep, setAnimationStep] = useState<AnimationStep | null>(null)
  const [name1Letters, setName1Letters] = useState<LetterState[]>([])
  const [name2Letters, setName2Letters] = useState<LetterState[]>([])
  const [currentString, setCurrentString] = useState("")
  const [reductionSteps, setReductionSteps] = useState<string[]>([])
  const [animatedPercentage, setAnimatedPercentage] = useState(0)

  useEffect(() => {
    if (result !== null && showResult && animatedPercentage < result) {
      const timer = setTimeout(() => {
        setAnimatedPercentage((prev) => Math.min(prev + 1, result))
      }, 30)
      return () => clearTimeout(timer)
    }
  }, [result, showResult, animatedPercentage])

  const calculateLoveMatch = async () => {
    if (!name1.trim() || !name2.trim()) return

    setIsCalculating(true)
    setShowResult(false)
    setAnimatedPercentage(0)

    const firstName = name1.toLowerCase().trim()
    const secondName = name2.toLowerCase().trim()

    const name1LetterStates: LetterState[] = firstName.split("").map((char) => ({
      char,
      isChecking: false,
      isCrossed: false,
      count: 0,
    }))

    const name2LetterStates: LetterState[] = secondName.split("").map((char) => ({
      char,
      isChecking: false,
      isCrossed: false,
      count: 0,
    }))

    setName1Letters(name1LetterStates)
    setName2Letters(name2LetterStates)

    let resultString = ""
    const secondNameChars = secondName.split("")

    for (let i = 0; i < firstName.length; i++) {
      const char = firstName[i]

      // Highlight current letter being checked
      setName1Letters((prev) =>
        prev.map((letter, idx) => ({
          ...letter,
          isChecking: idx === i,
        })),
      )

      setAnimationStep({
        type: "checking",
        data: { currentChar: char, currentIndex: i },
      })

      await new Promise((resolve) => setTimeout(resolve, 800))

      let count = 0

      // Count occurrences in first name
      for (const c of firstName) {
        if (c === char) count++
      }

      // Count occurrences in second name and remove them
      for (let j = secondNameChars.length - 1; j >= 0; j--) {
        if (secondNameChars[j] === char) {
          count++
          // Animate crossing out in second name
          setName2Letters((prev) =>
            prev.map((letter, idx) =>
              letter.char === char && !letter.isCrossed ? { ...letter, isCrossed: true } : letter,
            ),
          )
          secondNameChars.splice(j, 1)
          await new Promise((resolve) => setTimeout(resolve, 300))
        }
      }

      // Update count for current letter
      setName1Letters((prev) =>
        prev.map((letter, idx) => ({
          ...letter,
          isChecking: false,
          count: idx === i ? count : letter.count,
        })),
      )

      resultString += count.toString()
      setCurrentString(resultString)

      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Add remaining characters from second name
    for (const char of secondNameChars) {
      resultString += "1"
    }
    setCurrentString(resultString)

    setAnimationStep({
      type: "counting",
      data: { initialString: resultString },
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const steps = [resultString]
    let workingString = resultString

    while (workingString.length > 2) {
      let newString = ""

      for (let i = 0; i < workingString.length; i += 2) {
        if (i + 1 < workingString.length) {
          const sum = Number.parseInt(workingString[i]) + Number.parseInt(workingString[i + 1])
          newString += sum.toString()
        } else {
          newString += workingString[i]
        }
      }

      workingString = newString
      steps.push(workingString)
      setReductionSteps([...steps])
      setCurrentString(workingString)

      setAnimationStep({
        type: "reducing",
        data: { steps: [...steps] },
      })

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    const matchPercentage = Number.parseInt(workingString)

    setAnimationStep({
      type: "final",
      data: { percentage: matchPercentage },
    })

    await new Promise((resolve) => setTimeout(resolve, 500))

    setResult(matchPercentage)
    setIsCalculating(false)
    setShowResult(true)
  }

  const resetCalculator = () => {
    setName1("")
    setName2("")
    setResult(null)
    setShowResult(false)
    setAnimationStep(null)
    setName1Letters([])
    setName2Letters([])
    setCurrentString("")
    setReductionSteps([])
    setAnimatedPercentage(0)
  }

  const getMatchMessage = (percentage: number) => {
    if (percentage >= 90) return "Perfect soulmates! 💕"
    if (percentage >= 80) return "Amazing connection! ✨"
    if (percentage >= 70) return "Great compatibility! 💖"
    if (percentage >= 60) return "Good potential! 💫"
    return "Keep exploring! 💝"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background relative overflow-hidden">
      {/* Animated background hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={i}
            className={`absolute text-primary/20 animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Heart className="w-16 h-16 text-primary animate-pulse" fill="currentColor" />
                <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-spin" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Love Match Calculator
            </CardTitle>
            <CardDescription className="text-muted-foreground">Discover your romantic compatibility</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!showResult ? (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">First Name</label>
                    <Input
                      placeholder="Enter first name..."
                      value={name1}
                      onChange={(e) => setName1(e.target.value)}
                      className="border-border focus:ring-primary/50"
                      disabled={isCalculating}
                    />
                  </div>

                  <div className="flex justify-center">
                    <Heart className="w-6 h-6 text-primary" fill="currentColor" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Second Name</label>
                    <Input
                      placeholder="Enter second name..."
                      value={name2}
                      onChange={(e) => setName2(e.target.value)}
                      className="border-border focus:ring-primary/50"
                      disabled={isCalculating}
                    />
                  </div>
                </div>

                {isCalculating && animationStep && (
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4 border border-primary/20">
                    <div className="text-center text-sm font-medium text-primary">
                      {animationStep.type === "checking" && "Checking letters..."}
                      {animationStep.type === "counting" && "Counting matches..."}
                      {animationStep.type === "reducing" && "Calculating compatibility..."}
                      {animationStep.type === "final" && "Almost there..."}
                    </div>

                    {/* Letter visualization */}
                    {(animationStep.type === "checking" || animationStep.type === "counting") && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">First Name:</div>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {name1Letters.map((letter, idx) => (
                              <div
                                key={idx}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                  letter.isChecking
                                    ? "border-primary bg-primary text-primary-foreground animate-pulse scale-110"
                                    : letter.count > 0
                                      ? "border-accent bg-accent/20 text-accent"
                                      : "border-muted-foreground text-muted-foreground"
                                }`}
                              >
                                {letter.char.toUpperCase()}
                                {letter.count > 0 && (
                                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                                    {letter.count}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">Second Name:</div>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {name2Letters.map((letter, idx) => (
                              <div
                                key={idx}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 relative ${
                                  letter.isCrossed
                                    ? "border-destructive bg-destructive/20 text-destructive line-through"
                                    : "border-muted-foreground text-muted-foreground"
                                }`}
                              >
                                {letter.char.toUpperCase()}
                                {letter.isCrossed && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-0.5 bg-destructive rotate-45"></div>
                                    <div className="w-6 h-0.5 bg-destructive -rotate-45 absolute"></div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {currentString && (
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-2">Current Number:</div>
                            <div className="text-2xl font-bold text-primary font-mono tracking-wider">
                              {currentString}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reduction steps visualization */}
                    {animationStep.type === "reducing" && reductionSteps.length > 0 && (
                      <div className="space-y-3">
                        <div className="text-xs text-muted-foreground text-center">Reduction Steps:</div>
                        {reductionSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className={`text-center transition-all duration-500 ${
                              idx === reductionSteps.length - 1
                                ? "text-2xl font-bold text-primary scale-110"
                                : "text-lg text-muted-foreground"
                            }`}
                          >
                            <div className="font-mono tracking-wider">{step}</div>
                            {idx < reductionSteps.length - 1 && (
                              <div className="text-xs text-muted-foreground mt-1">↓</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <Button
                  onClick={calculateLoveMatch}
                  disabled={!name1.trim() || !name2.trim() || isCalculating}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  {isCalculating ? (
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 animate-pulse" fill="currentColor" />
                      Calculating Love...
                      <Heart className="w-5 h-5 animate-pulse" fill="currentColor" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Calculate Match
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center space-y-6 animate-in fade-in-50 duration-500">
                <div className="space-y-2">
                  <div className="text-6xl font-bold text-primary animate-pulse">{animatedPercentage}%</div>
                  <div className="text-xl font-semibold text-accent">{result && getMatchMessage(result)}</div>
                </div>

                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 transition-all duration-300 ${
                        result && i < Math.floor(result / 20) ? "text-accent animate-pulse" : "text-muted-foreground"
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="text-sm text-muted-foreground">Love Match Result</div>
                  <div className="text-lg font-medium">
                    <span className="text-primary font-semibold">{name1}</span>
                    {" & "}
                    <span className="text-accent font-semibold">{name2}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={resetCalculator}
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Love Match Result",
                          text: `${name1} & ${name2} have a ${result}% love match! ${result && getMatchMessage(result)}`,
                        })
                      }
                    }}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Share Result
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
