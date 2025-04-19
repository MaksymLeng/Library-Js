import {loadLang, currentLang} from "./lang.js";
import { setupNav } from './ui/nav.js';
import { setupLangSelector } from './ui/langSelector.js';
import { setupFileUpload } from './ui/fileUpload.js';
import { setupForm } from './form.js';
import { plugin } from './plugin.js';
import { setupGlobalEvents } from './events.js';

document.addEventListener("DOMContentLoaded", () => {
    loadLang(currentLang);
    setupNav(plugin);
    setupLangSelector();
    setupFileUpload()
    setupForm(plugin);
    setupGlobalEvents(plugin);
});
