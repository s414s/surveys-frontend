export type QuestionType = 'multiple-choice' | 'text' | 'rating' | 'boolean';

export interface ChoiceOption {
    id: string;
    text: string;
}

export interface SurveyQuestionBase {
    id: string;
    questionText: string;
    required: boolean;
    type: QuestionType;
}

export interface MultipleChoiceQuestion extends SurveyQuestionBase {
    type: 'multiple-choice';
    options: ChoiceOption[];
}

export interface TextQuestion extends SurveyQuestionBase {
    type: 'text';
    placeholder?: string; // optional placeholder text for input field
}

export interface RatingQuestion extends SurveyQuestionBase {
    type: 'rating';
    minRating: number;
    maxRating: number;
}

export interface BooleanQuestion extends SurveyQuestionBase {
    type: 'boolean';
}

export type SurveyQuestion = MultipleChoiceQuestion | TextQuestion | RatingQuestion | BooleanQuestion;

export interface Survey {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    endsAt: Date;
    createdBy: string; // User ID of the creator
    questions: SurveyQuestion[];
    isActive: boolean;
}

export interface MultipleChoiceResponse {
    questionId: string;
    selectedOptionId: string; // Refers to the ID of the selected choice
}

// Response to a text question
export interface TextResponse {
    questionId: string;
    answer: string;
}

export interface RatingResponse {
    questionId: string;
    rating: number; // Rating value within the specified range
}

export interface BooleanResponse {
    questionId: string;
    answer: boolean;
}

export type SurveyResponse = MultipleChoiceResponse | TextResponse | RatingResponse | BooleanResponse;

// Collection of responses by a single user
export interface UserSurveyResponse {
    userId: string;
    surveyId: string;
    responses: SurveyResponse[];
    completedAt: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: Date;
}

// State for a list of surveys
interface SurveyState {
    surveys: Survey[];
    loading: boolean;
    error?: string;
}

// State for responses to a survey
interface SurveyResponseState {
    responses: UserSurveyResponse[];
    submitting: boolean;
    error?: string;
}

export interface AppState {
    user: User | null; // Currently authenticated user
    surveyState: SurveyState;
    surveyResponseState: SurveyResponseState;
}

export interface CreateSurveyRequest {
    title: string;
    description: string;
    questions: SurveyQuestion[];
    createdBy: string;
}

export interface SubmitSurveyResponseRequest {
    surveyId: string;
    userId: string;
    responses: SurveyResponse[];
}

export interface FetchSurveyResponse {
    survey: Survey;
}

export interface SubmitSurveyResponse {
    success: boolean;
    message: string;
}

export interface SurveyAnalytics {
    surveyId: string;
    totalResponses: number;
    questionAnalytics: QuestionAnalytics[];
}

export interface QuestionAnalytics {
    questionId: string;
    totalResponses: number;
    breakdown: {
        [optionId: string]: number; // Number of responses for each option (for multiple-choice)
    };
}

interface ValidationError {
    questionId: string;
    message: string;
}

export interface SurveyValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

// Mock data
export const survey: Survey = {
    id: 'survey123',
    title: 'Customer Satisfaction Survey',
    description: 'We would like to know your feedback!',
    createdAt: new Date(),
    updatedAt: new Date(),
    endsAt: new Date(),
    createdBy: 'admin123',
    questions: [
        {
            id: 'q1',
            questionText: 'How would you rate our service?',
            required: true,
            type: 'rating',
            minRating: 1,
            maxRating: 5,
        },
        {
            id: 'q2',
            questionText: 'What could we improve?',
            required: false,
            type: 'text',
            placeholder: 'Your feedback...',
        },
    ],
    isActive: true,
};
