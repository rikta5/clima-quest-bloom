export type LevelStatus = "completed" | "unlocked" | "locked";
export type LevelType = "core" | "bonus";

export interface QuizQuestion {
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Level {
  id: number;
  title: string;
  status: LevelStatus;
  type: LevelType;
  description?: string;
  content?: string;
  quiz?: QuizQuestion;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  levels: Level[];
}

// This will be replaced by backend data eventually
export const topics: Topic[] = [
  {
    id: "climate-fundamentals",
    name: "Climate Fundamentals",
    description: "Master the basics of climate science and environmental impact",
    levels: [
      {
        id: 1,
        title: "Climate Basics",
        status: "completed",
        type: "core",
        description: "Learn the fundamentals of climate science",
        content: "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate change is natural, scientific evidence shows that human activities—particularly burning fossil fuels like coal, oil, and gas—are the primary drivers of recent climate change. These activities release greenhouse gases like carbon dioxide (CO2) into the atmosphere, which trap heat and cause global temperatures to rise. This process, known as the greenhouse effect, is intensifying and leading to significant environmental changes including melting ice caps, rising sea levels, and more extreme weather events.",
        quiz: {
          question: "What is the primary cause of recent climate change according to scientific evidence?",
          answers: [
            "Natural climate cycles",
            "Human activities, especially burning fossil fuels",
            "Solar radiation changes",
            "Volcanic activity"
          ],
          correctAnswer: 1,
          explanation: "Scientific evidence overwhelmingly shows that human activities, particularly burning fossil fuels, are the main cause of recent climate change."
        }
      },
      {
        id: 2,
        title: "E-Waste",
        status: "unlocked",
        type: "core",
        description: "Understand electronic waste and its environmental impact",
        content: "Electronic waste, or e-waste, includes discarded electronic devices like smartphones, computers, and televisions. E-waste is one of the fastest-growing waste streams globally, with millions of tons generated each year. These devices contain valuable materials like gold, silver, and copper, but also hazardous substances such as lead, mercury, and cadmium. When improperly disposed of in landfills, these toxic materials can leak into soil and water, causing serious environmental and health problems. Proper e-waste recycling recovers valuable materials and prevents pollution, but only about 20% of global e-waste is currently recycled through official channels.",
        quiz: {
          question: "What percentage of global e-waste is currently recycled through official channels?",
          answers: [
            "About 50%",
            "About 20%",
            "About 80%",
            "About 5%"
          ],
          correctAnswer: 1,
          explanation: "Only about 20% of global e-waste is properly recycled, meaning the vast majority ends up in landfills or is recycled informally, often unsafely."
        }
      },
      {
        id: 3,
        title: "Carbon Footprint",
        status: "unlocked",
        type: "core",
        description: "Calculate and reduce your carbon impact",
        content: "Your carbon footprint is the total amount of greenhouse gases produced by your actions. Everything from the food you eat, to the way you travel, to the energy you use at home contributes to your carbon footprint. The average person in developed countries produces about 16 tons of CO2 per year. By making conscious choices like using public transport, eating less meat, and reducing energy consumption, you can significantly reduce your impact on the planet.",
        quiz: {
          question: "What is the average carbon footprint per person in developed countries?",
          answers: [
            "About 5 tons per year",
            "About 10 tons per year",
            "About 16 tons per year",
            "About 25 tons per year"
          ],
          correctAnswer: 2,
          explanation: "The average person in developed countries produces approximately 16 tons of CO2 per year."
        }
      }
    ]
  },
  {
    id: "sustainable-solutions",
    name: "Sustainable Solutions",
    description: "Explore renewable energy and eco-friendly practices",
    levels: [
      {
        id: 4,
        title: "Renewable Energy",
        status: "locked",
        type: "core",
        description: "Discover clean energy solutions",
        content: "Renewable energy comes from natural sources that replenish themselves, such as sunlight, wind, rain, tides, and geothermal heat. Unlike fossil fuels, renewable energy sources don't emit greenhouse gases during operation, making them crucial for combating climate change. Solar panels convert sunlight into electricity, wind turbines harness wind power, and hydroelectric dams use flowing water to generate energy. These technologies have become increasingly efficient and affordable, with solar and wind now being the cheapest sources of new electricity in many parts of the world. Transitioning to renewable energy is essential for reducing carbon emissions and creating a sustainable energy future.",
        quiz: {
          question: "Which statement about renewable energy is correct?",
          answers: [
            "Renewable energy is always more expensive than fossil fuels",
            "Solar and wind are now the cheapest sources of new electricity in many regions",
            "Renewable energy sources emit the same greenhouse gases as fossil fuels",
            "Renewable energy can only work in sunny or windy areas"
          ],
          correctAnswer: 1,
          explanation: "Solar and wind energy have become the cheapest sources of new electricity in many parts of the world, making them economically competitive with fossil fuels."
        }
      },
      {
        id: 5,
        title: "Sustainable Living",
        status: "locked",
        type: "core",
        description: "Make eco-friendly lifestyle choices",
        content: "Sustainable living means making choices that reduce your environmental impact and preserve resources for future generations. This includes reducing consumption, choosing reusable products over single-use items, eating more plant-based foods, and supporting local and ethical businesses. Small changes like using public transportation, reducing food waste, and choosing energy-efficient appliances can collectively make a significant difference. The average person in developed countries has a carbon footprint of about 16 tons of CO2 per year, but this can be reduced by 50% or more through conscious lifestyle changes.",
        quiz: {
          question: "Which action has the most significant impact on reducing personal carbon footprint?",
          answers: [
            "Recycling plastic bottles",
            "Using reusable shopping bags",
            "Eating more plant-based foods and reducing meat consumption",
            "Turning off lights when leaving a room"
          ],
          correctAnswer: 2,
          explanation: "While all these actions help, reducing meat consumption has one of the largest impacts on personal carbon footprint, as animal agriculture produces significant greenhouse gas emissions."
        }
      }
    ]
  },
  {
    id: "ecosystem-protection",
    name: "Ecosystem Protection",
    description: "Learn about biodiversity and ocean conservation",
    levels: [
      {
        id: 6,
        title: "Ocean Conservation",
        status: "locked",
        type: "core",
        description: "Protect our marine ecosystems",
        content: "Oceans cover 71% of Earth's surface and play a vital role in regulating our climate, producing oxygen, and supporting biodiversity. However, oceans face multiple threats including overfishing, plastic pollution, and ocean acidification caused by absorbing excess CO2. Coral reefs, often called the 'rainforests of the sea,' are particularly vulnerable—they support 25% of marine life but are rapidly dying due to warming waters. Protecting oceans requires reducing plastic use, supporting sustainable fishing practices, and cutting carbon emissions to prevent further warming and acidification.",
        quiz: {
          question: "What percentage of Earth's surface is covered by oceans?",
          answers: [
            "50%",
            "61%",
            "71%",
            "81%"
          ],
          correctAnswer: 2,
          explanation: "Oceans cover approximately 71% of Earth's surface, making them crucial for climate regulation and biodiversity."
        }
      },
      {
        id: 7,
        title: "Biodiversity",
        status: "locked",
        type: "core",
        description: "Preserve Earth's diverse life forms",
        content: "Biodiversity refers to the variety of life on Earth—from genes to ecosystems. It's essential for ecosystem stability, providing services like pollination, water purification, and climate regulation. However, we're currently experiencing a biodiversity crisis, with species disappearing at rates 1,000 times higher than natural background rates. Habitat destruction, climate change, pollution, and invasive species are the main threats. Protecting biodiversity requires preserving habitats, creating wildlife corridors, reducing pollution, and addressing climate change.",
        quiz: {
          question: "How much faster are species disappearing compared to natural background rates?",
          answers: [
            "10 times faster",
            "100 times faster",
            "1,000 times faster",
            "10,000 times faster"
          ],
          correctAnswer: 2,
          explanation: "Current extinction rates are approximately 1,000 times higher than natural background rates, indicating a severe biodiversity crisis."
        }
      },
      {
        id: 8,
        title: "Climate Action",
        status: "locked",
        type: "core",
        description: "Take action for our planet",
        content: "Climate action involves both individual and collective efforts to combat climate change. Individual actions include reducing energy consumption, choosing sustainable transportation, supporting renewable energy, and making conscious consumer choices. Collective action involves voting for climate-conscious leaders, supporting environmental policies, joining community initiatives, and holding corporations accountable. The Paris Agreement aims to limit global warming to well below 2°C above pre-industrial levels, but this requires immediate and sustained action from all sectors of society. Every action, no matter how small, contributes to the larger goal of creating a sustainable future.",
        quiz: {
          question: "What is the temperature goal of the Paris Agreement?",
          answers: [
            "Limit warming to 1°C above pre-industrial levels",
            "Limit warming to well below 2°C above pre-industrial levels",
            "Limit warming to 3°C above pre-industrial levels",
            "Limit warming to 5°C above pre-industrial levels"
          ],
          correctAnswer: 1,
          explanation: "The Paris Agreement aims to limit global warming to well below 2°C above pre-industrial levels, with efforts to limit it to 1.5°C."
        }
      }
    ]
  }
];

// Helper to get all levels across all topics (for backward compatibility)
export const coreLevels: Level[] = topics.flatMap(topic => topic.levels);

// Helper to find a level by ID
export const findLevelById = (levelId: number): Level | undefined => {
  return coreLevels.find(level => level.id === levelId);
};

export const bonusLevels: Level[] = [
  {
    id: 1,
    title: "Eco Champion",
    status: "locked",
    type: "bonus",
    description: "Advanced climate leadership"
  },
  {
    id: 2,
    title: "Green Innovation",
    status: "locked",
    type: "bonus",
    description: "Future technology solutions"
  },
  {
    id: 3,
    title: "Climate Hero",
    status: "locked",
    type: "bonus",
    description: "Master all climate topics"
  }
];
