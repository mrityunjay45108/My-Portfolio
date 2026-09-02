import { EducationItem } from '../types';

export const educations: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'B.Tech in Computer Science & Engineering',
    institution: 'Katihar Engineering College',
    university: 'Bihar Engineering University (BEU)',
    duration: '2021 - 2025',
    location: 'Katihar, Bihar, India',
    grade: 'CGPA: 8.2 / 10 (First Class)',
    highlights: [
      'Core Coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Computer Networks, Object-Oriented Programming, Software Engineering.',
      'Active participant in algorithmic programming, hackathons, and technical workshops.',
      'Solved 250+ LeetCode problems demonstrating deep algorithmic problem-solving ability.',
      'Represented college in sports and athletics tournaments.'
    ]
  },
  {
    id: 'edu-2',
    degree: 'Diploma in Mechanical Engineering',
    institution: 'Government Polytechnic Sheohar',
    duration: '2018 - 2021',
    location: 'Sheohar, Bihar, India',
    grade: 'Percentage: 78.5% (Distinction)',
    highlights: [
      'Strong foundational training in engineering mathematics, analytical thinking, and physics.',
      'Demonstrated academic excellence and transitioned into computer science and software development.'
    ]
  }
];
