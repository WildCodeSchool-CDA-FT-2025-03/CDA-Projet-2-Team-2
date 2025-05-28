import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Building2, AlertCircle } from 'lucide-react';

type SearchSectionProps = {
  handleSearchCallback: (searchQuery: string, searchType: 'social' | 'department') => void;
  error: boolean;
  loading: boolean;
};

export default function SearchSection({
  handleSearchCallback,
  error,
  loading,
}: SearchSectionProps) {
  const [searchType, setSearchType] = useState<'social' | 'department'>('social');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    handleSearchCallback(searchQuery, searchType);
  };

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-1"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-borderColor p-6">
        <h2 className="text-xl font-semibold text-blue mb-6 flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Recherche
        </h2>

        <div className="mb-6">
          <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchType('social')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                searchType === 'social'
                  ? 'bg-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue'
              }`}
            >
              <User className="w-4 h-4 inline mr-1" />
              Patient
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchType('department')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                searchType === 'department'
                  ? 'bg-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue'
              }`}
            >
              <Building2 className="w-4 h-4 inline mr-1" />
              Service
            </motion.button>
          </div>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearch()}
            placeholder={
              searchType === 'social' ? 'Ex: 1212121212122' : 'ID du service (ex: 1, 2, 3...)'
            }
            className="w-full pl-12 pr-4 py-3 border border-borderColor rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Erreur lors de la recherche</span>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSearch}
          disabled={!searchQuery.trim() || loading}
          className="w-full bg-blue text-white py-3 rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block"
            />
          ) : (
            'Rechercher'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
