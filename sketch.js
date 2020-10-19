let gridH, gridW;
let vect = [];
let memorized = [];
let resetB, saveB, addB, recognizeB;

function preload() {
  loadJSON('memory.json', getMemory);
}

function setup() {
  createCanvas(550, 750);
  gridH = 11;
  gridW = 15;
  vect = [];
  for (let i = 0; i < gridH * gridW; i++) {
    vect.push(0);
  }
  resetB = createButton("Reset");
  resetB.mousePressed(reset);
  saveB = createButton("Enregistrer");
  saveB.mousePressed(saveChar);
  addB = createButton("Ajouter");
  addB.mousePressed(addChar);
  recognizeB = createButton("Reconnaissance");
  recognizeB.mousePressed(recogChar);
}

function draw() {
  background(255);
  for (let i = 0; i <= gridH; i++) {
    line(i * width / gridH, 0, i * width / gridH, height);
  }
  for (let i = 0; i <= gridW; i++) {
    line(0, i * height / gridW, width, i * height / gridW);
  }

  if (mouseIsPressed && mouseButton === LEFT) {
    changePx();
  }
  
  updatePx();
  render();
}

function getMemory(charac) {
  // print("Les lettres déjà enregistrées sont :");
  for (let i = 0; i < charac.length; i++) {
    let lettre = {};
    // print(charac[i].char);
    lettre.char = charac[i].char;
    lettre.vect = charac[i].vect;
    memorized.push(lettre);
  }
}

function changePx() {
  let x = mouseX;
  let y = mouseY;
  if (x <= width && y <= height && x >= 0 && y >= 0) {
    let pxX = int(x / (width / gridH));
    let pxY = int(y / (height / gridW));
    let index = pxX + gridH * pxY;
    if (keyIsPressed === true && keyCode === SHIFT) {
      vect[index] = 0;
    } else {
      vect[index] = 9;
    }
  }
}

function updatePx() {
  for(let i = 0; i < gridH; i++) {
    for(let j = 0; j < gridW; j++) {
      let index = i + gridH * j;
      if (vect[index] != 9) {
        vect[index] = countPxAround(i, j);
      }
    }
  }
}

function countPxAround(x, y) {
  let count = 0;
  for(let i = -1; i < 2; i++) {
    for(let j = -1; j < 2; j++) {
      let index = (x+i) + gridH * (y+j);
      if(vect[index] == 9 && (x+i) >= 0 && (x+i) < gridH) {
        count++;
      }
    } 
  }
  return count;
}

function render() {
  for (let i = 0; i < vect.length; i++) {
    if (vect[i] != 0) {
      let x = i % gridH;
      let y = int(i / gridH);
      fill(255 - vect[i] * 28.333333333);
      stroke(0);
      rect(x * width / gridH, y * height / gridW, width / gridH, height / gridW);
    }
  }
}

function keyPressed() {
  if (key == 'r') {
    reset();
  } else if (key == 's') {
    saveChar();
  } else if (key == 'a') {
    addChar();
  } else if (key == ' ') {
    recogChar();
  }
}

function reset() {
  vect = [];
  for (let i = 0; i < gridH * gridW; i++) {
    vect.push(0);
  }
}

function addChar() {
  let name = ask();
  if (name != null) {
    let letter = {};
    letter.char = name;
    letter.vect = vect;
    memorized.push(letter);
    print("Nouvelle lettre mémorisée : " + name);
    print("N'oubliez pas d'enregistrer en appuyant sur 's'")
  } else {
    print("Mémorisation annulée");
  }
}

function ask() {
  let char;
  char = prompt("Quelle lettre est représentée ?");
  if (char == null || char == "") {
    return null;
  } else {
    return char.charAt(0);
  }
}

function saveChar() {
  saveJSON(memorized, "memory", true);
}

function recogChar() {
  // print("Reconnaissance du caractère...");
  let min = distanceEuclidienne(vect, memorized[0].vect);
  let caractère = memorized[0].char;
  for (let i = 1; i < memorized.length; i++) {
    let j = distanceEuclidienne(vect, memorized[i].vect);
    if (j <= min) {
      min = j;
      caractère = memorized[i].char;
    }
  }
  window.alert ("Le caractère est : " + caractère);
}

function distanceEuclidienne(vectA, vectB) {
  let distance = 0
  for (let i = 0; i < vectA.length; i++) {
    distance += (vectA[i] - vectB[i])**2;
  }
  distance = sqrt(distance);
  return distance;
}
