import React from 'react';
import { TaskPriority, TaskCategory } from '../types/Task';
import PriorityBadge from './ui/PriorityBadge';
import CategoryBadge from './ui/CategoryBadge';

const BadgeShowcase: React.FC = () => {
  return (
    <div className="p-8 bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          🎨 Badge Showcase - Modern UI Components
        </h1>
        
        {/* Priority Badges */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Priority Badges
          </h2>
          
          {/* Default Variants */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Default Style
            </h3>
            <div className="flex flex-wrap gap-4">
              <PriorityBadge priority={TaskPriority.Low} />
              <PriorityBadge priority={TaskPriority.Medium} />
              <PriorityBadge priority={TaskPriority.High} />
              <PriorityBadge priority={TaskPriority.Urgent} />
            </div>
          </div>

          {/* Outline Variants */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Outline Style
            </h3>
            <div className="flex flex-wrap gap-4">
              <PriorityBadge priority={TaskPriority.Low} variant="outline" />
              <PriorityBadge priority={TaskPriority.Medium} variant="outline" />
              <PriorityBadge priority={TaskPriority.High} variant="outline" />
              <PriorityBadge priority={TaskPriority.Urgent} variant="outline" />
            </div>
          </div>

          {/* Minimal Variants */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Minimal Style
            </h3>
            <div className="flex flex-wrap gap-4">
              <PriorityBadge priority={TaskPriority.Low} variant="minimal" />
              <PriorityBadge priority={TaskPriority.Medium} variant="minimal" />
              <PriorityBadge priority={TaskPriority.High} variant="minimal" />
              <PriorityBadge priority={TaskPriority.Urgent} variant="minimal" />
            </div>
          </div>

          {/* Different Sizes */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Different Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <PriorityBadge priority={TaskPriority.High} size="sm" />
              <PriorityBadge priority={TaskPriority.High} size="md" />
              <PriorityBadge priority={TaskPriority.High} size="lg" />
            </div>
          </div>

          {/* Without Icons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Without Icons
            </h3>
            <div className="flex flex-wrap gap-4">
              <PriorityBadge priority={TaskPriority.Low} showIcon={false} />
              <PriorityBadge priority={TaskPriority.Medium} showIcon={false} />
              <PriorityBadge priority={TaskPriority.High} showIcon={false} />
              <PriorityBadge priority={TaskPriority.Urgent} showIcon={false} />
            </div>
          </div>
        </section>

        {/* Category Badges */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Category Badges
          </h2>
          
          {/* Default Variants */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Default Style
            </h3>
            <div className="flex flex-wrap gap-4">
              <CategoryBadge category={TaskCategory.Personal} />
              <CategoryBadge category={TaskCategory.Work} />
              <CategoryBadge category={TaskCategory.Health} />
              <CategoryBadge category={TaskCategory.Education} />
              <CategoryBadge category={TaskCategory.Finance} />
              <CategoryBadge category={TaskCategory.Shopping} />
              <CategoryBadge category={TaskCategory.Travel} />
              <CategoryBadge category={TaskCategory.Other} />
            </div>
          </div>

          {/* Outline Variants */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Outline Style
            </h3>
            <div className="flex flex-wrap gap-4">
              <CategoryBadge category={TaskCategory.Personal} variant="outline" />
              <CategoryBadge category={TaskCategory.Work} variant="outline" />
              <CategoryBadge category={TaskCategory.Health} variant="outline" />
              <CategoryBadge category={TaskCategory.Education} variant="outline" />
              <CategoryBadge category={TaskCategory.Finance} variant="outline" />
              <CategoryBadge category={TaskCategory.Shopping} variant="outline" />
              <CategoryBadge category={TaskCategory.Travel} variant="outline" />
              <CategoryBadge category={TaskCategory.Other} variant="outline" />
            </div>
          </div>

          {/* Minimal Variants */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Minimal Style
            </h3>
            <div className="flex flex-wrap gap-4">
              <CategoryBadge category={TaskCategory.Personal} variant="minimal" />
              <CategoryBadge category={TaskCategory.Work} variant="minimal" />
              <CategoryBadge category={TaskCategory.Health} variant="minimal" />
              <CategoryBadge category={TaskCategory.Education} variant="minimal" />
              <CategoryBadge category={TaskCategory.Finance} variant="minimal" />
              <CategoryBadge category={TaskCategory.Shopping} variant="minimal" />
              <CategoryBadge category={TaskCategory.Travel} variant="minimal" />
              <CategoryBadge category={TaskCategory.Other} variant="minimal" />
            </div>
          </div>

          {/* Different Sizes */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Different Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <CategoryBadge category={TaskCategory.Work} size="sm" />
              <CategoryBadge category={TaskCategory.Work} size="md" />
              <CategoryBadge category={TaskCategory.Work} size="lg" />
            </div>
          </div>

          {/* Without Icons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Without Icons
            </h3>
            <div className="flex flex-wrap gap-4">
              <CategoryBadge category={TaskCategory.Personal} showIcon={false} />
              <CategoryBadge category={TaskCategory.Work} showIcon={false} />
              <CategoryBadge category={TaskCategory.Health} showIcon={false} />
              <CategoryBadge category={TaskCategory.Education} showIcon={false} />
              <CategoryBadge category={TaskCategory.Finance} showIcon={false} />
              <CategoryBadge category={TaskCategory.Shopping} showIcon={false} />
              <CategoryBadge category={TaskCategory.Travel} showIcon={false} />
              <CategoryBadge category={TaskCategory.Other} showIcon={false} />
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Interactive Demo
          </h2>
          <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Hover over the badges below to see the smooth animations and effects:
            </p>
            <div className="flex flex-wrap gap-4">
              <PriorityBadge priority={TaskPriority.Urgent} animated={true} />
              <CategoryBadge category={TaskCategory.Work} animated={true} />
              <PriorityBadge priority={TaskPriority.High} variant="outline" animated={true} />
              <CategoryBadge category={TaskCategory.Health} variant="minimal" animated={true} />
            </div>
          </div>
        </section>

        {/* Design Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            ✨ Design Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                🎨 Modern SVG Icons
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Professional SVG icons that scale perfectly and look crisp on all devices.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                🌈 Gradient Backgrounds
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Subtle gradients that add depth and visual interest while maintaining readability.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                ⚡ Smooth Animations
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Hover effects and transitions that provide excellent user feedback.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                🌙 Dark Mode Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Fully optimized for both light and dark themes with appropriate contrast.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                📱 Responsive Design
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Multiple size variants that work perfectly across all screen sizes.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                🎯 Flexible Variants
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Default, outline, and minimal variants for different design contexts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BadgeShowcase;
