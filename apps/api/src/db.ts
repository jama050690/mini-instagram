// Bu yerda har birini alohida export qilyapmiz
export const users = new Map();
export const refreshTokens = new Map();
export const colors = new Set(["Red", "Green", "Blue"]);

// Hammasini bitta obyekt ichida ham export qilamiz
export const db = {
    users,
    refreshTokens,
    colors,
};