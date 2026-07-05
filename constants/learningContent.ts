export const continueLearning = {
  title: 'Measurements and Units',
  progress: 64,
  detail: 'Chapter 1 - Ordinary Level Physics',
};

export const learningSpaces = [
  {
    title: 'Notes',
    detail: 'Physics PDF notes organized by level. Advanced Level notes appear directly below for fast access.',
    icon: 'file-pdf-box',
  },
  {
    title: 'Science Blog',
    detail: 'Interesting science ideas, discoveries, explanations, and classroom extensions from teachers or system admins.',
    icon: 'atom',
  },
  {
    title: 'BFA Horizons',
    detail: 'Opportunities, scholarships, competitions, and academic openings for students and teachers.',
    icon: 'telescope',
  },
] as const;

export const noteGroups = [
  {
    level: 'Advanced Level',
    description: 'Direct PDF notes for A Level Physics revision and class follow-up.',
    notes: [
      { title: 'Mechanics: Motion and Forces', size: '2.4 MB', updated: 'Updated today' },
      { title: 'Electric Fields and Potential', size: '3.1 MB', updated: 'Updated this week' },
      { title: 'Waves and Superposition', size: '2.8 MB', updated: 'Updated this week' },
    ],
  },
  {
    level: 'Ordinary Level',
    description: 'Foundational O Level Physics notes organized for practical exam preparation.',
    notes: [
      { title: 'Measurements and Units', size: '1.6 MB', updated: 'Updated today' },
      { title: 'Heat Transfer', size: '2.0 MB', updated: 'Updated this week' },
      { title: 'Simple Electric Circuits', size: '2.2 MB', updated: 'Updated this month' },
    ],
  },
] as const;

export const scienceBlogPosts = [
  {
    title: 'Why satellites do not fall straight back to Earth',
    body: 'A teacher-guided explanation connecting circular motion, gravity, and orbital speed.',
    author: 'Ms. Ngalle',
    role: 'Teacher admin',
    visibleInForumAs: 'Science Blog',
  },
  {
    title: 'The hidden Physics inside phone cameras',
    body: 'A system-curated science note on lenses, sensors, focusing, and image formation.',
    author: 'System Admin',
    role: 'System admin',
    visibleInForumAs: 'Science Blog',
  },
] as const;

export const bfaHorizonsPosts = [
  {
    title: 'Regional STEM scholarship call',
    body: 'Applications are open for science students with strong performance in Physics and Mathematics.',
    author: 'Bright Lamda System',
    role: 'System admin',
    visibleInForumAs: 'BFA Horizons',
  },
  {
    title: 'Teacher mentor opportunity for practical Physics',
    body: 'Experienced teachers can join a mentorship program supporting practical exam preparation.',
    author: 'Mr. Tabe',
    role: 'Teacher admin',
    visibleInForumAs: 'BFA Horizons',
  },
] as const;

export const answerResources = [
  { title: 'Worked Solutions', detail: 'Full reasoning from question to final answer', icon: 'clipboard-text-outline' },
  { title: 'Step-by-step Explanations', detail: 'Each formula, substitution, and unit handled carefully', icon: 'stairs' },
  { title: 'Practical Demonstrations', detail: 'Video-guided experimental Physics support', icon: 'play-box-outline' },
  { title: 'Experimental Explanations', detail: 'Apparatus, method, observations, and sources of error', icon: 'microscope' },
  { title: 'Diagrams', detail: 'Clean visual breakdowns for circuits, forces, rays, and fields', icon: 'vector-polyline' },
  { title: 'Teacher Explanations', detail: 'Concept-first support from experienced Physics teachers', icon: 'account-tie-voice-outline' },
] as const;

export const answerPapers = {
  paper1: [
    { title: 'Paper 1 Multiple Choice Answers - Mechanics', year: '2025', format: 'PDF', size: '1.2 MB' },
    { title: 'Paper 1 Electricity and Magnetism Answers', year: '2024', format: 'PDF', size: '1.5 MB' },
    { title: 'Paper 1 Waves and Optics Answer Key', year: '2023', format: 'PDF', size: '1.1 MB' },
  ],
  paper2: [
    { title: 'Paper 2 Structured Questions - Full Solutions', year: '2025', format: 'PDF', size: '2.8 MB' },
    { title: 'Paper 2 Theory Answers with Marking Points', year: '2024', format: 'PDF', size: '3.0 MB' },
    { title: 'Paper 2 Advanced Explanations', year: '2023', format: 'PDF', size: '2.6 MB' },
  ],
  paper3: [
    { title: 'Paper 3 Practical Graphing Demonstration', year: '2025', format: 'Video', duration: '18 min' },
    { title: 'Paper 3 Practical Solutions Booklet', year: '2025', format: 'PDF', size: '2.2 MB' },
    { title: 'Paper 3 Circuit Experiment Explanation', year: '2024', format: 'Video', duration: '24 min' },
    { title: 'Paper 3 Experimental Errors Guide', year: '2024', format: 'PDF', size: '1.7 MB' },
  ],
} as const;
