const DRAFT_KEY = "safargo_publish_draft";

export const getPublishDraft = () => {
    try {
        const raw = sessionStorage.getItem(DRAFT_KEY) || localStorage.getItem(DRAFT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.warn("[publishDraftStore] Failed to parse draft:", e);
        return null;
    }
};

export const savePublishDraft = (updates) => {
    try {
        const existing = getPublishDraft() || {};
        const merged = { ...existing, ...updates, lastUpdated: Date.now() };
        const serialized = JSON.stringify(merged);
        sessionStorage.setItem(DRAFT_KEY, serialized);
        localStorage.setItem(DRAFT_KEY, serialized);
        return merged;
    } catch (e) {
        console.warn("[publishDraftStore] Failed to save draft:", e);
        return updates;
    }
};

export const clearPublishDraft = () => {
    try {
        sessionStorage.removeItem(DRAFT_KEY);
        localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
        console.warn("[publishDraftStore] Failed to clear draft:", e);
    }
};
