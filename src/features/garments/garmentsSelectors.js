import { createSelector } from "@reduxjs/toolkit";

// Selector to get the entire garments state
export const selectGarments = (state) => state.garments.garments;

// Selector to get garments by a specific category
export const selectGarmentsByCategory = (category) =>
  createSelector([selectGarments], (garments) => garments[category] || []);

// Selector for loading and error states
export const selectGarmentsLoading = (state) => state.garments.garmentsLoading;
export const selectGarmentsError = (state) => state.garments.garmentsError;

export const deleteSuccess = (state) => state.garments.deleteSuccess;
export const deleteError = (state) => state.garments.deleteError;