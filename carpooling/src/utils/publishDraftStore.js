const DRAFT_KEY = "safargo_publish_draft";

export const getPublishDraft = () => {
    try {
        const raw = sessionStorage.getItem(DRAFT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.warn("[publishDraftStore] Failed to parse draft from sessionStorage:", e);
        return null;
    }
};

export const savePublishDraft = (updates) => {
    try {
        const existing = getPublishDraft() || {};
        const merged = { ...existing, ...updates, lastUpdated: Date.now() };
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(merged));
        return merged;
    } catch (e) {
        console.warn("[publishDraftStore] Failed to save draft to sessionStorage:", e);
        return updates;
    }
};

export const clearPublishDraft = () => {
    try {
        sessionStorage.removeItem(DRAFT_KEY);
    } catch (e) {
        console.warn("[publishDraftStore] Failed to clear draft:", e);
    }
};
