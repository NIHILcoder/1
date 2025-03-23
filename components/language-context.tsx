"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'ru';

// Define translation key type - a union of all possible translation keys
type TranslationKey = keyof typeof translations.en | keyof typeof translations.ru;

// Define context type
type LanguageContextType = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
};

// Translation objects for each language
const translations = {
    en: {
        // Navigation
        'nav.generate': 'Generate',
        'nav.prompt_library': 'Prompt Library',
        'nav.community': 'Community',
        'nav.favorites': 'Favorites',
        'nav.history': 'History',
        'nav.learning': 'Learning',
        'nav.about': 'About',
        'nav.settings': 'Settings',
        'nav.sign_in': 'Sign In',

        // Header
        'header.ai_models': 'AI Models: Online',
        'header.credits': 'credits',

        // Generation Form
        'generation.title': 'Create New Image',
        'generation.image_settings': 'Image Settings',
        'generation.configure_parameters': 'Configure your generation parameters',
        'generation.basic': 'Basic',
        'generation.advanced': 'Advanced',
        'generation.prompt': 'Prompt',
        'generation.ai_enhance': 'AI Enhance',
        'generation.prompt_placeholder': 'Describe your image in detail... (e.g., A serene landscape with mountains, a calm lake under twilight sky with stars beginning to appear)',
        'generation.suggestions': 'Suggestions',
        'generation.save_prompt': 'Save Prompt',
        'generation.negative_prompt': 'Negative Prompt',
        'generation.negative_prompt_placeholder': 'Elements to avoid in the image... (e.g., blurry, bad anatomy, distorted, watermark, signature)',
        'generation.model_selection': 'Model Selection',
        'generation.seed': 'Seed',
        'generation.sampling_steps': 'Sampling Steps',
        'generation.cfg_scale': 'CFG Scale',
        'generation.sampler': 'Sampler',
        'generation.image_to_image': 'Image to Image',
        'generation.upload_image': 'Click to upload an image',
        'generation.generating': 'Generating...',
        'generation.generate': 'Generate',
        'generation.preview': 'Preview',
        'generation.your_image_will_appear': 'Your generated image will appear here',
        'generation.enter_prompt': 'Start by entering a detailed prompt',
        'generation.creating_masterpiece': 'Creating your masterpiece...',
        'generation.analyzing_prompt': 'Analyzing prompt...',
        'generation.generating_composition': 'Generating base composition...',
        'generation.adding_details': 'Adding details and refining...',
        'generation.finalizing': 'Finalizing image...',
        'generation.save': 'Save',
        'generation.share': 'Share',
        'generation.download': 'Download',
        'generation.variations': 'Variations',
        'generation.favorite': 'Favorite',
        'generation.share_community': 'Share to Community',
        'generation.open_workflow': 'Open Visual Workflow Editor',

        // General UI
        'ui.aspect_ratio': 'Aspect Ratio',
        'ui.square': 'Square',
        'ui.standard': 'Standard',
        'ui.widescreen': 'Widescreen',
        'ui.portrait': 'Portrait',
        'ui.landscape': 'Landscape',

        // Login Page
        'login.title': 'Sign in to VisioMera',
        'login.description': 'Enter your email and password to access your account',
        'login.email': 'Email',
        'login.password': 'Password',
        'login.forgot_password': 'Forgot password?',
        'login.sign_in': 'Sign In',
        'login.register': 'Register',
        'login.name': 'Name',
        'login.confirm_password': 'Confirm Password',
        'login.create_account': 'Create Account',
        'login.or_continue_with': 'Or continue with',
        'login.terms_agreement': 'By signing in, you agree to our',
        'login.terms_of_service': 'Terms of Service',
        'login.and': 'and',
        'login.privacy_policy': 'Privacy Policy',

        // Settings Page
        'settings.title': 'Settings',
        'settings.description': 'Manage your account preferences and application settings',
        'settings.tab.account': 'Account',
        'settings.tab.appearance': 'Appearance',
        'settings.tab.notifications': 'Notifications',
        'settings.tab.subscription': 'Subscription',
        'settings.tab.privacy': 'Privacy',
        'settings.tab.api': 'API',
        'settings.profile.title': 'Profile Information',
        'settings.profile.description': 'Manage your account details and public profile',
        'settings.profile.display_name': 'Display Name',
        'settings.profile.username': 'Username',
        'settings.profile.email': 'Email',
        'settings.profile.bio': 'Bio',
        'settings.profile.edit': 'Edit Profile',
        'settings.profile.cancel': 'Cancel',
        'settings.profile.save': 'Save Changes',
        'settings.profile.change_avatar': 'Change Avatar',
        'settings.security.title': 'Account Security',
        'settings.security.description': 'Manage your password and security settings',
        'settings.security.current_password': 'Current Password',
        'settings.security.new_password': 'New Password',
        'settings.security.confirm_password': 'Confirm New Password',
        'settings.security.2fa': 'Two-Factor Authentication',
        'settings.security.2fa_app': 'Authenticator App',
        'settings.security.recommended': 'Recommended',
        'settings.security.2fa_description': 'Use an authenticator app to get two-factor authentication codes',
        'settings.security.enable': 'Enable',
        'settings.security.update': 'Update Security Settings',
        'settings.danger.title': 'Danger Zone',
        'settings.danger.description': 'Irreversible account actions',
        'settings.danger.delete_account': 'Delete Account',
        'settings.danger.delete_warning': 'Once you delete your account, there is no going back. This action cannot be undone.',

        // Community Page
        'community.title': 'Community Hub',
        'community.subtitle': 'Explore creations from the VisioMera community',
        'community.search': 'Search artworks...',
        'community.new_collection': 'New Collection',
        'community.upload': 'Upload Creation',
        'community.featured': 'Featured',
        'community.days_ago': 'days ago',
        'community.hours_ago': 'hours ago',
        'community.just_now': 'Just now',
        'community.view_all': 'View all',

        // History Page
        'history.title': 'Generation History',
        'history.subtitle': 'View and manage your previous generations',
        'history.recent': 'Recent Generations',
        'history.search': 'Search history...',
        'history.filter': 'Filter by',
        'history.all': 'All Images',
        'history.saved': 'Saved Only',
        'history.shared': 'Shared Only',
        'history.grid': 'Grid View',
        'history.list': 'List View',
        'history.export': 'Export History',
        'history.load_more': 'Load More',

        // Favorites Page
        'favorites.title': 'Favorites',
        'favorites.subtitle': 'Organize and manage your saved images',
        'favorites.search': 'Search favorites...',
        'favorites.collections': 'Collections',
        'favorites.create': 'Create Collection',
        'favorites.collection_name': 'Collection Name',
        'favorites.description': 'Description (Optional)',
        'favorites.all_favorites': 'All Favorites',
        'favorites.recently': 'Recently Favorited',

        // About Page
        'about.title': 'About VisioMera',
        'about.subtitle': 'Empowering creativity through AI art generation',
        'about.mission.title': 'Our Mission',
        'about.mission.text1': 'VisioMera was created to democratize digital art creation by making powerful AI tools accessible to everyone. We believe that creativity should not be limited by technical skill, but rather enhanced by technology that helps bring your imagination to life.',
        'about.mission.text2': 'Our platform combines the power of ComfyUI, Flux models, and other cutting-edge AI technologies to provide an intuitive yet powerful interface for creating stunning visual art.',
        'about.developer.title': 'Meet the Developer',
        'about.developer.name': 'Proxy Nihil',
        'about.developer.bio': 'Proxy Nihil is a developer and AI enthusiast passionate about the intersection of technology and creativity. With a background in computer science and digital art, they created VisioMera to bridge the gap between technical complexity and artistic expression.',
        'about.timeline.title': 'Development Timeline',
        'about.timeline.event1.date': 'March 2025',
        'about.timeline.event1.title': 'VisioMera Launch',
        'about.timeline.event1.description': 'Initial release with core generation features and community hub.',
        'about.timeline.event2.date': 'January 2025',
        'about.timeline.event2.title': 'Beta Testing',
        'about.timeline.event2.description': 'Invited users test the platform and provide feedback for improvements.',
        'about.timeline.event3.date': 'October 2024',
        'about.timeline.event3.title': 'Development Begins',
        'about.timeline.event3.description': 'Work starts on creating a user-friendly interface for ComfyUI and Flux models.',
        'about.timeline.event4.date': 'August 2024',
        'about.timeline.event4.title': 'Concept Phase',
        'about.timeline.event4.description': 'Research and planning for an accessible AI art generation platform.',
        'about.tech.title': 'Technology Stack',
        'about.tech.comfy.title': 'ComfyUI',
        'about.tech.comfy.description': 'A powerful and modular UI system for Stable Diffusion and other generative models.',
        'about.tech.flux.title': 'Flux Models',
        'about.tech.flux.description': 'State-of-the-art image generation models optimized for quality and speed.',
        'about.tech.nextjs.title': 'Next.js',
        'about.tech.nextjs.description': 'React framework for building fast and responsive web applications.',
        'about.tech.tailwind.title': 'Tailwind CSS',
        'about.tech.tailwind.description': 'Utility-first CSS framework for rapid UI development.',
        'about.faq.title': 'Frequently Asked Questions',
        'about.contact.title': 'Contact Us',
        'about.contact.name': 'Name',
        'about.contact.email': 'Email',
        'about.contact.subject': 'Subject',
        'about.contact.message': 'Message',
        'about.contact.send': 'Send Message',

        // Prompts Page
        'prompts.title': 'Prompt Library',
        'prompts.subtitle': 'Manage, organize, and share your AI image generation prompts',
        'prompts.search': 'Search prompts...',
        'prompts.new': 'New Prompt',
        'prompts.edit': 'Edit',
        'prompts.delete': 'Delete',
        'prompts.save': 'Save',
        'prompts.use': 'Use Prompt',
        'prompts.copy': 'Copy Prompt',
        'prompts.share': 'Share',
        'prompts.favorite': 'Favorite',
        'prompts.unfavorite': 'Unfavorite',
    },
    ru: {
        // Navigation
        'nav.generate': 'Создать',
        'nav.prompt_library': 'Библиотека промптов',
        'nav.community': 'Сообщество',
        'nav.favorites': 'Избранное',
        'nav.history': 'История',
        'nav.learning': 'Обучение',
        'nav.about': 'О нас',
        'nav.settings': 'Настройки',
        'nav.sign_in': 'Войти',

        // Header
        'header.ai_models': 'ИИ Модели: Онлайн',
        'header.credits': 'кредитов',

        // Generation Form
        'generation.title': 'Создать новое изображение',
        'generation.image_settings': 'Настройки изображения',
        'generation.configure_parameters': 'Настройка параметров генерации',
        'generation.basic': 'Основные',
        'generation.advanced': 'Расширенные',
        'generation.prompt': 'Промпт',
        'generation.ai_enhance': 'ИИ улучшение',
        'generation.prompt_placeholder': 'Опишите ваше изображение подробно... (например, Спокойный пейзаж с горами, тихое озеро в сумерках с появляющимися звездами)',
        'generation.suggestions': 'Подсказки',
        'generation.save_prompt': 'Сохранить промпт',
        'generation.negative_prompt': 'Негативный промпт',
        'generation.negative_prompt_placeholder': 'Элементы, которых следует избегать в изображении... (например, размытость, плохая анатомия, искажения, водяной знак, подпись)',
        'generation.model_selection': 'Выбор модели',
        'generation.seed': 'Сид',
        'generation.sampling_steps': 'Шаги сэмплирования',
        'generation.cfg_scale': 'CFG масштаб',
        'generation.sampler': 'Сэмплер',
        'generation.image_to_image': 'Изображение в изображение',
        'generation.upload_image': 'Нажмите, чтобы загрузить изображение',
        'generation.generating': 'Генерация...',
        'generation.generate': 'Сгенерировать',
        'generation.preview': 'Предпросмотр',
        'generation.your_image_will_appear': 'Ваше изображение появится здесь',
        'generation.enter_prompt': 'Начните с ввода подробного промпта',
        'generation.creating_masterpiece': 'Создаем ваш шедевр...',
        'generation.analyzing_prompt': 'Анализ промпта...',
        'generation.generating_composition': 'Создание базовой композиции...',
        'generation.adding_details': 'Добавление деталей и уточнение...',
        'generation.finalizing': 'Финализация изображения...',
        'generation.save': 'Сохранить',
        'generation.share': 'Поделиться',
        'generation.download': 'Скачать',
        'generation.variations': 'Вариации',
        'generation.favorite': 'В избранное',
        'generation.share_community': 'Поделиться с сообществом',
        'generation.open_workflow': 'Открыть визуальный редактор воркфлоу',

        // General UI
        'ui.aspect_ratio': 'Соотношение сторон',
        'ui.square': 'Квадрат',
        'ui.standard': 'Стандарт',
        'ui.widescreen': 'Широкоэкранный',
        'ui.portrait': 'Портрет',
        'ui.landscape': 'Пейзаж',

        // Login Page
        'login.title': 'Вход в VisioMera',
        'login.description': 'Введите ваш email и пароль для доступа к аккаунту',
        'login.email': 'Email',
        'login.password': 'Пароль',
        'login.forgot_password': 'Забыли пароль?',
        'login.sign_in': 'Войти',
        'login.register': 'Регистрация',
        'login.name': 'Имя',
        'login.confirm_password': 'Подтвердите пароль',
        'login.create_account': 'Создать аккаунт',
        'login.or_continue_with': 'Или продолжить с помощью',
        'login.terms_agreement': 'Входя в систему, вы соглашаетесь с нашими',
        'login.terms_of_service': 'Условиями использования',
        'login.and': 'и',
        'login.privacy_policy': 'Политикой конфиденциальности',

        // Settings Page
        'settings.title': 'Настройки',
        'settings.description': 'Управление предпочтениями аккаунта и настройками приложения',
        'settings.tab.account': 'Аккаунт',
        'settings.tab.appearance': 'Внешний вид',
        'settings.tab.notifications': 'Уведомления',
        'settings.tab.subscription': 'Подписка',
        'settings.tab.privacy': 'Приватность',
        'settings.tab.api': 'API',
        'settings.profile.title': 'Информация профиля',
        'settings.profile.description': 'Управление данными вашего аккаунта и публичного профиля',
        'settings.profile.display_name': 'Отображаемое имя',
        'settings.profile.username': 'Имя пользователя',
        'settings.profile.email': 'Email',
        'settings.profile.bio': 'О себе',
        'settings.profile.edit': 'Редактировать профиль',
        'settings.profile.cancel': 'Отмена',
        'settings.profile.save': 'Сохранить изменения',
        'settings.profile.change_avatar': 'Изменить аватар',
        'settings.security.title': 'Безопасность аккаунта',
        'settings.security.description': 'Управление паролем и настройками безопасности',
        'settings.security.current_password': 'Текущий пароль',
        'settings.security.new_password': 'Новый пароль',
        'settings.security.confirm_password': 'Подтвердите новый пароль',
        'settings.security.2fa': 'Двухфакторная аутентификация',
        'settings.security.2fa_app': 'Приложение-аутентификатор',
        'settings.security.recommended': 'Рекомендуется',
        'settings.security.2fa_description': 'Используйте приложение-аутентификатор для получения кодов двухфакторной аутентификации',
        'settings.security.enable': 'Включить',
        'settings.security.update': 'Обновить настройки безопасности',
        'settings.danger.title': 'Опасная зона',
        'settings.danger.description': 'Необратимые действия с аккаунтом',
        'settings.danger.delete_account': 'Удалить аккаунт',
        'settings.danger.delete_warning': 'После удаления аккаунта пути назад нет. Это действие нельзя отменить.',

        // Community Page
        'community.title': 'Сообщество',
        'community.subtitle': 'Исследуйте работы сообщества VisioMera',
        'community.search': 'Поиск работ...',
        'community.new_collection': 'Новая коллекция',
        'community.upload': 'Загрузить работу',
        'community.featured': 'Рекомендуемые',
        'community.days_ago': 'дней назад',
        'community.hours_ago': 'часов назад',
        'community.just_now': 'Только что',
        'community.view_all': 'Показать все',

        // History Page
        'history.title': 'История генерации',
        'history.subtitle': 'Просмотр и управление вашими предыдущими генерациями',
        'history.recent': 'Недавние генерации',
        'history.search': 'Поиск в истории...',
        'history.filter': 'Фильтровать по',
        'history.all': 'Все изображения',
        'history.saved': 'Только сохраненные',
        'history.shared': 'Только опубликованные',
        'history.grid': 'Сетка',
        'history.list': 'Список',
        'history.export': 'Экспорт истории',
        'history.load_more': 'Загрузить еще',

        // Favorites Page
        'favorites.title': 'Избранное',
        'favorites.subtitle': 'Организуйте и управляйте вашими сохраненными изображениями',
        'favorites.search': 'Поиск в избранном...',
        'favorites.collections': 'Коллекции',
        'favorites.create': 'Создать коллекцию',
        'favorites.collection_name': 'Название коллекции',
        'favorites.description': 'Описание (опционально)',
        'favorites.all_favorites': 'Все избранное',
        'favorites.recently': 'Недавно добавленные',

        // About Page
        'about.title': 'О VisioMera',
        'about.subtitle': 'Расширение возможностей творчества с помощью ИИ-генерации изображений',
        'about.mission.title': 'Наша миссия',
        'about.mission.text1': 'VisioMera создана для демократизации цифрового искусства, делая мощные инструменты ИИ доступными для всех. Мы считаем, что творчество не должно ограничиваться техническими навыками, а должно усиливаться технологиями, которые помогают воплотить ваше воображение в жизнь.',
        'about.mission.text2': 'Наша платформа объединяет возможности ComfyUI, моделей Flux и других передовых технологий ИИ, чтобы предоставить интуитивно понятный, но мощный интерфейс для создания потрясающего визуального искусства.',
        'about.developer.title': 'Познакомьтесь с разработчиком',
        'about.developer.name': 'Proxy Nihil',
        'about.developer.bio': 'Proxy Nihil — разработчик и энтузиаст ИИ, увлеченный точкой пересечения технологий и творчества. Имея опыт в компьютерных науках и цифровом искусстве, он создал VisioMera, чтобы преодолеть разрыв между технической сложностью и художественным самовыражением.',
        'about.timeline.title': 'Хронология разработки',
        'about.timeline.event1.date': 'Март 2025',
        'about.timeline.event1.title': 'Запуск VisioMera',
        'about.timeline.event1.description': 'Первый выпуск с основными функциями генерации и центром сообщества.',
        'about.timeline.event2.date': 'Январь 2025',
        'about.timeline.event2.title': 'Бета-тестирование',
        'about.timeline.event2.description': 'Приглашенные пользователи тестируют платформу и предоставляют отзывы для улучшений.',
        'about.timeline.event3.date': 'Октябрь 2024',
        'about.timeline.event3.title': 'Начало разработки',
        'about.timeline.event3.description': 'Начата работа по созданию удобного интерфейса для ComfyUI и моделей Flux.',
        'about.timeline.event4.date': 'Август 2024',
        'about.timeline.event4.title': 'Концептуальная фаза',
        'about.timeline.event4.description': 'Исследования и планирование доступной платформы генерации искусства ИИ.',
        'about.tech.title': 'Технологический стек',
        'about.tech.comfy.title': 'ComfyUI',
        'about.tech.comfy.description': 'Мощная и модульная UI-система для Stable Diffusion и других генеративных моделей.',
        'about.tech.flux.title': 'Модели Flux',
        'about.tech.flux.description': 'Современные модели генерации изображений, оптимизированные для качества и скорости.',
        'about.tech.nextjs.title': 'Next.js',
        'about.tech.nextjs.description': 'React-фреймворк для создания быстрых и отзывчивых веб-приложений.',
        'about.tech.tailwind.title': 'Tailwind CSS',
        'about.tech.tailwind.description': 'CSS-фреймворк, основанный на утилитах, для быстрой разработки UI.',
        'about.faq.title': 'Часто задаваемые вопросы',
        'about.contact.title': 'Связаться с нами',
        'about.contact.name': 'Имя',
        'about.contact.email': 'Email',
        'about.contact.subject': 'Тема',
        'about.contact.message': 'Сообщение',
        'about.contact.send': 'Отправить сообщение',

        // Prompts Page
        'prompts.title': 'Библиотека промптов',
        'prompts.subtitle': 'Управляйте, организуйте и делитесь промптами для генерации изображений',
        'prompts.search': 'Поиск промптов...',
        'prompts.new': 'Новый промпт',
        'prompts.edit': 'Редактировать',
        'prompts.delete': 'Удалить',
        'prompts.save': 'Сохранить',
        'prompts.use': 'Использовать промпт',
        'prompts.copy': 'Копировать промпт',
        'prompts.share': 'Поделиться',
        'prompts.favorite': 'В избранное',
        'prompts.unfavorite': 'Убрать из избранного',
    }
} as const;

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => {},
    t: (key) => key,
});

// Define props for the language provider
interface LanguageProviderProps {
    children: ReactNode;
}

// Create the language provider component
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    // Initialize with browser language or default to English
    const [language, setLanguage] = useState<Language>('en');

    // Effect to load language preference from localStorage on client side
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ru')) {
            setLanguage(savedLanguage);
        } else {
            // Try to detect browser language
            const browserLanguage = navigator.language.split('-')[0];
            if (browserLanguage === 'ru') {
                setLanguage('ru');
            }
        }
    }, []);

    // Handler for changing the language
    const handleSetLanguage = (newLanguage: Language) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);

        // Optional: Set html lang attribute
        document.documentElement.lang = newLanguage;
    };

    // Translation function
    const t = (key: string): string => {
        // Type assertion to satisfy TypeScript
        if (key in translations[language]) {
            return translations[language][key as keyof typeof translations[typeof language]];
        }

        // Return the key itself if translation not found
        return key;
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage: handleSetLanguage,
                t,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

// Create a custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

// Helper function for page-specific translations
export const useLocalTranslation = (
    pageTranslations: Record<Language, Record<string, string>>
) => {
    const { language, t } = useLanguage();

    const localT = (key: string): string => {
        // First check page-specific translations
        if (pageTranslations[language] && key in pageTranslations[language]) {
            return pageTranslations[language][key];
        }

        // Fall back to global translations
        return t(key);
    };

    return { localT, language };
};