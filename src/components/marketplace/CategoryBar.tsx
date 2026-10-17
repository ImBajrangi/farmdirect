import React from 'react';
import { Carrot, Apple, Wheat, Flame, Milk, Sparkles, LucideIcon } from 'lucide-react';
import { Category } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Carrot,
  Apple,
  Wheat,
  Bean: Wheat, // fallback to grain/seed
  Flame,
  Milk,
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { language, t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max">
        {/* "All" Pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all touch-target shadow-xs ${
            !selectedCategoryId || selectedCategoryId === 'all'
              ? 'bg-agri-700 text-white shadow-soft scale-102'
              : 'bg-white text-stone-700 border border-earth-200 hover:border-agri-400 hover:bg-earth-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{t.common.allCategories}</span>
        </button>

        {/* Dynamic Category Pills */}
        {categories.map((cat) => {
          const IconComponent = cat.icon ? ICON_MAP[cat.icon] || Sparkles : Sparkles;
          const isSelected = selectedCategoryId === cat.id || selectedCategoryId === cat.slug;
          const categoryName = language === 'hi' && cat.name_hi ? cat.name_hi : cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all touch-target shadow-xs ${
                isSelected
                  ? 'bg-agri-700 text-white shadow-soft scale-102'
                  : 'bg-white text-stone-700 border border-earth-200 hover:border-agri-400 hover:bg-earth-50'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-agri-200' : 'text-agri-600'}`} />
              <span>{categoryName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
