
import { useCallback } from 'react';

// LocalStorage keys
const FORM_DATA_KEY = 'production_form_data';
const EDIT_FORM_DATA_KEY = 'production_edit_form_data';

export const useProductionStorage = () => {
  const getInitialFormData = () => {
    try {
      const saved = localStorage.getItem(FORM_DATA_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load form data from localStorage', e);
    }
    return null;
  };
  
  const getInitialEditFormData = () => {
    try {
      const saved = localStorage.getItem(EDIT_FORM_DATA_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load edit form data from localStorage', e);
    }
    return null;
  };
  
  const saveFormData = useCallback((data: any) => {
    try {
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save form data to localStorage', e);
    }
  }, []);
  
  const saveEditFormData = useCallback((data: any) => {
    try {
      localStorage.setItem(EDIT_FORM_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save edit form data to localStorage', e);
    }
  }, []);
  
  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(FORM_DATA_KEY);
    } catch (e) {
      console.error('Failed to clear form data from localStorage', e);
    }
  }, []);
  
  const clearEditFormData = useCallback(() => {
    try {
      localStorage.removeItem(EDIT_FORM_DATA_KEY);
    } catch (e) {
      console.error('Failed to clear edit form data from localStorage', e);
    }
  }, []);
  
  return {
    getInitialFormData,
    getInitialEditFormData,
    saveFormData,
    saveEditFormData,
    clearFormData,
    clearEditFormData
  };
};
