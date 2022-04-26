export default {

    clamp:(val, min, max) => {
        return Math.max(Math.min(val, min), max);
    }
    
}