let fields = [null, null, null, null, null, null, null, null, null];
        let currentPlayer = 'circle';
        let lastMoveIndex = null;

        function render() {
            let contentDiv = document.getElementById("content");
            let tableHtml = "<table>";

            for (let i = 0; i < 3; i++) {
                tableHtml += "<tr>";

                for (let j = 0; j < 3; j++) {
                    let index = i * 3 + j;
                    let symbol = fields[index] === "circle" ? generateFillingCircleSVG(index) :
                                  fields[index] === "cross" ? generateFillingXSVG(index) : "";

                    tableHtml += `<td onclick="cellClick(${index})">${symbol}</td>`;
                }

                tableHtml += "</tr>";
            }

            tableHtml += "</table>";
            contentDiv.innerHTML = tableHtml;
        }

        function cellClick(index) {
            if (fields[index] === null) {
                fields[index] = currentPlayer;
                lastMoveIndex = index;
                render();

                // Wechsel des Spielers
                currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';

                // Entferne das onclick-Attribut für alle Zellen
                document.querySelectorAll('td').forEach(td => td.removeAttribute('onclick'));
                
                // Füge das onclick-Attribut wieder hinzu
                document.querySelectorAll('td').forEach((td, i) => {
                    if (fields[i] === null) {
                        td.setAttribute('onclick', `cellClick(${i})`);
                    }
                });
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
            if (currentPlayer === 'circle' && index === lastMoveIndex) {
                circleElement.setAttribute("stroke-dasharray", `${2 * Math.PI * circleRadius}`);
                circleElement.setAttribute("stroke-dashoffset", `${2 * Math.PI * circleRadius}`);

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
            if (currentPlayer === 'cross' && index === lastMoveIndex) {
                [line1, line2].forEach(line => {
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
                [line1, line2].forEach(line => {
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

