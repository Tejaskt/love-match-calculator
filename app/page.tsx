"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Sparkles, Star } from "lucide-react"

export default function LoveMatchCalculator() {
  const [name1, setName1] = useState("")
  const [name2, setName2] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const calculateLoveMatch = () => {
    if (!name1.trim() || !name2.trim()) return

    setIsCalculating(true)
    setShowResult(false)

    // Simulate calculation delay for better UX
    setTimeout(() => {
      const firstName = name1.toLowerCase().trim()
      const secondName = name2.toLowerCase().trim()

      let resultString = ""
      const secondNameChars = secondName.split("")

      // Process each character in first name
      for (const char of firstName) {
        let count = 0

        // Count occurrences in first name
        for (const c of firstName) {
          if (c === char) count++
        }

        // Count occurrences in second name and remove them
        for (let i = secondNameChars.length - 1; i >= 0; i--) {
          if (secondNameChars[i] === char) {
            count++
            secondNameChars.splice(i, 1)
          }
        }

        resultString += count.toString()
      }

      // Add remaining characters from second name
      for (const char of secondNameChars) {
        resultString += "1"
      }

      console.log("[v0] Initial result string:", resultString)

      // Reduce the string by pairing and adding adjacent digits
      while (resultString.length > 2) {
        let newString = ""

        for (let i = 0; i < resultString.length; i += 2) {
          if (i + 1 < resultString.length) {
            // Pair exists - add the two digits
            const sum = Number.parseInt(resultString[i]) + Number.parseInt(resultString[i + 1])
            newString += sum.toString()
          } else {
            // Odd character at the end - take as is
            newString += resultString[i]
          }
        }

        resultString = newString
        console.log("[v0] Reduced string:", resultString)
      }

      const matchPercentage = Number.parseInt(resultString)
      console.log("[v0] Final match percentage:", matchPercentage)

      setResult(matchPercentage)
      setIsCalculating(false)
      setShowResult(true)
    }, 2000)
  }

  const resetCalculator = () => {
    setName1("")
    setName2("")
    setResult(null)
    setShowResult(false)
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
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
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
                    />
                  </div>
                </div>

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
                  <div className="text-6xl font-bold text-primary animate-pulse">{result}%</div>
                  <div className="text-xl font-semibold text-accent">{result && getMatchMessage(result)}</div>
                </div>

                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
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
