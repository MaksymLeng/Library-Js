import RotatingCircles from "./lib/circle-plugin.min";

let books = JSON.parse(localStorage.getItem("books")) || [];

export const plugin = new RotatingCircles('bookCircles', books, {
    mode: 'circular',
    radius: 300,
    speed: 0.01
});