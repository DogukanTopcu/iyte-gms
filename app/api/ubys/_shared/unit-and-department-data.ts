export const departments = [
  { id: 1, name: 'Physics', email: 'physics@iyte.edu.tr', facultyId: 1 },
  { id: 2, name: 'Photonics', email: 'photonics@iyte.edu.tr', facultyId: 1 },
  { id: 3, name: 'Chemistry', email: 'chemistry@iyte.edu.tr', facultyId: 1 },
  { id: 4, name: 'Mathematics', email: 'mathematics@iyte.edu.tr', facultyId: 1 },
  { id: 5, name: 'Molecular Biology and Genetics', email: 'molbiogen@iyte.edu.tr', facultyId: 1 },
  { id: 6, name: 'Computer Engineering', email: 'compeng@iyte.edu.tr', facultyId: 2 },
  { id: 7, name: 'Bioengineering', email: 'bioeng@iyte.edu.tr', facultyId: 2 },
  { id: 8, name: 'Environmental Engineering', email: 'enveng@iyte.edu.tr', facultyId: 2 },
  { id: 9, name: 'Energy Systems Engineering', email: 'energyeng@iyte.edu.tr', facultyId: 2 },
  { id: 10, name: 'Electrical and Electronics Engineering', email: 'eeeng@iyte.edu.tr', facultyId: 2 },
  { id: 11, name: 'Food Engineering', email: 'foodeng@iyte.edu.tr', facultyId: 2 },
  { id: 12, name: 'Civil Engineering', email: 'civileng@iyte.edu.tr', facultyId: 2 },
  { id: 13, name: 'Chemical Engineering', email: 'chemeng@iyte.edu.tr', facultyId: 2 },
  { id: 14, name: 'Mechanical Engineering', email: 'mecheng@iyte.edu.tr', facultyId: 2 },
  { id: 15, name: 'Materials Science and Engineering', email: 'mateng@iyte.edu.tr', facultyId: 2 },
  { id: 16, name: 'Industrial Design', email: 'inddesign@iyte.edu.tr', facultyId: 3 },
  { id: 17, name: 'Conservation and Restoration of Cultural Heritage', email: 'conservation@iyte.edu.tr', facultyId: 3 },
  { id: 18, name: 'Architecture', email: 'architecture@iyte.edu.tr', facultyId: 3 },
  { id: 19, name: 'City and Regional Planning', email: 'cityplan@iyte.edu.tr', facultyId: 3 }
];

export const units = [
  { id: 1, name: 'Faculty', email: 'faculty@iyte.edu.tr', departmentIds: [1, 2, 3, 4, 5], facultyIds: [1, 2, 3] },
  { id: 2, name: 'Secretariat', email: 'secretariat@iyte.edu.tr', departmentIds: [], facultyIds: [] },
  { id: 3, name: 'Student Affairs', email: 'studentaffairs@iyte.edu.tr', departmentIds: [], facultyIds: [] }
];

export const faculties = [
  { id: 1, name: 'Faculty of Science', email: 'science@iyte.edu.tr', departmentIds: [1, 2, 3, 4, 5] },
  { id: 2, name: 'Faculty of Engineering', email: 'engineering@iyte.edu.tr', departmentIds: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
  { id: 3, name: 'Faculty of Architecture', email: 'architecture@iyte.edu.tr', departmentIds: [16, 17, 18, 19] }
];


