//this is node.js script created for generating css for addon
fs = require("fs");

let strbld = "";
for (let i = 1; i <= 30; i++) {
  let multiplier = i * 17;
  let red = i <= 15 ? 255 : 255 * 2 - multiplier;
  let green = i <= 15 ? multiplier : 255;
  strbld += `number-${i}{background-color:rgb(${red},${green},0)}\n`;
}

fs.writeFileSync("css.css", strbld);
