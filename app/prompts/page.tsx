"use client";
import { useScrollLock } from "@/components/hooks/useScrollLock";
import { useState, useRef, useEffect } from "react";
import {
    BookOpen,
    Plus,
    Pencil,
    Trash2,
    Search,
    Tag,
    Star,
    StarHalf,
    Copy,
    Filter,
    SortAsc,
    SortDesc,
    Edit,
    CheckCircle2,
    FolderPlus,
    Bookmark,
    Share2,
    ThumbsUp,
    Download,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Lightbulb,
    Info,
    X,
    ChevronsUpDown,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedParticlesBackground } from "@/components/enhanced-particles-background";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import {
    AnimatedCard,
    AnimatedButton,
    SparkleButton,
    AnimatedCollapsible,
    AnimatedBadge,
    StaggeredContainer
} from "@/components/animated-components";
import { cn } from "@/lib/utils";

// Types
interface Prompt {
    id: string;
    title: string;
    text: string;
    category: string;
    tags: string[];
    favorite: boolean;
    rating: number;
    createdAt: string;
    updatedAt: string;
    usageCount: number;
    negative?: string;
    parameters?: {
        [key: string]: any;
    };
    notes?: string;
    isPublic: boolean;
    author?: string;
}

interface Category {
    id: string;
    name: string;
    count: number;
    color?: string;
}

interface Tag {
    id: string;
    name: string;
    count: number;
}

export default function PromptLibrary() {
    // State
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeTab, setActiveTab] = useState("my-prompts");
    const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
    const [sortBy, setSortBy] = useState("updated");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [promptDialogOpen, setPromptDialogOpen] = useState<boolean>(false);
    const [createPromptOpen, setCreatePromptOpen] = useState<boolean>(false);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    useScrollLock(promptDialogOpen);
    useScrollLock(createPromptOpen);

    // Form state for creating/editing prompts
    const [formState, setFormState] = useState({
        title: "",
        text: "",
        category: "",
        tags: [] as string[],
        negative: "",
        notes: "",
        isPublic: false
    });
    const [tagInput, setTagInput] = useState("");

    // Store references for DOM elements
    const tagInputRef = useRef<HTMLInputElement>(null);

    // Mock data for categories
    const categories: Category[] = [
        { id: "all", name: "All Prompts", count: 42 },
        { id: "portraits", name: "Portraits", count: 12, color: "#f97316" },
        { id: "landscapes", name: "Landscapes", count: 8, color: "#84cc16" },
        { id: "fantasy", name: "Fantasy", count: 7, color: "#8b5cf6" },
        { id: "scifi", name: "Sci-Fi", count: 5, color: "#06b6d4" },
        { id: "abstract", name: "Abstract", count: 4, color: "#ec4899" },
        { id: "animals", name: "Animals", count: 3, color: "#f59e0b" },
        { id: "architecture", name: "Architecture", count: 3, color: "#64748b" }
    ];

    // Mock data for tags
    const tags: Tag[] = [
        { id: "detailed", name: "detailed", count: 28 },
        { id: "photorealistic", name: "photorealistic", count: 22 },
        { id: "8k", name: "8k", count: 18 },
        { id: "cinematic", name: "cinematic", count: 15 },
        { id: "colorful", name: "colorful", count: 14 },
        { id: "dramatic", name: "dramatic", count: 12 },
        { id: "professional", name: "professional", count: 10 },
        { id: "sharp", name: "sharp focus", count: 9 },
        { id: "sunlight", name: "sunlight", count: 8 },
        { id: "sci-fi", name: "sci-fi", count: 7 },
        { id: "medieval", name: "medieval", count: 6 },
        { id: "vibrant", name: "vibrant", count: 5 }
    ];

    // Generate mock prompts data
    const generatePrompts = (): Prompt[] => {
        const samplePrompts = [
            {
                title: "Serene Landscape",
                text: "A serene landscape with mountains in the background, a calm lake reflecting the sky, surrounded by pine trees, golden hour lighting, highly detailed, 8k, photorealistic",
                category: "landscapes",
                tags: ["nature", "mountains", "detailed", "8k"],
                negative: "blurry, oversaturated, low quality"
            },
            {
                title: "Portrait of a Woman",
                text: "Portrait of a young woman with blue eyes and long blonde hair, soft lighting, photorealistic, studio quality, detailed features, 8k resolution, professional photography",
                category: "portraits",
                tags: ["portrait", "photorealistic", "detailed", "8k"],
                negative: "blurry, disfigured, disproportionate, low quality"
            },
            {
                title: "Fantasy Castle",
                text: "A majestic fantasy castle on a floating island, waterfalls cascading down the sides, surrounded by clouds, magical atmosphere, dramatic lighting, detailed architecture, cinematic shot",
                category: "fantasy",
                tags: ["castle", "fantasy", "dramatic", "cinematic"],
                negative: "blurry, cartoon, anime, low quality"
            },
            {
                title: "Cyberpunk Street",
                text: "Cyberpunk night street scene with neon lights, futuristic buildings, flying cars, rainy atmosphere, reflective surfaces, high tech advertisements, highly detailed, cinematic lighting",
                category: "scifi",
                tags: ["cyberpunk", "city", "neon", "detailed"],
                negative: "daylight, low buildings, rural, low resolution"
            },
            {
                title: "Abstract Painting",
                text: "Abstract painting with vibrant colors, flowing shapes and patterns, expressionist style, modern art, high resolution, detailed brush strokes, museum quality",
                category: "abstract",
                tags: ["abstract", "colorful", "vibrant", "artistic"],
                negative: "photorealistic, defined shapes, people, faces"
            },
            {
                title: "Medieval Town",
                text: "A medieval European town with cobblestone streets, timber-framed buildings, a central marketplace, people in period clothing, misty morning atmosphere, highly detailed, cinematic composition",
                category: "architecture",
                tags: ["medieval", "town", "historical", "cinematic"],
                negative: "modern elements, cars, technology, anachronisms"
            },
            {
                title: "Underwater Scene",
                text: "Vibrant coral reef underwater scene with colorful fish, sea turtles, rays of sunlight penetrating the water surface, clear blue water, photorealistic, highly detailed",
                category: "landscapes",
                tags: ["underwater", "ocean", "colorful", "detailed"],
                negative: "above water, dark, murky, blurry"
            },
            {
                title: "Magical Forest",
                text: "An enchanted forest with giant glowing mushrooms, fairy lights floating between ancient trees, magical mist, moonlight filtering through the canopy, highly detailed, fantasy atmosphere",
                category: "fantasy",
                tags: ["forest", "magical", "night", "detailed"],
                negative: "daylight, desert, urban, realistic"
            }
        ];

        return samplePrompts.map((prompt, index) => {
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60));

            const updatedDate = new Date(createdDate);
            updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 30));

            return {
                id: `prompt-${index + 1}`,
                title: prompt.title,
                text: prompt.text,
                category: prompt.category,
                tags: prompt.tags,
                favorite: Math.random() > 0.7,
                rating: Math.floor(Math.random() * 5) + 1,
                createdAt: createdDate.toISOString(),
                updatedAt: updatedDate.toISOString(),
                usageCount: Math.floor(Math.random() * 50),
                negative: prompt.negative,
                parameters: {
                    seed: Math.floor(Math.random() * 1000000),
                    steps: 30,
                    cfg: 7.5,
                    sampler: "Euler a"
                },
                notes: Math.random() > 0.5 ? "This prompt works best with higher CFG values. Try different samplers for varied results." : "",
                isPublic: Math.random() > 0.5
            };
        });
    };

    const [prompts, setPrompts] = useState<Prompt[]>(generatePrompts());

    // Community prompts mock data
    const communityPrompts: Prompt[] = [
        {
            id: "community-1",
            title: "Epic Dragon",
            text: "Epic dragon perched on a mountain peak, breathing fire, scales glistening in the sunlight, majestic wings spread wide, detailed texture, fantasy atmosphere, cinematic lighting, 8k",
            category: "fantasy",
            tags: ["dragon", "fantasy", "epic", "detailed"],
            favorite: false,
            rating: 5,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            usageCount: 352,
            isPublic: true,
            author: "DragonMaster"
        },
        {
            id: "community-2",
            title: "Space Station",
            text: "Futuristic space station orbiting Earth, detailed mechanical structures, solar panels, docking bays, Earth visible in the background, stars, cosmic atmosphere, sci-fi, 8k resolution",
            category: "scifi",
            tags: ["space", "sci-fi", "futuristic", "detailed"],
            favorite: false,
            rating: 4,
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            usageCount: 289,
            isPublic: true,
            author: "CosmicCreator"
        },
        {
            id: "community-3",
            title: "Renaissance Portrait",
            text: "Renaissance style portrait in the manner of Leonardo da Vinci, young woman with enigmatic smile, detailed fabric, soft lighting, realistic skin texture, 16th century style, museum quality",
            category: "portraits",
            tags: ["renaissance", "portrait", "artistic", "historical"],
            favorite: false,
            rating: 5,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            usageCount: 421,
            isPublic: true,
            author: "ArtisticSoul"
        }
    ];

    // Example prompt templates
    const promptTemplates = [
        {
            title: "Character Portrait",
            text: "[gender] with [hair color] hair and [eye color] eyes, [clothing], [expression], photorealistic, detailed features, professional photography, 8k",
            category: "portraits",
            description: "A template for creating portrait images of characters"
        },
        {
            title: "Fantasy Landscape",
            text: "A [adjective] fantasy landscape with [feature], [time of day] atmosphere, [weather condition], [style] style, detailed, 8k",
            category: "landscapes",
            description: "Create magical and fantastical landscape scenes"
        },
        {
            title: "Sci-Fi Environment",
            text: "A [adjective] sci-fi [environment type], futuristic technology, [lighting condition], highly detailed, [perspective], cinematic, 8k",
            category: "scifi",
            description: "Generate futuristic sci-fi environments"
        }
    ];

    // Filter and sort prompts based on current state
    useEffect(() => {
        let filtered = [...prompts];

        // Filter by category
        if (activeCategory !== "all") {
            filtered = filtered.filter(prompt => prompt.category === activeCategory);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(prompt =>
                prompt.title.toLowerCase().includes(query) ||
                prompt.text.toLowerCase().includes(query) ||
                prompt.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Filter by favorites
        if (showOnlyFavorites) {
            filtered = filtered.filter(prompt => prompt.favorite);
        }

        // Sort prompts
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case "title":
                    comparison = a.title.localeCompare(b.title);
                    break;
                case "created":
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case "updated":
                    comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
                    break;
                case "usage":
                    comparison = a.usageCount - b.usageCount;
                    break;
                case "rating":
                    comparison = a.rating - b.rating;
                    break;
                default:
                    comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            }

            return sortDirection === "asc" ? comparison : -comparison;
        });

        setFilteredPrompts(filtered);
    }, [prompts, activeCategory, searchQuery, sortBy, sortDirection, showOnlyFavorites]);

    // Handle prompt selection
    const handleSelectPrompt = (prompt: Prompt) => {
        setSelectedPrompt(prompt);
        setPromptDialogOpen(true);
        setEditMode(false);
    };

    // Handle prompt favorite toggle
    const handleToggleFavorite = (e: React.MouseEvent, promptId: string) => {
        e.stopPropagation();
        setPrompts(prev =>
            prev.map(p => p.id === promptId ? { ...p, favorite: !p.favorite } : p)
        );
    };

    // Direct toggle favorite without event (for non-event contexts)
    const toggleFavorite = (promptId: string) => {
        setPrompts(prev =>
            prev.map(p => p.id === promptId ? { ...p, favorite: !p.favorite } : p)
        );
    };

    // Handle prompt deletion
    const handleDeletePrompt = (promptId: string) => {
        setPrompts(prev => prev.filter(p => p.id !== promptId));
        setPromptDialogOpen(false);
    };

    // Handle prompt copy
    const handleCopyPrompt = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast message here
    };

    // Handle tag addition in form
    const handleAddTag = () => {
        if (tagInput.trim() && !formState.tags.includes(tagInput.trim())) {
            setFormState(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput("");
            tagInputRef.current?.focus();
        }
    };

    // Handle tag removal in form
    const handleRemoveTag = (tag: string) => {
        setFormState(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    // Reset form for new prompt
    const resetForm = () => {
        setFormState({
            title: "",
            text: "",
            category: "",
            tags: [],
            negative: "",
            notes: "",
            isPublic: false
        });
        setTagInput("");
        setEditMode(false);
    };

    // Start editing prompt
    const startEditPrompt = () => {
        if (selectedPrompt) {
            setFormState({
                title: selectedPrompt.title,
                text: selectedPrompt.text,
                category: selectedPrompt.category,
                tags: [...selectedPrompt.tags],
                negative: selectedPrompt.negative || "",
                notes: selectedPrompt.notes || "",
                isPublic: selectedPrompt.isPublic
            });
            setEditMode(true);
        }
    };

    // Save prompt (new or edited)
    const handleSavePrompt = () => {
        if (formState.title.trim() === "" || formState.text.trim() === "") {
            // Could show validation error
            return;
        }

        const now = new Date().toISOString();

        if (editMode && selectedPrompt) {
            // Update existing prompt
            setPrompts(prev =>
                prev.map(p => p.id === selectedPrompt.id ? {
                    ...p,
                    title: formState.title,
                    text: formState.text,
                    category: formState.category,
                    tags: formState.tags,
                    negative: formState.negative,
                    notes: formState.notes,
                    isPublic: formState.isPublic,
                    updatedAt: now
                } : p)
            );
        } else {
            // Create new prompt
            const newPrompt: Prompt = {
                id: `prompt-${Date.now()}`,
                title: formState.title,
                text: formState.text,
                category: formState.category,
                tags: formState.tags,
                favorite: false,
                rating: 0,
                createdAt: now,
                updatedAt: now,
                usageCount: 0,
                negative: formState.negative,
                notes: formState.notes,
                isPublic: formState.isPublic
            };

            setPrompts(prev => [newPrompt, ...prev]);
        }

        resetForm();
        setPromptDialogOpen(false);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    // Get active prompt list based on tab
    const getActivePromptList = () => {
        return activeTab === "my-prompts" ? filteredPrompts : communityPrompts;
    };

    // Render star rating
    const renderStarRating = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />);
        }

        if (hasHalfStar) {
            stars.push(<StarHalf key="half" className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />);
        }

        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-3.5 w-3.5 text-muted-foreground" />);
        }

        return <div className="flex">{stars}</div>;
    };

    return (
        <div className="container relative mx-auto py-8">
            <EnhancedParticlesBackground variant="bubbles" density={50} />

            {/* Header */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <BookOpen className="h-8 w-8 text-primary" />
                            Prompt Library
                        </h1>
                        <p className="text-muted-foreground">Manage, organize, and share your AI image generation prompts</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search prompts..."
                                className="pl-8 w-full md:w-[200px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex border rounded-md overflow-hidden">
                            <Button
                                variant={viewMode === "grid" ? "secondary" : "ghost"}
                                size="icon"
                                className="h-9 w-9 rounded-none"
                                onClick={() => setViewMode("grid")}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="3" y="3" width="7" height="7" />
                                    <rect x="14" y="3" width="7" height="7" />
                                    <rect x="3" y="14" width="7" height="7" />
                                    <rect x="14" y="14" width="7" height="7" />
                                </svg>
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "secondary" : "ghost"}
                                size="icon"
                                className="h-9 w-9 rounded-none"
                                onClick={() => setViewMode("list")}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="8" y1="6" x2="21" y2="6" />
                                    <line x1="8" y1="12" x2="21" y2="12" />
                                    <line x1="8" y1="18" x2="21" y2="18" />
                                    <line x1="3" y1="6" x2="3.01" y2="6" />
                                    <line x1="3" y1="12" x2="3.01" y2="12" />
                                    <line x1="3" y1="18" x2="3.01" y2="18" />
                                </svg>
                            </Button>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <SparkleButton>
                                    <Plus className="h-4 w-4" />
                                    New Prompt
                                </SparkleButton>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Prompt</DialogTitle>
                                    <DialogDescription>
                                        Add a new prompt to your library. Detailed prompts produce better results.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="Give your prompt a descriptive title"
                                            value={formState.title}
                                            onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="prompt-text">Prompt Text</Label>
                                        <Textarea
                                            id="prompt-text"
                                            placeholder="Enter your detailed prompt here..."
                                            className="min-h-[120px]"
                                            value={formState.text}
                                            onChange={(e) => setFormState(prev => ({ ...prev, text: e.target.value }))}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
                                        <Textarea
                                            id="negative-prompt"
                                            placeholder="Elements to avoid in your generation..."
                                            value={formState.negative}
                                            onChange={(e) => setFormState(prev => ({ ...prev, negative: e.target.value }))}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Select
                                                value={formState.category}
                                                onValueChange={(value) => setFormState(prev => ({ ...prev, category: value }))}
                                            >
                                                <SelectTrigger id="category">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.filter(c => c.id !== "all").map(category => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="add-tag">Tags</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="add-tag"
                                                    ref={tagInputRef}
                                                    placeholder="Add tag"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                                />
                                                <Button type="button" size="sm" onClick={handleAddTag}>
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {formState.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {formState.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                                    {tag}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                                                        onClick={() => handleRemoveTag(tag)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    <div className="grid gap-2">
                                        <Label htmlFor="notes">Notes (Optional)</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Add any notes about this prompt..."
                                            value={formState.notes}
                                            onChange={(e) => setFormState(prev => ({ ...prev, notes: e.target.value }))}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2 pt-2">
                                        <Switch
                                            id="public-prompt"
                                            checked={formState.isPublic}
                                            onCheckedChange={(checked) => setFormState(prev => ({ ...prev, isPublic: checked }))}
                                        />
                                        <Label htmlFor="public-prompt">Share with community</Label>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => resetForm()}>Cancel</Button>
                                    <Button onClick={handleSavePrompt}>Save Prompt</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {/* Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="space-y-1">
                                {categories.map(category => (
                                    <Button
                                        key={category.id}
                                        variant={activeCategory === category.id ? "secondary" : "ghost"}
                                        className="w-full justify-start"
                                        onClick={() => setActiveCategory(category.id)}
                                    >
                                        {category.id !== "all" && (
                                            <div
                                                className="mr-2 h-2 w-2 rounded-full"
                                                style={{ backgroundColor: category.color || "#888" }}
                                            />
                                        )}
                                        {category.name}
                                        <Badge variant="outline" className="ml-auto">
                                            {category.count}
                                        </Badge>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Popular Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-1">
                                {tags.map(tag => (
                                    <Badge
                                        key={tag.id}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-secondary"
                                        onClick={() => setSearchQuery(tag.name)}
                                    >
                                        {tag.name} ({tag.count})
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Prompt Templates</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Accordion type="single" collapsible className="w-full">
                                {promptTemplates.map((template, index) => (
                                    <AccordionItem key={index} value={`template-${index}`}>
                                        <AccordionTrigger className="px-4">{template.title}</AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">{template.description}</p>
                                                <div className="rounded-md bg-muted p-2 text-sm">
                                                    <code>{template.text}</code>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => {
                                                        setFormState({
                                                            ...formState,
                                                            title: template.title,
                                                            text: template.text,
                                                            category: template.category
                                                        });
                                                        setPromptDialogOpen(true);
                                                    }}
                                                >
                                                    Use Template
                                                </Button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Lightbulb className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-medium">Prompt Writing Tips</h3>
                                <p className="text-sm text-muted-foreground">
                                    Be specific about details, lighting, camera angles, and styles. Include keywords like "high resolution" and "detailed".
                                </p>
                                <Button variant="link" size="sm">Learn More</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 space-y-6">
                    <Tabs defaultValue="my-prompts" value={activeTab} onValueChange={setActiveTab}>
                        <div className="flex items-center justify-between">
                            <TabsList>
                                <TabsTrigger value="my-prompts">My Prompts</TabsTrigger>
                                <TabsTrigger value="community">Community</TabsTrigger>
                            </TabsList>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="favorites-only"
                                        checked={showOnlyFavorites}
                                        onCheckedChange={setShowOnlyFavorites}
                                    />
                                    <Label htmlFor="favorites-only" className="text-xs">Favorites Only</Label>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-1">
                                            <span>Sort</span>
                                            <ChevronsUpDown className="h-3.5 w-3.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => setSortBy("title")}
                                            className={sortBy === "title" ? "bg-muted" : ""}
                                        >
                                            Title
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setSortBy("created")}
                                            className={sortBy === "created" ? "bg-muted" : ""}
                                        >
                                            Date Created
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setSortBy("updated")}
                                            className={sortBy === "updated" ? "bg-muted" : ""}
                                        >
                                            Date Updated
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setSortBy("usage")}
                                            className={sortBy === "usage" ? "bg-muted" : ""}
                                        >
                                            Usage Count
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setSortBy("rating")}
                                            className={sortBy === "rating" ? "bg-muted" : ""}
                                        >
                                            Rating
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
                                            {sortDirection === "asc" ? (
                                                <div className="flex items-center">
                                                    <SortAsc className="mr-2 h-4 w-4" />
                                                    Ascending
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <SortDesc className="mr-2 h-4 w-4" />
                                                    Descending
                                                </div>
                                            )}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <TabsContent value="my-prompts" className="mt-6">
                            {getActivePromptList().length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed bg-muted/20">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <BookOpen className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">No prompts found</h3>
                                    <p className="text-muted-foreground text-center max-w-xs mb-4">
                                        {searchQuery || activeCategory !== "all" || showOnlyFavorites
                                            ? "Try changing your search or filters"
                                            : "Create your first prompt to get started"
                                        }
                                    </p>
                                    {searchQuery || activeCategory !== "all" || showOnlyFavorites ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setActiveCategory("all");
                                                setShowOnlyFavorites(false);
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                    ) : (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Create Prompt
                                                </Button>
                                            </DialogTrigger>
                                            {/* Dialog content for new prompt */}
                                        </Dialog>
                                    )}
                                </div>
                            ) : viewMode === "grid" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {getActivePromptList().map(prompt => (
                                        <AnimatedCard
                                            key={prompt.id}
                                            className="overflow-hidden cursor-pointer group"
                                            onClick={() => handleSelectPrompt(prompt)}
                                        >
                                            <div className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="font-medium line-clamp-1">{prompt.title}</h3>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-muted-foreground"
                                                        onClick={(e) => handleToggleFavorite(e, prompt.id)}
                                                    >
                                                        <Star
                                                            className={cn(
                                                                "h-4 w-4",
                                                                prompt.favorite ? "fill-yellow-500 text-yellow-500" : ""
                                                            )}
                                                        />
                                                    </Button>
                                                </div>

                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                                                    {prompt.text}
                                                </p>

                                                {prompt.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {prompt.tags.slice(0, 3).map(tag => (
                                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {prompt.tags.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{prompt.tags.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-muted/30 border-t text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <ThumbsUp className="h-3.5 w-3.5" />
                                                        <span>{prompt.usageCount}</span>
                                                    </div>
                                                    <span>·</span>
                                                    <span>{formatDate(prompt.updatedAt)}</span>
                                                </div>

                                                <div className="flex gap-1">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCopyPrompt(prompt.text);
                                                                    }}
                                                                >
                                                                    <Copy className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Copy prompt</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6"
                                                            >
                                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
                                                                    <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                                                </svg>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCopyPrompt(prompt.text);
                                                                }}
                                                            >
                                                                <Copy className="mr-2 h-4 w-4" />
                                                                Copy Prompt
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSelectPrompt(prompt);
                                                                    startEditPrompt();
                                                                }}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            {prompt.isPublic ? (
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        // Set to private
                                                                        setPrompts(prev => prev.map(p =>
                                                                            p.id === prompt.id ? { ...p, isPublic: false } : p
                                                                        ));
                                                                    }}
                                                                >
                                                                    <Share2 className="mr-2 h-4 w-4" />
                                                                    Make Private
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        // Set to public
                                                                        setPrompts(prev => prev.map(p =>
                                                                            p.id === prompt.id ? { ...p, isPublic: true } : p
                                                                        ));
                                                                    }}
                                                                >
                                                                    <Share2 className="mr-2 h-4 w-4" />
                                                                    Share Publicly
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeletePrompt(prompt.id);
                                                                }}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </AnimatedCard>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {getActivePromptList().map(prompt => (
                                        <AnimatedCard
                                            key={prompt.id}
                                            className="overflow-hidden cursor-pointer group"
                                            onClick={() => handleSelectPrompt(prompt)}
                                        >
                                            <div className="flex justify-between p-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium truncate">{prompt.title}</h3>
                                                        {prompt.favorite && (
                                                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                                                        )}
                                                        {prompt.category && (
                                                            <Badge variant="outline" className="hidden sm:inline-flex">
                                                                {categories.find(c => c.id === prompt.category)?.name || prompt.category}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1 sm:line-clamp-2">
                                                        {prompt.text}
                                                    </p>

                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                            <span>{prompt.tags.length} tags</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <ThumbsUp className="h-3.5 w-3.5" />
                                                            <span>{prompt.usageCount} uses</span>
                                                        </div>
                                                        <span className="hidden sm:inline-block">
                              Updated {formatDate(prompt.updatedAt)}
                            </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-between ml-4">
                                                    <div className="flex items-center gap-2">
                                                        {renderStarRating(prompt.rating)}

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground"
                                                            onClick={(e) => handleToggleFavorite(e, prompt.id)}
                                                        >
                                                            <Star
                                                                className={cn(
                                                                    "h-4 w-4",
                                                                    prompt.favorite ? "fill-yellow-500 text-yellow-500" : ""
                                                                )}
                                                            />
                                                        </Button>
                                                    </div>

                                                    <div className="flex gap-1 mt-auto">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCopyPrompt(prompt.text);
                                                            }}
                                                        >
                                                            <Copy className="h-3.5 w-3.5" />
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSelectPrompt(prompt);
                                                                startEditPrompt();
                                                            }}
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7"
                                                                >
                                                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
                                                                        <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                                                    </svg>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCopyPrompt(prompt.text);
                                                                    }}
                                                                >
                                                                    <Copy className="mr-2 h-4 w-4" />
                                                                    Copy Prompt
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        // Toggle share status
                                                                        setPrompts(prev => prev.map(p =>
                                                                            p.id === prompt.id ? { ...p, isPublic: !p.isPublic } : p
                                                                        ));
                                                                    }}
                                                                >
                                                                    <Share2 className="mr-2 h-4 w-4" />
                                                                    {prompt.isPublic ? "Make Private" : "Share Publicly"}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-destructive"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeletePrompt(prompt.id);
                                                                    }}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </div>
                                        </AnimatedCard>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="community" className="mt-6">
                            <div className="bg-muted/30 rounded-lg p-4 mb-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <Info className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium">Community Prompts</h3>
                                        <p className="text-muted-foreground">
                                            Explore and use prompts shared by the VisioMera community. Save your favorites to your library.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {communityPrompts.map(prompt => (
                                    <AnimatedCard
                                        key={prompt.id}
                                        className="overflow-hidden cursor-pointer group border-primary/10"
                                        onClick={() => handleSelectPrompt(prompt)}
                                    >
                                        <div className="p-4">
                                            <div className="flex items-start justify-between">
                                                <h3 className="font-medium line-clamp-1">{prompt.title}</h3>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground"
                                                    onClick={(e) => handleToggleFavorite(e, prompt.id)}
                                                >
                                                    <Star
                                                        className={cn(
                                                            "h-4 w-4",
                                                            prompt.favorite ? "fill-yellow-500 text-yellow-500" : ""
                                                        )}
                                                    />
                                                </Button>
                                            </div>

                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                                                {prompt.text}
                                            </p>

                                            {prompt.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {prompt.tags.slice(0, 3).map(tag => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    {prompt.tags.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{prompt.tags.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-muted/30 border-t text-xs text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                {prompt.author && (
                                                    <>
                                                        <span>By {prompt.author}</span>
                                                        <span>·</span>
                                                    </>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp className="h-3.5 w-3.5" />
                                                    <span>{prompt.usageCount}</span>
                                                </div>
                                            </div>

                                            <div>
                                                {renderStarRating(prompt.rating)}
                                            </div>
                                        </div>
                                    </AnimatedCard>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Prompt View/Edit Dialog */}
            {selectedPrompt && (
                <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                <span>{editMode ? "Edit Prompt" : selectedPrompt.title}</span>
                                {!editMode && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 rounded-full"
                                        onClick={() => startEditPrompt()}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                )}
                            </DialogTitle>
                        </DialogHeader>

                        {editMode ? (
                            // Edit form
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-title">Title</Label>
                                    <Input
                                        id="edit-title"
                                        value={formState.title}
                                        onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-prompt-text">Prompt Text</Label>
                                    <Textarea
                                        id="edit-prompt-text"
                                        className="min-h-[120px]"
                                        value={formState.text}
                                        onChange={(e) => setFormState(prev => ({ ...prev, text: e.target.value }))}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-negative-prompt">Negative Prompt</Label>
                                    <Textarea
                                        id="edit-negative-prompt"
                                        value={formState.negative}
                                        onChange={(e) => setFormState(prev => ({ ...prev, negative: e.target.value }))}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-category">Category</Label>
                                        <Select
                                            value={formState.category}
                                            onValueChange={(value) => setFormState(prev => ({ ...prev, category: value }))}
                                        >
                                            <SelectTrigger id="edit-category">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.filter(c => c.id !== "all").map(category => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-add-tag">Tags</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="edit-add-tag"
                                                ref={tagInputRef}
                                                placeholder="Add tag"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                            />
                                            <Button type="button" size="sm" onClick={handleAddTag}>
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {formState.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {formState.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                                {tag}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                                                    onClick={() => handleRemoveTag(tag)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-notes">Notes</Label>
                                    <Textarea
                                        id="edit-notes"
                                        value={formState.notes}
                                        onChange={(e) => setFormState(prev => ({ ...prev, notes: e.target.value }))}
                                    />
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Switch
                                        id="edit-public-prompt"
                                        checked={formState.isPublic}
                                        onCheckedChange={(checked) => setFormState(prev => ({ ...prev, isPublic: checked }))}
                                    />
                                    <Label htmlFor="edit-public-prompt">Share with community</Label>
                                </div>

                                <DialogFooter className="mt-4">
                                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                                    <Button onClick={handleSavePrompt}>Save Changes</Button>
                                </DialogFooter>
                            </div>
                        ) : (
                            // View mode
                            <div className="py-4">
                                {/* Prompt text */}
                                <div className="space-y-4">
                                    <div className="rounded-md border bg-muted/20 p-4">
                                        <ScrollArea className="h-[150px]">
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-xs text-muted-foreground mb-1 block">Prompt</Label>
                                                    <p className="text-sm">{selectedPrompt.text}</p>
                                                </div>

                                                {selectedPrompt.negative && (
                                                    <div>
                                                        <Label className="text-xs text-muted-foreground mb-1 block">Negative Prompt</Label>
                                                        <p className="text-sm">{selectedPrompt.negative}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </div>

                                    {/* Metadata */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-muted-foreground mb-1 block">Category</Label>
                                            <Badge variant="outline">
                                                {categories.find(c => c.id === selectedPrompt.category)?.name || selectedPrompt.category}
                                            </Badge>
                                        </div>

                                        <div>
                                            <Label className="text-xs text-muted-foreground mb-1 block">Created</Label>
                                            <p className="text-sm">{formatDate(selectedPrompt.createdAt)}</p>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <Label className="text-xs text-muted-foreground mb-1 block">Tags</Label>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedPrompt.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Notes if available */}
                                    {selectedPrompt.notes && (
                                        <div>
                                            <Label className="text-xs text-muted-foreground mb-1 block">Notes</Label>
                                            <p className="text-sm bg-muted/20 p-2 rounded">{selectedPrompt.notes}</p>
                                        </div>
                                    )}

                                    {/* Parameters if available */}
                                    {selectedPrompt.parameters && (
                                        <div>
                                            <Label className="text-xs text-muted-foreground mb-1 block">Parameters</Label>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                {Object.entries(selectedPrompt.parameters).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between">
                                                        <span className="font-medium">{key}:</span>
                                                        <span>{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopyPrompt(selectedPrompt.text)}
                                        >
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy Prompt
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={cn(
                                                selectedPrompt.favorite ? "bg-primary/5 border-primary/20" : ""
                                            )}
                                            onClick={() => toggleFavorite(selectedPrompt.id)}
                                        >
                                            <Star
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedPrompt.favorite ? "fill-yellow-500 text-yellow-500" : ""
                                                )}
                                            />
                                            {selectedPrompt.favorite ? "Favorited" : "Favorite"}
                                        </Button>
                                    </div>

                                    <Button
                                        variant="default"
                                        onClick={() => {
                                            // Simulate using the prompt for generation
                                            setPrompts(prev =>
                                                prev.map(p => p.id === selectedPrompt.id ?
                                                    { ...p, usageCount: p.usageCount + 1 } : p
                                                )
                                            );
                                            setPromptDialogOpen(false);
                                            // Here you would actually set up a generation with this prompt
                                        }}
                                    >
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Use Prompt
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}