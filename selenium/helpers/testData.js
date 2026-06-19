export function today() {
  const date = new Date();
  return date.toISOString().slice(0, 10);
}

export function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function sevenDaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().slice(0, 10);
}

export const assessmentPayload = {
  sleepTime: '23:00:00',
  wakeUpTime: '06:30:00',
  mealsPerDay: 3,
  exerciseFrequency: 'MODERATE',
  studyWorkHours: 8,
  screenTimeHours: 5,
  moodLevel: 4,
  mentalWellbeingNote: 'Selenium test assessment note'
};

export const updatedAssessmentPayload = {
  sleepTime: '22:30:00',
  wakeUpTime: '06:00:00',
  mealsPerDay: 4,
  exerciseFrequency: 'HIGH',
  studyWorkHours: 7,
  screenTimeHours: 4,
  moodLevel: 5,
  mentalWellbeingNote: 'Updated by Selenium test'
};

export function goalPayload() {
  return {
    goalType: 'SLEEP',
    targetValue: 8,
    targetDate: tomorrow(),
    description: 'Selenium sleep goal'
  };
}
