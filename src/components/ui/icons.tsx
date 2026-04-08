// NutriSihat - Icon Components
// Large, clear icons for elderly users
// Using Lucide React icons

export { 
  Home,
  UtensilsCrossed,
  Pill,
  MessageCircle,
  Activity,
  Heart,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Check,
  X,
  AlertTriangle,
  Info,
  Clock,
  Calendar,
  Bell,
  BellRing,
  Settings,
  User,
  LogOut,
  Search,
  RefreshCw,
  Send,
  Camera,
  Image,
  FileText,
  BookOpen,
  HelpCircle,
  Sun,
  Moon,
  Droplet,
  Leaf,
  Apple,
  Carrot,
  Fish,
  Egg,
  Coffee,
  ArrowLeft,
  ArrowRight,
  Menu,
  MoreVertical,
  Share2,
  Printer,
  Copy,
  Trash2,
  Edit,
  Save,
  X as Cancel,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Bot,
  Mic,
  ThumbsUp,
  ThumbsDown,
  Star,
  Shield,
  ShieldCheck,
  type LucideIcon 
} from 'lucide-react';

// Icon wrapper component with consistent sizing
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  className?: string;
}

const iconSizes = {
  sm: 20,
  default: 24,
  lg: 32,
  xl: 40,
};

function Icon({ icon: IconComponent, size = 'default', className }: IconProps) {
  return (
    <IconComponent 
      size={iconSizes[size]} 
      className={cn('stroke-[2]', className)} 
    />
  );
}

export { Icon, iconSizes };