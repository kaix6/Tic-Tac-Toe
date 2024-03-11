let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "circle";
let lastMoveIndex = null;

function render() {
  let contentDiv = document.getElementById("content");
  let tableHtml = "<table>";

  for (let i = 0; i < 3; i++) {
    tableHtml += "<tr>";

    for (let j = 0; j < 3; j++) {
      let index = i * 3 + j;
      let symbol =
        fields[index] === "circle"
          ? generateFillingCircleSVG(index)
          : fields[index] === "cross"
          ? generateFillingXSVG(index)
          : "";

      tableHtml += `<td id="${index}" onclick="cellClick(${index})">${symbol}</td>`;
    }

    tableHtml += "</tr>";
  }

  tableHtml += "</table>";
  contentDiv.innerHTML = tableHtml;
}

function cellClick(index) {
  // Überprüfe, ob das Spiel bereits beendet ist
  if (checkGameEnd()) {
    return;
  }

  if (fields[index] === null) {
    fields[index] = currentPlayer;
    lastMoveIndex = index;
    render();

    // Wechsel des Spielers
    currentPlayer = currentPlayer === "circle" ? "cross" : "circle";

    // Entferne das onclick-Attribut für alle Zellen
    document
      .querySelectorAll("td")
      .forEach((td) => td.removeAttribute("onclick"));

    // Füge das onclick-Attribut wieder hinzu
    document.querySelectorAll("td").forEach((td, i) => {
      if (fields[i] === null) {
        td.setAttribute("onclick", `cellClick(${i})`);
      }
    });

    // Überprüfe, ob das Spiel beendet ist
    checkGameEnd();
  }
}

function generateFillingCircleSVG(index) {
  const svgNS = "http://www.w3.org/2000/svg";
  const circleRadius = 35;

  // SVG-Element erstellen
  const svgElement = document.createElementNS(svgNS, "svg");
  svgElement.setAttribute("width", "75");
  svgElement.setAttribute("height", "75");

  // Kreis erstellen
  const circleElement = document.createElementNS(svgNS, "circle");
  circleElement.setAttribute("cx", "50%");
  circleElement.setAttribute("cy", "50%");
  circleElement.setAttribute("r", circleRadius);
  circleElement.setAttribute("fill", "transparent");
  circleElement.setAttribute("stroke", "#00B0EF");
  circleElement.setAttribute("stroke-width", "5");

  // Animation erstellen, nur wenn der aktuelle Spieler der Kreisspieler ist und das Feld das letzte ausgewählte Feld ist
  if (currentPlayer === "circle" && index === lastMoveIndex) {
    circleElement.setAttribute(
      "stroke-dasharray",
      `${2 * Math.PI * circleRadius}`
    );
    circleElement.setAttribute(
      "stroke-dashoffset",
      `${2 * Math.PI * circleRadius}`
    );

    const animationElement = document.createElementNS(svgNS, "animate");
    animationElement.setAttribute("attributeName", "stroke-dashoffset");
    animationElement.setAttribute("from", `${2 * Math.PI * circleRadius}`);
    animationElement.setAttribute("to", "0");
    animationElement.setAttribute("dur", "400ms");
    animationElement.setAttribute("begin", "0s");
    animationElement.setAttribute("fill", "freeze");

    circleElement.appendChild(animationElement);
  } else {
    circleElement.setAttribute("stroke-dasharray", "0");
    circleElement.setAttribute("stroke-dashoffset", "0");
  }

  // Elemente hinzufügen
  svgElement.appendChild(circleElement);

  // SVG-HTML-Code zurückgeben
  return svgElement.outerHTML;
}

function generateFillingXSVG(index) {
  const svgNS = "http://www.w3.org/2000/svg";
  const lineLength = 40;

  // SVG-Element erstellen
  const svgElement = document.createElementNS(svgNS, "svg");
  svgElement.setAttribute("width", "70");
  svgElement.setAttribute("height", "70");

  // Linien für das X erstellen
  const line1 = document.createElementNS(svgNS, "line");
  line1.setAttribute("x1", `${50 - lineLength}%`);
  line1.setAttribute("y1", `${50 - lineLength}%`);
  line1.setAttribute("x2", `${50 + lineLength}%`);
  line1.setAttribute("y2", `${50 + lineLength}%`);
  line1.setAttribute("stroke", "#FFC000");
  line1.setAttribute("stroke-width", "5");

  const line2 = document.createElementNS(svgNS, "line");
  line2.setAttribute("x1", `${50 - lineLength}%`);
  line2.setAttribute("y1", `${50 + lineLength}%`);
  line2.setAttribute("x2", `${50 + lineLength}%`);
  line2.setAttribute("y2", `${50 - lineLength}%`);
  line2.setAttribute("stroke", "#FFC000");
  line2.setAttribute("stroke-width", "5");

  // Animation erstellen, nur wenn der aktuelle Spieler der Kreuzspieler ist und das Feld das letzte ausgewählte Feld ist
  if (currentPlayer === "cross" && index === lastMoveIndex) {
    [line1, line2].forEach((line) => {
      line.setAttribute("stroke-dasharray", `${2 * lineLength}`);
      line.setAttribute("stroke-dashoffset", `${lineLength}`);

      const animationElement = document.createElementNS(svgNS, "animate");
      animationElement.setAttribute("attributeName", "stroke-dashoffset");
      animationElement.setAttribute("from", `${lineLength}`);
      animationElement.setAttribute("to", "0");
      animationElement.setAttribute("dur", "400ms");
      animationElement.setAttribute("begin", "0s");
      animationElement.setAttribute("fill", "freeze");

      line.appendChild(animationElement);
    });
  } else {
    [line1, line2].forEach((line) => {
      line.setAttribute("stroke-dasharray", "0");
      line.setAttribute("stroke-dashoffset", "0");
    });
  }

  // Elemente hinzufügen
  svgElement.appendChild(line1);
  svgElement.appendChild(line2);

  // SVG-HTML-Code zurückgeben
  return svgElement.outerHTML;
}

window.onload = render;

async function checkGameEndAndDrawLine() {
  if (checkWinningCondition(0, 1, 2)) {
    await drawWinningLine([0, 1, 2]);
    alert(`Player ${fields[0] === "circle" ? "Circle" : "Cross"} wins!`);
    resetGame();
  } else if (checkWinningCondition(3, 4, 5)) {
    await drawWinningLine([3, 4, 5]);
    alert(`Player ${fields[3] === "circle" ? "Circle" : "Cross"} wins!`);
    resetGame();
  } else if (checkWinningCondition(6, 7, 8)) {
    await drawWinningLine([6, 7, 8]);
    alert(`Player ${fields[6] === "circle" ? "Circle" : "Cross"} wins!`);
    resetGame();
  } else if (checkWinningCondition(0, 3, 6)) {
    await drawWinningLine([0, 3, 6]);
    alert(`Player ${fields[0] === "circle" ? "Circle" : "Cross"} wins!`);
    resetGame();
  } else if (checkWinningCondition(1, 4, 7)) {
    await drawWinningLine([1, 4, 7]);
    alert(`Player ${fields[1] === "circle" ? "Circle" : "Cross"} wins!`);
    resetGame();
  } else if (checkWinningCondition(2, 5, 8)) {
    await drawWinningLine([2, 5, 8]);
    alert(`Player ${fields[2] === "circle" ? "Circle" : "Cross"} wins!`);
    resetGame();
  } else if (checkWinningCondition(0, 4, 8)) {
    await drawWinningLine([0, 4, 8]);
    alert(`Player ${fields[0] === "circle" ? "Circle" : "Cross"} wins!`);
    resetGame();
  } else if (checkWinningCondition(2, 4, 6)) {
    await drawWinningLine([2, 4, 6]);
    alert(`Player ${fields[2] === "circle" ? "Circle" : "Cross"} wins!`);
    resetGame();
  } else if (!fields.includes(null)) {
    // Überprüfe auf ein Unentschieden
    alert("It's a draw!");
    resetGame();
  }
}

// Funktion zum Überprüfen, ob das Spiel beendet ist
function checkGameEnd() {
  // Rufen Sie nun die neue Funktion auf, die beide Aspekte abdeckt
  checkGameEndAndDrawLine();
}

// Funktion zum Überprüfen der Siegbedingung für eine bestimmte Kombination von Zellen
function checkWinningCondition(cell1, cell2, cell3) {
  return (
    fields[cell1] !== null &&
    fields[cell1] === fields[cell2] &&
    fields[cell1] === fields[cell3]
  );
}

let winningLineDrawn = false;

async function drawWinningLine(winningCells) {
  return new Promise((resolve) => {
    let lineDiv = document.getElementById("winning-line");
    if (!lineDiv) {
      lineDiv = document.createElement("div");
      lineDiv.id = "winning-line";
      document.getElementById("content").appendChild(lineDiv);
    }

    const cell1 = document.getElementById(`${winningCells[0]}`);
    const cell2 = document.getElementById(`${winningCells[1]}`);
    const cell3 = document.getElementById(`${winningCells[2]}`);

    if (!cell1 || !cell2 || !cell3) {
      console.error("Error: Unable to find cell elements for winning line.");
      resolve();
    }

    const lineX1 = cell1.offsetLeft + cell1.offsetWidth / 2;
    const lineY1 = cell1.offsetTop + cell1.offsetHeight / 2;

    const lineX2 = cell3.offsetLeft + cell3.offsetWidth / 2;
    const lineY2 = cell3.offsetTop + cell3.offsetHeight / 2;

    lineDiv.style.width = "5px";
    lineDiv.style.height =
      Math.sqrt(Math.pow(lineX2 - lineX1, 2) + Math.pow(lineY2 - lineY1, 2)) +
      "px";
    lineDiv.style.left = lineX1 - lineDiv.offsetWidth / 2 + "px";
    lineDiv.style.top = lineY1 + "px";

    const angle =
      Math.atan2(lineY2 - lineY1, lineX2 - lineX1) * (180 / Math.PI);
    lineDiv.style.transform = `rotate(${angle}deg)`;

    resolve();
  });
}

// Funktion zum Zurücksetzen des Spiels
function resetGame() {
  fields = [null, null, null, null, null, null, null, null, null];
  currentPlayer = "circle";
  lastMoveIndex = null;
  render();

  // Entferne die Gewinnlinie, falls vorhanden
  let lineDiv = document.getElementById("winning-line");
  if (lineDiv) {
    lineDiv.parentNode.removeChild(lineDiv);
  }
}
