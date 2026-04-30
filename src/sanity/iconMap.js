// Maps Sanity iconName strings to Lucide React components
import {
  ShieldCheck, ShieldAlert, UserCheck, FileText, MoveRight,
  Landmark, Users, HandHeart, Home, Scale, MessageCircle,
  Zap, Building, Search, Grid,
} from 'lucide-react';

const ICON_MAP = {
  'shield-check': ShieldCheck,
  'shield-alert': ShieldAlert,
  'user-check': UserCheck,
  'file-text': FileText,
  'move-right': MoveRight,
  'landmark': Landmark,
  'users': Users,
  'hand-heart': HandHeart,
  'home': Home,
  'scale': Scale,
  'message-circle': MessageCircle,
  'zap': Zap,
  'building': Building,
  'search': Search,
  'grid': Grid,
};

export function getIcon(name) {
  return ICON_MAP[name] || ShieldCheck;
}

// Maps gradient string from CMS → CSS class
export function gradientToColor(gradient) {
  if (!gradient) return 'from-blue-500 to-indigo-600';
  // CMS stores these as "from-blue-500 to-indigo-600" class strings
  return gradient;
}
