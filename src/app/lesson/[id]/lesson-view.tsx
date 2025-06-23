"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, CheckCircle, Code, Lightbulb, Play, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { completeStep, setLastActiveCourse } from "@/lib/progress"
import { LessonData, LessonStep } from "@/lib/types"

export default function LessonView({ lessonData, courseId }: { lessonData: LessonData, courseId: string }) {
  useEffect(() => {
    setLastActiveCourse(courseId);
  }, [courseId]);

  const [currentStep, setCurrentStep] = useState(0)
  const [userCode, setUserCode] = useState(lessonData.steps.find((s: LessonStep) => s.type === 'practice')?.starterCode || "")
  const [showHint, setShowHint] = useState(false)
  const [output, setOutput] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [submittedQuiz, setSubmittedQuiz] = useState(false)
  
  const lessonSteps = lessonData.steps
  const currentLesson = lessonSteps[currentStep]
  const progress = ((currentStep + 1) / lessonSteps.length) * 100

  const handleNext = () => {
    // Check if the current step was a practice or quiz and was answered correctly
    const wasPracticeCorrect = currentLesson.type === 'practice' && isCorrect;
    const wasQuizCorrect = currentLesson.type === 'quiz' && selectedOption === currentLesson.correct;

    if (wasPracticeCorrect || wasQuizCorrect) {
      completeStep(courseId, currentStep);
    }

    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setShowHint(false)
      setOutput("")
      setIsCorrect(null)
      setSelectedOption(null)
      setSubmittedQuiz(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setShowHint(false)
      setOutput("")
      setIsCorrect(null)
      setSelectedOption(null)
      setSubmittedQuiz(false)
    }
  }

  const handleSelectOption = (index: number) => {
    if (submittedQuiz) return
    setSelectedOption(index)
    setSubmittedQuiz(true)
  }

  const runCode = async () => {
    setOutput("");
    setIsCorrect(null);
    const practiceStep = lessonSteps[currentStep];
    if (!practiceStep.test) return;
    const test = practiceStep.test;

    const capturedLogs: string[] = [];
    const originalLog = console.log;
    console.log = (...args) => {
      originalLog(...args);
      capturedLogs.push(args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)).join(' '));
    };

    try {
      if (test.type === "function") {
        const result = new Function(`${userCode}; return ${test.call};`)();
        setOutput(`Output: ${result}`);
        if (result === test.expected) {
          setIsCorrect(true);
        } else {
          setIsCorrect(false);
        }
      } else if (test.type === "dom") {
        const mockElement = { textContent: "" };
        const getElementById = () => mockElement;
        new Function("document", userCode)({ getElementById });
        setOutput(`Output: element.textContent is now "${mockElement.textContent}"`);
        if (mockElement.textContent === test.expected) {
          setIsCorrect(true);
        } else {
          setIsCorrect(false);
        }
      } else if (test.type === "async") {
        const originalFetch = window.fetch;
        // @ts-expect-error - Mocking fetch for isolated testing
        window.fetch = async (url: string) => {
          if (url === test.url) {
            return new Response(JSON.stringify(test.mockResponse), { status: 200 });
          }
          return originalFetch(url);
        };

        await new Function(`return (async () => { ${userCode} })()`)();
        
        window.fetch = originalFetch;
        
        const finalOutput = capturedLogs.join('\n') || "";
        setOutput(`Console Logs:\n${finalOutput}`);
        if (finalOutput.includes(test.expectedLog || '')) {
          setIsCorrect(true);
        } else {
          setIsCorrect(false);
        }
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
      setIsCorrect(false);
    } finally {
      console.log = originalLog;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold">{lessonData.title}</h1>
                <p className="text-sm text-gray-400">{lessonData.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {currentStep + 1} of {lessonSteps.length}
              </div>
              <div className="w-32">
                <Progress value={progress} className="h-2 bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Concept Step */}
          {currentLesson.type === "concept" && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-[#F7DF1E]" />
                  <Badge className="bg-[#F7DF1E] text-black">Concept</Badge>
                </div>
                <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-gray-300 leading-relaxed">{currentLesson.content}</p>

                <div className="bg-black rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Example</span>
                    <Code className="w-4 h-4 text-[#F7DF1E]" />
                  </div>
                  <pre className="text-[#F7DF1E] text-sm overflow-x-auto">
                    <code>{currentLesson.example}</code>
                  </pre>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-300">{currentLesson.explanation}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Practice Step */}
          {currentLesson.type === "practice" && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Code className="w-5 h-5 text-[#F7DF1E]" />
                  <Badge className="bg-green-600">Practice</Badge>
                </div>
                <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
                <CardDescription className="text-gray-300 text-base">{currentLesson.instruction}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-black rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between p-3 border-b border-gray-700">
                    <span className="text-sm text-gray-400">Code Editor</span>
                    <Button onClick={runCode} size="sm" className="bg-[#F7DF1E] text-black hover:bg-[#F7DF1E]/90">
                      <Play className="w-3 h-3 mr-1" />
                      Run
                    </Button>
                  </div>
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="w-full h-40 p-4 bg-transparent text-[#F7DF1E] font-mono text-sm resize-none focus:outline-none"
                    placeholder={currentLesson.starterCode}
                  />
                </div>

                {output && (
                  <Card className="bg-gray-800 border-gray-700 mt-4">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base font-medium">Result</CardTitle>
                      {isCorrect === true && <Badge className="bg-green-600">Correct</Badge>}
                      {isCorrect === false && <Badge className="bg-red-600">Incorrect</Badge>}
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                        <code>{output}</code>
                      </pre>
                    </CardContent>
                  </Card>
                )}

                {showHint && (
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Hint</span>
                    </div>
                    <p className="text-blue-300">{currentLesson.hint}</p>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => setShowHint(!showHint)}
                  className="border-gray-600 hover:bg-gray-800"
                >
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quiz Step */}
          {currentLesson.type === "quiz" && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-[#F7DF1E]" />
                  <Badge className="bg-purple-600">Quiz</Badge>
                </div>
                <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <h3 className="text-xl text-gray-300">{currentLesson.question}</h3>

                <div className="space-y-3">
                  {currentLesson.options?.map((option: string, index: number) => {
                    const isCorrectAnswer = index === currentLesson.correct
                    const isSelected = index === selectedOption

                    let buttonClass = "w-full justify-start text-left h-auto p-4 border-gray-700"

                    if (submittedQuiz) {
                      if (isCorrectAnswer) {
                        buttonClass += " border-green-500 bg-green-500/10 hover:bg-green-500/10"
                      } else if (isSelected && !isCorrectAnswer) {
                        buttonClass += " border-red-500 bg-red-500/10 hover:bg-red-500/10"
                      } else {
                        buttonClass += " border-gray-800 text-gray-500"
                      }
                    } else {
                      buttonClass += " hover:border-[#F7DF1E] hover:bg-[#F7DF1E]/10"
                    }

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={buttonClass}
                        onClick={() => handleSelectOption(index)}
                        disabled={submittedQuiz}
                      >
                        <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm mr-3">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                        {submittedQuiz && isCorrectAnswer && (
                          <CheckCircle className="w-5 h-5 ml-auto text-green-500" />
                        )}
                        {submittedQuiz && isSelected && !isCorrectAnswer && (
                          <XCircle className="w-5 h-5 ml-auto text-red-500" />
                        )}
                      </Button>
                    )
                  })}
                </div>
                {submittedQuiz && (
                  <div
                    className={`mt-4 rounded-lg p-3 text-center text-sm font-medium ${
                      selectedOption === currentLesson.correct
                        ? "bg-green-500/10 text-green-300"
                        : "bg-red-500/10 text-red-300"
                    }`}
                  >
                    {selectedOption === currentLesson.correct
                      ? "Correct! Well done."
                      : "Not quite. The correct answer is highlighted in green."}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-gray-700 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {lessonSteps.map((_: LessonStep, index: number) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index <= currentStep ? "bg-[#F7DF1E]" : "bg-gray-700"}`}
                />
              ))}
            </div>

            {currentStep === lessonSteps.length - 1 ? (
              <Link href="/">
                <Button className="bg-[#F7DF1E] text-black hover:bg-[#F7DF1E]/90">
                  Complete Lesson
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button onClick={handleNext} className="bg-[#F7DF1E] text-black hover:bg-[#F7DF1E]/90">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 