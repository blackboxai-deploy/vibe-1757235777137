'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      setIsLoading(false);
      
      // Profile completion checks can be added later
      // For now, just show dashboard
    }
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-8 bg-purple-200 rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-purple-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  LoveOS
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-purple-600 font-medium">
                Dashboard
              </Link>
              <Link href="/matches" className="text-gray-600 hover:text-purple-600">
                Matches
              </Link>
              <Link href="/chat" className="text-gray-600 hover:text-purple-600">
                Messages
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-purple-600">
                Profile
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Your journey to meaningful connections continues here.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Completion</p>
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">👤</span>
                </div>
              </div>
              <Progress value={85} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Matches</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 text-xl">💝</span>
                </div>
              </div>
              <Badge className="mt-2 bg-pink-100 text-pink-800">+2 this week</Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">💬</span>
                </div>
              </div>
              <Badge className="mt-2 bg-blue-100 text-blue-800">5 unread</Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compatibility Avg</p>
                  <p className="text-2xl font-bold text-gray-900">82%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">📊</span>
                </div>
              </div>
              <Badge className="mt-2 bg-green-100 text-green-800">High compatibility</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/50 border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="matches">Recent Matches</TabsTrigger>
            <TabsTrigger value="insights">Compatibility Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Status */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Profile Status</CardTitle>
                  <CardDescription>Complete your profile to get better matches</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Basic Information</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Psychology Questionnaire</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Profile Photos</span>
                    <Badge className="bg-yellow-100 text-yellow-800">1/3 photos</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bio & Interests</span>
                    <Badge className="bg-purple-100 text-purple-800">Needs improvement</Badge>
                  </div>
                  <Link href="/profile">
                    <Button variant="outline" className="w-full mt-4">
                      Update Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <CardDescription>Your latest interactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-600 text-sm">💝</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New match with Sarah</p>
                      <p className="text-xs text-gray-500">92% compatibility • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">💬</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Message from Alex</p>
                      <p className="text-xs text-gray-500">About your shared interests • 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm">👀</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Profile views increased</p>
                      <p className="text-xs text-gray-500">15 new views this week</p>
                    </div>
                  </div>
                  <Link href="/matches">
                    <Button variant="outline" className="w-full mt-4">
                      View All Activity
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Match Cards */}
              {[
                { name: 'Sarah', age: 28, compatibility: 92, image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/36ca5c62-4cf1-4388-b5f6-bbe5f16d0d6d.png' },
                { name: 'Alex', age: 32, compatibility: 88, image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/73361515-73bc-4f11-a778-2ce078ef837e.png' },
                { name: 'Jordan', age: 29, compatibility: 85, image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/79bf5904-16a3-458a-936e-6384e658f3f6.png' }
              ].map((match, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={match.image}
                        alt={`${match.name}'s profile photo`}
                        className="w-full h-64 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                        {match.compatibility}% Match
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{match.name}, {match.age}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Strong compatibility in values and communication style
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          Connect
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Your Compatibility Insights</CardTitle>
                <CardDescription>Understanding your relationship patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Your Strengths</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-800">High Emotional Intelligence</p>
                      <p className="text-xs text-green-600 mt-1">You excel at understanding and managing emotions</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">Strong Communication Skills</p>
                      <p className="text-xs text-blue-600 mt-1">You're direct yet diplomatic in conversations</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Growth Opportunities</h3>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-purple-800">Openness to New Experiences</p>
                    <p className="text-xs text-purple-600 mt-1">Consider exploring new activities with potential matches</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}