import React, { useState, useRef, useEffect } from "react";
import {
    Sparkles,
    Save,
    Share2,
    Download,
    Upload,
    Trash2,
    Copy,
    RefreshCw,
    ChevronDown,
    Wand2,
    Layers,
    Plus,
    Send,
    Maximize2,
    RotateCw,
    Clock,
    X,
    Image,
    ZoomIn,
    ZoomOut,
    Settings,
    History,
    BookOpen,
    PanelLeft,
    PanelRight,
    Star,
    AlignLeft,
    Sliders,
    Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function EnhancedGenerationForm() {
    // State variables
    const [generating, setGenerating] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>("");
    const [negativePrompt, setNegativePrompt] = useState<string>("");
    const [showTagSuggestions, setShowTagSuggestions] = useState<boolean>(false);
    const [showControlPanel, setShowControlPanel] = useState<boolean>(true);
    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [activeTab, setActiveTab] = useState<string>("basic");
    const [aspectRatio, setAspectRatio] = useState<string>("1:1");
    const [enhancePrompt, setEnhancePrompt] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<string>("flux");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const promptInputRef = useRef<HTMLTextAreaElement>(null);
    const generationContainerRef = useRef<HTMLDivElement>(null);

    // Handle prompt change
    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
        setShowTagSuggestions(e.target.value.length > 0);
    };

    // Generate image
    const handleGenerate = () => {
        if (!prompt.trim()) {
            return;
        }

        setGenerating(true);
        setProgress(0);

        // Simulate generation process with progress updates
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setGenerating(false);
                    setGeneratedImage("/placeholder.svg?height=1024&width=1024&text=Generated+Image");
                    return 0;
                }
                return prev + 2;
            });
        }, 100);
    };

    return (
        <div className="w-full h-full">
            {/* Main Content - Expanded layout to fill available space */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side: Generation Settings */}
                <div className="w-full lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>Image Settings</CardTitle>
                                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Aspect Ratio" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1:1">1:1 Square</SelectItem>
                                        <SelectItem value="4:3">4:3 Standard</SelectItem>
                                        <SelectItem value="16:9">16:9 Widescreen</SelectItem>
                                        <SelectItem value="9:16">9:16 Portrait</SelectItem>
                                        <SelectItem value="2:3">2:3 Portrait</SelectItem>
                                        <SelectItem value="3:2">3:2 Landscape</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <CardDescription>Configure your generation parameters</CardDescription>
                        </CardHeader>

                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <div className="px-6">
                                <TabsList className="w-full">
                                    <TabsTrigger value="basic" className="flex-1">
                                        Basic
                                    </TabsTrigger>
                                    <TabsTrigger value="advanced" className="flex-1">
                                        Advanced
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="basic" className="pt-2">
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="prompt" className="text-base font-medium">Prompt</Label>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="enhance-prompt"
                                                    checked={enhancePrompt}
                                                    onCheckedChange={setEnhancePrompt}
                                                />
                                                <Label htmlFor="enhance-prompt" className="text-xs">AI Enhance</Label>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                                            <Lightbulb className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>AI will enhance your prompt with additional details</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <Textarea
                                                id="prompt"
                                                placeholder="Describe your image in detail... (e.g., A serene landscape with mountains, a calm lake under twilight sky with stars beginning to appear)"
                                                className="min-h-[120px] resize-none"
                                                value={prompt}
                                                onChange={handlePromptChange}
                                                ref={promptInputRef}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowTagSuggestions(true)}
                                                className="text-xs"
                                            >
                                                <Plus className="mr-1 h-3 w-3" />
                                                Suggestions
                                            </Button>

                                            <Button variant="outline" size="sm" className="text-xs">
                                                <Save className="mr-1 h-3 w-3" />
                                                Save Prompt
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="negative-prompt" className="flex items-center gap-2">
                                            Negative Prompt
                                        </Label>
                                        <Textarea
                                            id="negative-prompt"
                                            placeholder="Elements to avoid in the image... (e.g., blurry, bad anatomy, distorted, watermark, signature)"
                                            className="min-h-[80px] resize-none"
                                            value={negativePrompt}
                                            onChange={(e) => setNegativePrompt(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-base font-medium">Model Selection</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {[
                                                { id: "flux", name: "Flux Realistic", image: "/placeholder.svg?height=80&width=80&text=Flux" },
                                                { id: "anime", name: "Anime Diffusion", image: "/placeholder.svg?height=80&width=80&text=Anime" },
                                                { id: "dreamshaper", name: "Dreamshaper", image: "/placeholder.svg?height=80&width=80&text=Dream" },
                                                { id: "realistic", name: "Realistic Vision", image: "/placeholder.svg?height=80&width=80&text=Real" }
                                            ].map((model) => (
                                                <div
                                                    key={model.id}
                                                    className={cn(
                                                        "flex cursor-pointer flex-col items-center gap-1 rounded-md border p-2 transition-all hover:border-primary hover:bg-secondary",
                                                        selectedModel === model.id && "border-primary bg-primary/5"
                                                    )}
                                                    onClick={() => setSelectedModel(model.id)}
                                                >
                                                    <img
                                                        src={model.image}
                                                        alt={model.name}
                                                        className="h-14 w-14 rounded-md object-cover"
                                                    />
                                                    <span className="mt-1 text-center text-xs">{model.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </TabsContent>

                            <TabsContent value="advanced" className="pt-2">
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="seed">Seed</Label>
                                        <div className="flex gap-2">
                                            <Input id="seed" type="number" placeholder="Random" className="flex-1" />
                                            <Button variant="outline" size="icon">
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="steps">Sampling Steps</Label>
                                            <span className="text-xs text-muted-foreground">30</span>
                                        </div>
                                        <Slider id="steps" defaultValue={[30]} min={20} max={150} step={1} className="py-2" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="cfg">CFG Scale</Label>
                                            <span className="text-xs text-muted-foreground">7.0</span>
                                        </div>
                                        <Slider id="cfg" defaultValue={[7]} min={1} max={20} step={0.1} className="py-2" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sampler">Sampler</Label>
                                        <Select defaultValue="euler_a">
                                            <SelectTrigger id="sampler">
                                                <SelectValue placeholder="Select sampler" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="euler_a">Euler Ancestral</SelectItem>
                                                <SelectItem value="euler">Euler</SelectItem>
                                                <SelectItem value="ddim">DDIM</SelectItem>
                                                <SelectItem value="dpm_2">DPM++ 2M</SelectItem>
                                                <SelectItem value="dpm_2_a">DPM++ 2M Ancestral</SelectItem>
                                                <SelectItem value="lcm">LCM</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Image to Image</Label>
                                        <div
                                            className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed transition-colors hover:border-primary hover:bg-secondary/50"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">Click to upload an image</p>
                                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
                                        </div>
                                    </div>
                                </CardContent>
                            </TabsContent>
                        </Tabs>

                        <CardFooter>
                            <Button onClick={handleGenerate} disabled={generating} className="w-full">
                                {generating ? (
                                    <>
                                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                        Generating... {progress}%
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Generate
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right side: Preview - Expanded to take more space */}
                <div className="w-full lg:col-span-2 space-y-4">
                    <Card className="flex flex-col h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle>Preview</CardTitle>
                            <div className="flex items-center gap-2">
                                {generatedImage && (
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
                                            <ZoomOut className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setZoomLevel(100)}>
                                            {zoomLevel}%
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}>
                                            <ZoomIn className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <Button variant="outline" size="icon" onClick={() => setFullscreen(!fullscreen)}>
                                    <Maximize2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div
                                ref={generationContainerRef}
                                className={cn(
                                    "generation-preview relative h-full w-full",
                                    aspectRatio === "1:1" ? "aspect-square" :
                                        aspectRatio === "4:3" ? "aspect-4/3" :
                                            aspectRatio === "16:9" ? "aspect-16/9" :
                                                aspectRatio === "9:16" ? "aspect-9/16" :
                                                    aspectRatio === "2:3" ? "aspect-2/3" :
                                                        "aspect-3/2"
                                )}
                            >
                                {generating ? (
                                    <div className="flex h-full w-full flex-col items-center justify-center">
                                        <RotateCw className="mb-4 h-12 w-12 animate-spin text-primary" />
                                        <Progress value={progress} className="w-2/3 max-w-md" />
                                        <p className="mt-4 text-sm text-muted-foreground">Creating your masterpiece... {progress}%</p>
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            {progress < 30 && "Analyzing prompt..."}
                                            {progress >= 30 && progress < 60 && "Generating base composition..."}
                                            {progress >= 60 && progress < 90 && "Adding details and refining..."}
                                            {progress >= 90 && "Finalizing image..."}
                                        </div>
                                    </div>
                                ) : generatedImage ? (
                                    <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
                                        <div
                                            className="h-full w-full transition-transform duration-300 ease-in-out"
                                            style={{
                                                transform: `scale(${zoomLevel / 100})`,
                                            }}
                                        >
                                            <img
                                                src={generatedImage}
                                                alt="Generated image"
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center bg-muted/20 p-6 text-center">
                                        <div className="rounded-full bg-muted p-4">
                                            <Sparkles className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <p className="mt-4 text-muted-foreground">Your generated image will appear here</p>
                                        <p className="mt-2 text-xs text-muted-foreground">Start by entering a detailed prompt</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        {generatedImage && (
                            <CardFooter className="flex flex-wrap justify-center gap-4 sm:justify-between">
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Save className="mr-2 h-4 w-4" />
                                        Save
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Share
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </Button>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Variations
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Star className="mr-2 h-4 w-4" />
                                        Favorite
                                    </Button>
                                    <Button variant="default" size="sm">
                                        <Send className="mr-2 h-4 w-4" />
                                        Share to Community
                                    </Button>
                                </div>
                            </CardFooter>
                        )}
                    </Card>

                    {/* Visual workflow editor button */}
                    <Button variant="outline" className="w-full">
                        <Layers className="mr-2 h-4 w-4" />
                        Open Visual Workflow Editor
                    </Button>
                </div>
            </div>
        </div>
    );
}