import { Flag, MapPin, Box, Sparkles } from 'lucide-react';

export const availableApis = [
  {
    id: 'api.thing-icos',
    name: 'Thing ThingIco API',
    description: 'Biblioteca com milhares de ícones para qualquer tipo de interface.',
    type: 'Vectors',
    icon: Sparkles,
    basePrice: 0.0005,
    priceFactor: 1.1,
    availability: 'Available',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'api.places',
    name: 'Places API',
    description: 'Imagens de pontos turísticos e lugares famosos ao redor do mundo.',
    type: 'Images',
    icon: MapPin,
    basePrice: 0.002,
    priceFactor: 1.8,
    availability: 'Available',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'api.football-clubs',
    name: 'Football Clubs API',
    description: 'Logos e informações de clubes de futebol ao redor do mundo.',
    type: 'Images',
    icon: Flag,
    basePrice: 0.0015,
    priceFactor: 1.5,
    availability: 'Available',
    color: 'from-blue-500 to-cyan-500',
  },
];
