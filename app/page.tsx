"use client";

import { EnhancedGenerationForm } from "@/components/enhanced-generation-form"
import { EnhancedParticlesBackground } from "@/components/enhanced-particles-background"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Sparkles, Stars, Zap, Lightbulb, Info } from "lucide-react"
import type { MouseEvent as ReactMouseEvent } from 'react';

export default function EnhancedHomePage() {
    return (
        <div className="container relative mx-auto py-8">
            <EnhancedParticlesBackground variant="sparkles" density={60} />

            <div className="mb-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="flex items-center justify-center mb-2">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary flex items-center">
                        <Sparkles className="h-8 w-8 mr-2 text-primary animate-pulse" />
                        VisioMera Studio
                    </div>
                </div>

                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Transform your imagination into stunning visuals with our AI-powered creative platform
                </p>

                <Tabs defaultValue="standard" className="w-full max-w-md">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="standard" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Standard
                        </TabsTrigger>
                        <TabsTrigger value="advanced" className="flex items-center gap-2">
                            <Stars className="h-4 w-4" />
                            Advanced
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="features-section mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
                <Card className="bg-secondary/30 p-4 rounded-lg border border-border/50 flex flex-col items-center text-center hover:shadow-md hover:border-primary/30 transition-all duration-300">
                    <div className="p-3 rounded-full bg-primary/10 mb-3">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Rapid Generation</h3>
                    <p className="text-sm text-muted-foreground">Create images in seconds with our optimized models</p>
                </Card>

                <Card className="bg-secondary/30 p-4 rounded-lg border border-border/50 flex flex-col items-center text-center hover:shadow-md hover:border-primary/30 transition-all duration-300">
                    <div className="p-3 rounded-full bg-primary/10 mb-3">
                        <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">AI-Enhanced Prompts</h3>
                    <p className="text-sm text-muted-foreground">Get better results with our intelligent prompt enhancement</p>
                </Card>

                <Card className="bg-secondary/30 p-4 rounded-lg border border-border/50 flex flex-col items-center text-center hover:shadow-md hover:border-primary/30 transition-all duration-300">
                    <div className="p-3 rounded-full bg-primary/10 mb-3">
                        <Info className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Advanced Options</h3>
                    <p className="text-sm text-muted-foreground">Fine-tune your generation with powerful controls</p>
                </Card>
            </div>

            <EnhancedGenerationForm className="mx-auto max-w-7xl animate-fade-in" />

            <div className="fixed bottom-4 left-4 z-10">
                <Button variant="outline" size="sm" className="text-xs flex items-center gap-1 bg-background/80 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    AI Models: Online
                </Button>
            </div>

            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.6;
                    }
                }
            `}</style>
        </div>
    )
}