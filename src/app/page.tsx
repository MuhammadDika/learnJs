"use client"

import { useState, useEffect } from "react"
import { Trophy, User, ChevronRight, Play, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getProgress, getLastActiveCourse } from "@/lib/progress"
import { allLessons } from "@/lib/lessons"

export default function Dashboard() {
  const [currentStreak, setCurrentStreak] = useState(7)
  const [totalXP, setTotalXP] = useState(1250)
  const [progressData, setProgressData] = useState<any>({})
  const [lastActiveCourseId, setLastActiveCourseId] = useState<string | null>(null)

  useEffect(() => {
    setProgressData(getProgress())
    setLastActiveCourseId(getLastActiveCourse())
  }, [])

  const initialCourses = [
    {
      id: 1,
      title: "JavaScript Basics",
      description: "Learn the fundamentals of JavaScript programming.",
      difficulty: "Beginner",
      estimatedTime: "2 hours",
      isActive: true,
    },
    {
      id: 2,
      title: "DOM Manipulation",
      description: "Master the Document Object Model to create interactive web pages.",
      difficulty: "Intermediate",
      estimatedTime: "1.5 hours",
      isActive: true,
    },
    {
      id: 4,
      title: "Async JavaScript",
      description: "Understand Promises, async/await, and the event loop.",
      difficulty: "Advanced",
      estimatedTime: "3 hours",
      isActive: true,
    },
  ]
  
  const courses = initialCourses.map(course => {
    const courseProgress = progressData[course.id]?.completedSteps || []
    const totalSteps = allLessons[course.id]?.steps.length || 0
    const completedLessons = courseProgress.length
    const progressPercentage = totalSteps > 0 ? Math.round((completedLessons / totalSteps) * 100) : 0
    
    return {
      ...course,
      progress: progressPercentage,
      lessons: totalSteps,
      completedLessons: completedLessons,
    }
  })

  const lastCourse = lastActiveCourseId ? courses.find(c => c.id.toString() === lastActiveCourseId) : null;
  const lastLessonData = lastActiveCourseId ? allLessons[lastActiveCourseId] : null;

  const recentAchievements = [
    { title: "First Steps", description: "Completed your first lesson", icon: "🎯" },
    { title: "Code Warrior", description: "Solved 10 coding challenges", icon: "⚔️" },
    { title: "Streak Master", description: "7-day learning streak", icon: "🔥" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#F7DF1E] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">JS</span>
            </div>
            <h1 className="text-xl font-bold">LearnJS</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-[#F7DF1E]">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">{totalXP} XP</span>
            </div>
            <Button variant="outline" size="icon" className="border-gray-700 hover:bg-gray-800">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#F7DF1E]/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#F7DF1E]">{currentStreak}</p>
                  <p className="text-gray-400 text-sm">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#F7DF1E]/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-[#F7DF1E]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#F7DF1E]">{totalXP}</p>
                  <p className="text-gray-400 text-sm">Total XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#F7DF1E]/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#F7DF1E]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#F7DF1E]">11</p>
                  <p className="text-gray-400 text-sm">Lessons Done</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning */}
        {lastCourse && lastLessonData && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
            <Card className="bg-gradient-to-r from-[#F7DF1E]/20 to-[#F7DF1E]/5 border-[#F7DF1E]/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{lastCourse.title}</h3>
                    <p className="text-gray-300 mb-4">{lastLessonData.subtitle}</p>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-1">
                        <Progress value={lastCourse.progress} className="h-2 bg-gray-800" />
                      </div>
                      <span className="text-sm text-gray-400">{lastCourse.progress}% complete</span>
                    </div>
                  </div>
                  <Link href={`/lesson/${lastCourse.id}`}>
                    <Button className="bg-[#F7DF1E] text-black hover:bg-[#F7DF1E]/90 ml-6">
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* All Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">All Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="bg-gray-900 border-gray-800 hover:border-[#F7DF1E]/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant={
                        course.difficulty === "Beginner"
                          ? "default"
                          : course.difficulty === "Intermediate"
                            ? "secondary"
                            : "destructive"
                      }
                      className={
                        course.difficulty === "Beginner"
                          ? "bg-green-600"
                          : course.difficulty === "Intermediate"
                            ? "bg-[#F7DF1E] text-black"
                            : "bg-red-600"
                      }
                    >
                      {course.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-400">{course.estimatedTime}</span>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription className="text-gray-400">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {course.completedLessons}/{course.lessons} lessons
                      </span>
                      <span className="text-[#F7DF1E]">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2 bg-gray-800" />
                    <Link href={course.isActive ? `/lesson/${course.id}` : "#"}>
                      <Button
                        className={`w-full ${course.isActive ? "bg-[#F7DF1E] text-black hover:bg-[#F7DF1E]/90" : "bg-gray-800 text-gray-400"}`}
                        disabled={!course.isActive}
                      >
                        {course.progress > 0 ? "Continue" : "Start Course"}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAchievements.map((achievement, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <div className="font-semibold text-[#F7DF1E]">{achievement.title}</div>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
