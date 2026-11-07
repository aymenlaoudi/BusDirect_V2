
// VALIDATIONS LI KAYNA F RESERVE SEAT & MODIFY SEAT & SUP SEAT

// Chno kaychecki


export function numValid(phone) {
    const clean = phone.replace(/\s/g, "");
    return /^0[67]\d{8}$/.test(clean)    
}
