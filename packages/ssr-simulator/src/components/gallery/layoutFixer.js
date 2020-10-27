import { createLayoutFixer } from 'pro-gallery';
const mediaUrlFixer = (existingUrl, newWidth, newHeight) => {
    return existingUrl.replace(/w_\d*/, `w_${Math.round(newWidth)}`).replace(/h_\d*/, `h_${Math.round(newHeight)}`)
}
createLayoutFixer(mediaUrlFixer);