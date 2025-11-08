export type LevelStatus = "completed" | "unlocked" | "locked";
export type LevelType = "core" | "bonus";

export interface Level {
  id: number;
  title: string;
  status: LevelStatus;
  type: LevelType;
  description?: string;
}

export const coreLevels: Level[] = [
  {
    id: 1,
    title: "Climate Basics",
    status: "completed",
    type: "core",
    description: "Learn the fundamentals of climate science"
  },
  {
    id: 2,
    title: "Carbon Footprint",
    status: "unlocked",
    type: "core",
    description: "Understand your impact on the planet"
  },
  {
    id: 3,
    title: "Renewable Energy",
    status: "unlocked",
    type: "core",
    description: "Discover clean energy solutions"
  },
  {
    id: 4,
    title: "Ocean Conservation",
    status: "locked",
    type: "core",
    description: "Protect our marine ecosystems"
  },
  {
    id: 5,
    title: "Sustainable Living",
    status: "locked",
    type: "core",
    description: "Make eco-friendly lifestyle choices"
  },
  {
    id: 6,
    title: "Biodiversity",
    status: "locked",
    type: "core",
    description: "Preserve Earth's diverse life forms"
  },
  {
    id: 7,
    title: "Climate Action",
    status: "locked",
    type: "core",
    description: "Take action for our planet"
  }
];

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
