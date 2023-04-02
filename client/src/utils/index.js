import {surpriseMePrompts} from "../constants";
import FileSaver from 'file-saver'

export function getRandomPrompt(prompt) {
    const random = Math.floor(Math.random() * surpriseMePrompts.length);
    const randomPrompt = surpriseMePrompts[random];
    if (randomPrompt === prompt) 
        return getRandomPrompt(prompt);
    


    return randomPrompt;
}

export function downloadImage(_id, photo) {
    FileSaver.saveAs(photo, `download-${_id}.jpg`);
}
