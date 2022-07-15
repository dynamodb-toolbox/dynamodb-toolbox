export const isObject = (candidate: any): candidate is Record<string, any> => {
    return typeof candidate === 'object' && candidate !== null && !Array.isArray(candidate);
}
