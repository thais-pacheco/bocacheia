import React from 'react';
import { MapPin, Clock } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div 
      className="relative h-80 bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200)'
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-2xl px-4">
          <h1 className="text-5xl font-bold mb-4">Boca Cheia Delivery</h1>
          <p className="text-xl mb-6">Sabores que enchem o coração e a barriga! 💜</p>
          
          <div className="bg-purple-900 bg-opacity-20 backdrop-blur-md rounded-lg p-4 inline-flex items-center space-x-4 border border-purple-300 border-opacity-30">
            <div className="flex items-center space-x-2 text-white">
              <MapPin className="w-5 h-5" />
              <span>Entregamos em toda a cidade</span>
            </div>
            
            <div className="w-px h-6 bg-white opacity-30"></div>
            
            <div className="flex items-center space-x-2 text-white">
              <Clock className="w-5 h-5" />
              <span>Aberto 24h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};