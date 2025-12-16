export interface Company {
  id: string;
  name: string;
  shortName: string;
  location: string;
  industry: string;
  description: string;
  logo?: string;
  contributedDatasets: string[];
  esgScore?: number;
  website?: string;
  contactEmail?: string;
}

export const companies: Company[] = [
  {
    id: 'heidelberg-materials',
    name: 'Heidelberg Materials Cement BiH d.d. Kakanj',
    shortName: 'Heidelberg Materials',
    location: 'Kakanj, Bosnia and Herzegovina',
    industry: 'Cement & Building Materials',
    description: 'Leading cement manufacturer committed to sustainable production and reducing carbon emissions. Heidelberg Materials has been operating in Bosnia and Herzegovina since 1997, focusing on environmental responsibility and community engagement.',
    contributedDatasets: ['temperature-change'],
    esgScore: 85,
    website: 'https://www.heidelbergmaterials.ba/bs',
    contactEmail: 'info.bih​@heidelbergmaterials.com'
  },
  {
    id: 'artisan-furniture',
    name: 'Artisan Furniture & Interior Design',
    shortName: 'Artisan',
    location: 'Tešanj, Bosnia and Herzegovina',
    industry: 'Furniture Manufacturing',
    description: 'Sustainable furniture manufacturer using eco-friendly materials and responsible forestry practices. Artisan Furniture is committed to reducing waste and promoting circular economy principles in furniture production.',
    contributedDatasets: ['e-waste'],
    esgScore: 78,
    website: 'https://artisan.ba',
    contactEmail: 'info@artisan.ba'
  },
  {
    id: 'koteks-leather',
    name: 'Koteks Leather',
    shortName: 'Koteks',
    location: 'Tešanj, Bosnia and Herzegovina',
    industry: 'Leather Manufacturing',
    description: 'Modern leather processing company with focus on environmental sustainability and ethical sourcing. Koteks implements advanced wastewater treatment and energy-efficient production processes.',
    contributedDatasets: ['e-waste', 'temperature-change'],
    esgScore: 72,
    website: 'https://koteks.ba',
    contactEmail: 'office@koteks.ba'
  }
];

// Map topics to companies
export const topicCompanyMap: Record<string, string> = {
  'e-waste': 'artisan-furniture',
  'temperature-change': 'heidelberg-materials'
};

export const getCompanyById = (id: string): Company | undefined => {
  return companies.find(company => company.id === id);
};

export const getCompanyByTopic = (topicId: string): Company | undefined => {
  const companyId = topicCompanyMap[topicId];
  return companyId ? getCompanyById(companyId) : undefined;
};

