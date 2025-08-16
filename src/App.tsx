import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, RotateCcw, Activity, TrendingUp } from 'lucide-react';

interface Skill {
  name: string;
  category: 'Static' | 'Dynamic' | 'Push' | 'Pull';
}

const skills: Skill[] = [
  { name: 'Planche', category: 'Static' },
  { name: 'Planche Press', category: 'Dynamic' },
  { name: 'Planche Eccentrica', category: 'Dynamic' },
  { name: 'Front Lever', category: 'Static' },
  { name: 'Front Lever Pulse', category: 'Dynamic' },
  { name: 'Front Lever Ice Cream Maker', category: 'Dynamic' },
  { name: 'Front Lever Touch', category: 'Dynamic' },
  { name: 'Back Lever', category: 'Static' },
  { name: 'Back Lever Pulse', category: 'Dynamic' },
  { name: 'Muscle-Up', category: 'Dynamic' },
  { name: 'Slow Muscle Up', category: 'Dynamic' },
  { name: 'Handstand', category: 'Static' },
  { name: 'Handstand Push-Up', category: 'Push' },
  { name: 'Planche Push Up', category: 'Push' },
  { name: '90 Degree', category: 'Static' },
  { name: 'One Arm Pull Up', category: 'Pull' },
  { name: 'L-Sit', category: 'Static' },
];

const categoryColors = {
  Static: 'bg-red-500',
  Dynamic: 'bg-blue-500',
  Push: 'bg-green-500',
  Pull: 'bg-yellow-500',
};

function App() {
  const [generatedSkills, setGeneratedSkills] = useState<Skill[]>([]);
  const [skillCounts, setSkillCounts] = useState<Record<string, number>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSkills = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Separate skills by static/dynamic categories
      const staticSkills = skills.filter(skill => skill.category === 'Static');
      const dynamicSkills = skills.filter(skill => skill.category === 'Dynamic' || skill.category === 'Push' || skill.category === 'Pull');
      
      // Separate planche and front lever skills
      const plancheSkills = skills.filter(skill => skill.name.toLowerCase().includes('planche'));
      const frontLeverSkills = skills.filter(skill => skill.name.toLowerCase().includes('front lever'));
      const plancheOrFrontLeverSkills = [...plancheSkills, ...frontLeverSkills];
      
      // Generate alternating pattern: Static -> Dynamic -> Static -> Dynamic (max 4 skills)
      const selected: Skill[] = [];
      const shuffledStatic = [...staticSkills].sort(() => 0.5 - Math.random());
      const shuffledDynamic = [...dynamicSkills].sort(() => 0.5 - Math.random());
      
      // Ensure at least one planche or front lever skill is included
      const shuffledPlancheOrFrontLever = [...plancheOrFrontLeverSkills].sort(() => 0.5 - Math.random());
      let guaranteedSkillAdded = false;
      
      let staticIndex = 0;
      let dynamicIndex = 0;
      
      // Generate 5 skills alternating static/dynamic, starting with static
      const totalSkills = 5; // Always 5 skills
      
      for (let i = 0; i < totalSkills; i++) {
        if (i % 2 === 0) {
          // Even index: add static skill
          if (staticIndex < shuffledStatic.length) {
            const candidateSkill = shuffledStatic[staticIndex];
            // If this is a planche/front lever skill or we haven't added one yet, prioritize it
            if (!guaranteedSkillAdded && plancheOrFrontLeverSkills.some(s => s.name === candidateSkill.name)) {
              selected.push(candidateSkill);
              guaranteedSkillAdded = true;
            } else {
              selected.push(candidateSkill);
            }
            staticIndex++;
          }
        } else {
          // Odd index: add dynamic skill
          if (dynamicIndex < shuffledDynamic.length) {
            const candidateSkill = shuffledDynamic[dynamicIndex];
            // If this is a planche/front lever skill or we haven't added one yet, prioritize it
            if (!guaranteedSkillAdded && plancheOrFrontLeverSkills.some(s => s.name === candidateSkill.name)) {
              selected.push(candidateSkill);
              guaranteedSkillAdded = true;
            } else {
              selected.push(candidateSkill);
            }
            dynamicIndex++;
          }
        }
      }
      
      // If no planche or front lever skill was naturally selected, replace the last skill
      if (!guaranteedSkillAdded && shuffledPlancheOrFrontLever.length > 0) {
        selected[selected.length - 1] = shuffledPlancheOrFrontLever[0];
      }
      
      setGeneratedSkills(selected);
      
      // Update counts
      const newCounts = { ...skillCounts };
      selected.forEach(skill => {
        newCounts[skill.name] = (newCounts[skill.name] || 0) + 1;
      });
      setSkillCounts(newCounts);
      setIsGenerating(false);
    }, 800);
  };

  const resetCounts = () => {
    setSkillCounts({});
    setGeneratedSkills([]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const getMostUsedSkills = () => {
    return Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-red-500 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Calisthenics Skill Generator
              </h1>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Generator Section */}
          <div className="lg:col-span-2">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-4">Genera il Tuo Allenamento</h2>
              <p className="text-gray-400 text-lg mb-8">
                Clicca per generare una combo alternata di skill statiche e dinamiche con almeno una skill di planche o front lever
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={generateSkills}
                  disabled={isGenerating}
                  className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className={`w-6 h-6 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Generando...' : 'Genera Skill'}</span>
                </motion.button>

                {generatedSkills.length > 0 && (
                  <motion.button
                    onClick={resetCounts}
                    className="bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Generated Skills */}
            <AnimatePresence>
              {generatedSkills.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mb-8"
                >
                  <h3 className="text-2xl font-bold mb-6 text-center">La Tua Combo</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedSkills.map((skill, index) => (
                      <motion.div
                        key={`${skill.name}-${index}`}
                        variants={itemVariants}
                        className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-all duration-200 hover:border-red-500/50 group"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`${categoryColors[skill.category]} w-3 h-3 rounded-full flex-shrink-0`}></div>
                          <span className="text-xs text-gray-400 uppercase tracking-wider">
                            {skill.category}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold group-hover:text-red-400 transition-colors">
                          {skill.name}
                        </h4>
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <span className="text-xs text-gray-500">
                            Generata {skillCounts[skill.name] || 0} volte
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {generatedSkills.length === 0 && !isGenerating && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl p-8">
                  <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    Premi "Genera Skill" per iniziare il tuo allenamento
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Statistics Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-bold">Statistiche</h3>
              </div>

              {Object.keys(skillCounts).length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                      Skill Più Usate
                    </h4>
                    <div className="space-y-2">
                      {getMostUsedSkills().map(([skillName, count], index) => (
                        <div key={skillName} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              index === 0 ? 'bg-red-500' : 
                              index === 1 ? 'bg-blue-500' : 'bg-green-500'
                            }`}></div>
                            <span className="text-sm truncate">{skillName}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-300">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                      Statistiche Sessione
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">
                          {Object.values(skillCounts).reduce((a, b) => a + b, 0)}
                        </div>
                        <div className="text-xs text-gray-400">Totali</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">
                          {Object.keys(skillCounts).length}
                        </div>
                        <div className="text-xs text-gray-400">Diverse</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">
                          {generatedSkills.length > 0 ? generatedSkills.length : '—'}
                        </div>
                        <div className="text-xs text-gray-400">Bilanciata</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Le statistiche appariranno dopo aver generato alcune skill
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;