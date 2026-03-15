// utils/validators.js

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
};

export const validatePhoneNumber = (phone) => {
    // E.164 format: +1234567890
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone.replace(/\s/g, ''));
};

export const validateName = (name) => {
    return name && name.length >= 2 && name.length <= 100;
};

export const validateBio = (bio) => {
    return !bio || bio.length <= 500;
};

export const validateDate = (dateString) => {
    if (!dateString) return true;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

export const validateNumberInRange = (num, min, max) => {
    const value = parseFloat(num);
    return !isNaN(value) && value >= min && value <= max;
};

export const validateSleepTime = (sleepTime, wakeUpTime) => {
    if (!sleepTime || !wakeUpTime) return { valid: true };
    
    const sleep = new Date(`2000-01-01T${sleepTime}`);
    const wake = new Date(`2000-01-01T${wakeUpTime}`);
    let duration = (wake - sleep) / (1000 * 60 * 60);
    if (duration < 0) duration += 24;
    
    if (duration < 6) {
        return { valid: false, message: 'Sleep duration should be at least 6 hours' };
    }
    if (duration > 12) {
        return { valid: false, message: 'Sleep duration should not exceed 12 hours' };
    }
    
    return { valid: true };
};

export const validateTotalHours = (studyWorkHours, screenTimeHours) => {
    const total = (parseFloat(studyWorkHours) || 0) + (parseFloat(screenTimeHours) || 0);
    if (total > 24) {
        return { valid: false, message: 'Total hours cannot exceed 24' };
    }
    return { valid: true };
};

export const validateGoalValue = (value, type) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
        return { valid: false, message: 'Please enter a valid positive number' };
    }
    
    // Type-specific validation
    switch (type) {
        case 'SLEEP_IMPROVEMENT':
            if (num > 12) {
                return { valid: false, message: 'Sleep hours cannot exceed 12' };
            }
            break;
        case 'EXERCISE_INCREASE':
            if (num > 7) {
                return { valid: false, message: 'Exercise frequency cannot exceed 7 days/week' };
            }
            break;
        case 'MEAL_COUNT':
            if (num > 10) {
                return { valid: false, message: 'Meals per day cannot exceed 10' };
            }
            break;
        case 'SCREEN_TIME_REDUCTION':
            if (num > 24) {
                return { valid: false, message: 'Screen time cannot exceed 24 hours' };
            }
            break;
    }
    
    return { valid: true };
};

export const validateFutureDate = (dateString) => {
    if (!dateString) return { valid: false, message: 'Date is required' };
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        return { valid: false, message: 'Date must be in the future' };
    }
    
    return { valid: true };
};

export const validateCheckinAnswer = (question, answer) => {
    if (!answer || answer.trim() === '') {
        return { valid: false, message: 'Answer is required' };
    }
    
    switch (question.type) {
        case 'YES_NO':
            if (!['yes', 'no'].includes(answer.toLowerCase())) {
                return { valid: false, message: 'Please answer Yes or No' };
            }
            break;
            
        case 'SCALE':
            const num = parseInt(answer);
            const min = question.options?.min || 1;
            const max = question.options?.max || 5;
            
            if (isNaN(num) || num < min || num > max) {
                return { valid: false, message: `Please enter a number between ${min} and ${max}` };
            }
            break;
    }
    
    return { valid: true };
};