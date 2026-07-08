import {
  Home,
  Heart,
  HeartOff,
  Search,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Star,
  Trash2,
} from 'lucide-react-native';

type IoniconsName =
  | 'home'
  | 'home-outline'
  | 'heart'
  | 'heart-outline'
  | 'heart-dislike-outline'
  | 'search'
  | 'arrow-back'
  | 'alert-circle'
  | 'refresh'
  | 'trash';

type FontAwesomeName = 'star';

interface IconProps {
  size?: number;
  color?: string;
  style?: unknown;
}

interface IoniconsProps extends IconProps {
  name: IoniconsName;
}

interface FontAwesomeProps extends IconProps {
  name: FontAwesomeName;
}

export function Ionicons({ name, size = 24, color = '#000000' }: IoniconsProps) {
  switch (name) {
    case 'home':
      return <Home size={size} color={color} fill={color} />;
    case 'home-outline':
      return <Home size={size} color={color} fill="transparent" />;
    case 'heart':
      return <Heart size={size} color={color} fill={color} />;
    case 'heart-outline':
      return <Heart size={size} color={color} fill="transparent" />;
    case 'heart-dislike-outline':
      return <HeartOff size={size} color={color} />;
    case 'search':
      return <Search size={size} color={color} />;
    case 'arrow-back':
      return <ArrowLeft size={size} color={color} />;
    case 'alert-circle':
      return <AlertCircle size={size} color={color} />;
    case 'refresh':
      return <RefreshCw size={size} color={color} />;
    case 'trash':
      return <Trash2 size={size} color={color} />;
  }
}

export function FontAwesome({ name, size = 24, color = '#000000' }: FontAwesomeProps) {
  switch (name) {
    case 'star':
      return <Star size={size} color={color} fill={color} />;
  }
}
