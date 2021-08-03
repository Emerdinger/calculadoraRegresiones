const tamTable = document.getElementById('tam-table');
const puntosXY = document.getElementById('puntos-xy');
var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt);

let valor = 0;
let sumaX = 0, sumaY = 0, sumaXY = 0, sumaC = 0, promY = 0, promX = 0, a0 = 0, a1 = 0, x2 = 0, sumST = 0, sumSR = 0,
    sy = 0, syx = 0, r = 0
let letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

if (!localStorage.getItem('regresion')) {
    window.location.assign('../index.html');
}

if (localStorage.getItem('regresion') == 'regresionLineal') {
    document.querySelector('.title-regresion').innerHTML = 'Calculadora de Regresión Lineal'
} else if (localStorage.getItem('regresion') == 'modeloExponencial') {
    document.querySelector('.title-regresion').innerHTML = 'Calculadora de Modelo Exponencial'
} else if (localStorage.getItem('regresion') == 'ecuacionPotencias') {
    document.querySelector('.title-regresion').innerHTML = 'Calculadora de Ecuaciones de potencias'
} else if (localStorage.getItem('regresion') == 'razonCrecimiento') {
    document.querySelector('.title-regresion').innerHTML = 'Calculadora de Razones de crecimiento'
} else if (localStorage.getItem('regresion') == 'regresionPolimonial2') {
    document.querySelector('.title-regresion').innerHTML = 'Calculadora de Regresión Polimonial grado 2'
}

tamTable.addEventListener('submit', (e) => {
    e.preventDefault();
    puntosXY.style.display = ''
    const size = document.getElementById('num-tam').value
    valor = size;
    const tablaXY = document.querySelector('#tabla-xy')
    const tarjeta = document.querySelector('.tarjeta')
    tarjeta.style.display = 'none'
    let html = ''
    for (let i = 0; i < size; i++) {
        const tr = `
        <tr>
            <td><input id="x_${i}" type="number" class="form-control" placeholder="0" required></td>
            <td><input id="y_${i}" type="number" class="form-control" placeholder="0" required></td>
        </tr>
        `
        html += tr;
    }

    tablaXY.innerHTML = html;
});

puntosXY.addEventListener('submit', (e) => {
    e.preventDefault();
    puntosXY.style.display = 'none';
    if (localStorage.getItem('regresion') == 'regresionLineal') {
        regresionLineal(valor);
    } else if (localStorage.getItem('regresion') == 'modeloExponencial') {
        modeloExponencial(valor);
    } else if (localStorage.getItem('regresion') == 'ecuacionPotencias') {
        ecuacionPotencias(valor);
    } else if (localStorage.getItem('regresion') == 'razonCrecimiento') {
        razonCrecimiento(valor);
    } else if (localStorage.getItem('regresion') == 'regresionPolimonial2') {
        regresionPolimonial2(valor);
    } else {
        window.location.assign('../index.html');
    }
});

function regresionLineal(valor) {
    let x = []
    let y = []
    for (let i = 0; i < valor; i++) {
        x.push(parseInt(document.getElementById(`x_${i}`).value));
        y.push(parseInt(document.getElementById(`y_${i}`).value));
    }

    for (let i = 0; i < valor; i++) {
        sumaC = sumaC + 1;
        sumaX += x[i];
        sumaY += y[i];
        sumaXY += x[i] * y[i];
        x2 += x[i] * x[i]
    }

    promX = sumaX / sumaC;
    promY = sumaY / sumaC;

    a1 = (sumaC * sumaXY - (sumaX * sumaY)) / (sumaC * x2 - (sumaX * sumaX));
    a0 = promY - (a1 * promX);

    for (let i = 0; i < valor; i++) {
        sumST += (y[i] - promY) * (y[i] - promY);
        sumSR += (y[i] - a0 - (a1 * x[i])) * (y[i] - a0 - (a1 * x[i]));
    }

    sy = Math.sqrt(sumST / (sumaC - 1));
    syx = Math.sqrt(sumSR / (sumaC - 2));
    r = Math.sqrt((sumST - sumSR) / sumST) * 100

    document.querySelector('#lineal').style.display = ''
    document.querySelector('.lista-x').innerHTML = `X = ${x}`
    document.querySelector('.lista-y').innerHTML = `Y = ${y}`
    document.querySelector('.funcion').innerHTML = `Función: Y = ${a0} + ${a1}X`
    document.querySelector('.dev-estandar').innerHTML = `Desviacion estandar = ${sy}`
    document.querySelector('.error-estandar').innerHTML = `Error estandar = ${syx}`
    document.querySelector('.coef-correlacion').innerHTML = `Coeficiente de correlacion = ${r}`
    calculator.setExpression({id: 'graph1', latex: `y=${a0} + ${a1}x`});

    elt.style.display = '';

    calculator.setExpression({id: 'graph1', latex: `y=${a0} + ${a1}x`});

    for (let i = 0; i < valor; i++) {
        calculator.setExpression({
            id: `point${letras[i]}`,
            latex: `${letras[i]} = (${x[i]}, ${y[i]})`,
            dragMode: Desmos.DragModes.NONE,
            pointStyle: Desmos.Styles.OPEN
        })
    }
}

function modeloExponencial(valor) {
    let x = []
    let y = []
    let logy = []

    for (let i = 0; i < valor; i++) {
        x.push(parseInt(document.getElementById(`x_${i}`).value));
        y.push(parseInt(document.getElementById(`y_${i}`).value));
        logy.push(parseFloat(Math.log(y[i])));
    }

    for (let i = 0; i < valor; i++) {
        sumaC = sumaC + 1;
        sumaX += x[i];
        sumaY += logy[i];
        sumaXY += x[i] * logy[i];
        x2 += x[i] * x[i]
    }

    promX = sumaX / sumaC;
    promY = sumaY / sumaC;
    a1 = (sumaC * sumaXY - (sumaX * sumaY)) / (sumaC * x2 - (sumaX * sumaX));
    a0 = promY - (a1 * promX);

    for (let i = 0; i < valor; i++) {
        sumST += Math.pow((logy[i] - promY), 2)
        sumSR += (logy[i] - a0 - (a1 * x[i])) * (logy[i] - a0 - (a1 * x[i]));
    }

    a0 = Math.exp(a0);

    sy = Math.sqrt(sumST / (sumaC - 1));
    syx = Math.sqrt(sumSR / (sumaC - 2));
    r = Math.sqrt((sumST - sumSR) / sumST) * 100

    document.querySelector('#lineal').style.display = ''
    document.querySelector('.lista-x').innerHTML = `X = ${x}`
    document.querySelector('.lista-y').innerHTML = `Y = ${y}`
    document.querySelector('.funcion').innerHTML = `Función: Y = ${a0.toFixed(5)}e^${a1.toFixed(5)}X`
    document.querySelector('.dev-estandar').innerHTML = `Desviacion estandar = ${sy.toFixed(5)}`
    document.querySelector('.error-estandar').innerHTML = `Error estandar = ${syx.toFixed(5)}`
    document.querySelector('.coef-correlacion').innerHTML = `Coeficiente de correlacion = ${r.toFixed(5)}`

    elt.style.display = '';
    console.log(a1)
    calculator.setExpression({id: 'graph1', latex: `y=${a0}e^{${a1}x}`});

    for (let i = 0; i < valor; i++) {
        calculator.setExpression({
            id: `point${letras[i]}`,
            latex: `${letras[i]} = (${x[i]}, ${y[i]})`,
            dragMode: Desmos.DragModes.NONE,
            pointStyle: Desmos.Styles.OPEN
        })
    }

}

function ecuacionPotencias(valor) {
    let x = []
    let y = []
    let logx = []
    let logy = []

    for (let i = 0; i < valor; i++) {
        x.push(parseInt(document.getElementById(`x_${i}`).value));
        y.push(parseInt(document.getElementById(`y_${i}`).value));
        logy.push(parseFloat(Math.log10(y[i])));
        logx.push(parseFloat(Math.log10(x[i])));
    }

    for (let i = 0; i < valor; i++) {
        sumaC = sumaC + 1;
        sumaX += logx[i];
        sumaY += logy[i];
        sumaXY += logx[i] * logy[i];
        x2 += logx[i] * logx[i]
    }

    promX = sumaX / sumaC;
    promY = sumaY / sumaC;
    a1 = (sumaC * sumaXY - (sumaX * sumaY)) / (sumaC * x2 - (sumaX * sumaX));
    a0 = promY - (a1 * promX);
    console.log(a1, a0)


    for (let i = 0; i < valor; i++) {
        sumST += Math.pow((logy[i] - promY), 2)
        sumSR += Math.pow(logy[i] - a0 - a1 * logx[i], 2);
    }
    console.log(sumST, sumSR);
    a0 = Math.pow(10, a0);

    sy = Math.sqrt(sumST / (sumaC - 1));
    syx = Math.sqrt(sumSR / (sumaC - 2));
    r = Math.sqrt(Math.abs((sumST - sumSR) / sumST)) * 100

    document.querySelector('#lineal').style.display = ''
    document.querySelector('.lista-x').innerHTML = `X = ${x}`
    document.querySelector('.lista-y').innerHTML = `Y = ${y}`
    document.querySelector('.funcion').innerHTML = `Función: Y = ${a0.toFixed(5)}x^${a1.toFixed(5)}`
    document.querySelector('.dev-estandar').innerHTML = `Desviacion estandar = ${sy.toFixed(5)}`
    document.querySelector('.error-estandar').innerHTML = `Error estandar = ${syx.toFixed(5)}`
    document.querySelector('.coef-correlacion').innerHTML = `Coeficiente de correlacion = ${r.toFixed(5)}`

    elt.style.display = '';
    calculator.setExpression({id: 'graph1', latex: `y=${a0}x^{${a1}}`});

    for (let i = 0; i < valor; i++) {
        calculator.setExpression({
            id: `point${letras[i]}`,
            latex: `${letras[i]} = (${x[i]}, ${y[i]})`,
            dragMode: Desmos.DragModes.NONE,
            pointStyle: Desmos.Styles.OPEN
        })
    }

}

function razonCrecimiento(valor) {
    let x = []
    let y = []
    let aux = []
    let auy = []

    for (let i = 0; i < valor; i++) {
        x.push(parseInt(document.getElementById(`x_${i}`).value));
        y.push(parseInt(document.getElementById(`y_${i}`).value));
        aux.push(parseInt(document.getElementById(`x_${i}`).value));
        auy.push(parseInt(document.getElementById(`y_${i}`).value));
        x[i] = 1 / x[i]
        y[i] = 1 / y[i]
    }

    for (let i = 0; i < valor; i++) {
        sumaC = sumaC + 1;
        sumaX += x[i];
        sumaY += y[i];
        sumaXY += x[i] * y[i];
        x2 += x[i] * x[i]
    }

    promX = sumaX / sumaC;
    promY = sumaY / sumaC;
    a1 = (sumaC * sumaXY - (sumaX * sumaY)) / (sumaC * x2 - (sumaX * sumaX));
    a0 = promY - (a1 * promX);

    console.log("a0 ", a0, "a1", a1)

    for (let i = 0; i < valor; i++) {
        sumST += Math.pow((y[i] - promY), 2)
        sumSR += Math.pow(y[i] - a0 - a1 * x[i], 2);
    }

    a1 = a1 / a0
    a0 = 1 / a0

    sy = Math.sqrt(sumST / (sumaC - 1));
    syx = Math.sqrt(sumSR / (sumaC - 2));
    r = Math.sqrt(Math.abs((sumST - sumSR) / sumST)) * 100

    // Cambiar x y a 5 decimales para que no desborde el html

    for (let i = 0; i < valor; i++) {
        x[i] = x[i].toFixed(5);
        y[i] = y[i].toFixed(5);

    }

    document.querySelector('#lineal').style.display = ''
    document.querySelector('.lista-x').innerHTML = `X = ${aux}`
    document.querySelector('.lista-y').innerHTML = `Y = ${auy}`
    document.querySelector('.funcion').innerHTML = `Función: Y = ${a0.toFixed(5)}x/${a1.toFixed(5)}`
    document.querySelector('.dev-estandar').innerHTML = `Desviacion estandar = ${sy.toFixed(5)}`
    document.querySelector('.error-estandar').innerHTML = `Error estandar = ${syx.toFixed(5)}`
    document.querySelector('.coef-correlacion').innerHTML = `Coeficiente de correlacion = ${r.toFixed(5)}`

    elt.style.display = '';
    calculator.setExpression({id: 'graph1', latex: `y=${a0}x/(${a1}+x)`});

    for (let i = 0; i < valor; i++) {
        calculator.setExpression({
            id: `point${letras[i]}`,
            latex: `${letras[i]} = (${aux[i]}, ${auy[i]})`,
            dragMode: Desmos.DragModes.NONE,
            pointStyle: Desmos.Styles.OPEN
        })
    }

}

function regresionPolimonial2(valor) {
    let x = []
    let y = []

    for (let i = 0; i < valor; i++) {
        x.push(parseInt(document.getElementById(`x_${i}`).value));
        y.push(parseInt(document.getElementById(`y_${i}`).value));
    }

    let x3 = 0, x4 = 0, x2y = 0, a2 = 0;
    let sumx2 = []


    for (let i = 0; i < valor; i++) {
        sumaC = sumaC + 1;
        sumaX += x[i];
        sumaY += y[i];
        sumaXY += x[i] * y[i];
        sumx2.push(x[i] * x[i]);
        x2 += x[i] * x[i]
        x3 += Math.pow(x[i], 3)
        x4 += Math.pow(x[i], 4)
        x2y += (Math.pow(x[i], 2)) * y[i]
    }

    promX = sumaX / sumaC;
    promY = sumaY / sumaC;
    let aux1 = [[sumaC, sumaX, x2], [sumaX, x2, x3], [x2, x3, x4]];
    let aux2 = [sumaY, sumaXY, x2y];
    let sol = gauss(aux1, aux2);
    console.log(sol);
    a0 = sol[0]
    a1 = sol[1]
    a2 = sol[2]

    for (let i = 0; i < valor; i++) {
        sumST += Math.pow((y[i] - promY), 2)
        sumSR += Math.pow((y[i] - a0 - (a1 * x[i])) - (a2 * sumx2[i]), 2);
    }

    sy = Math.sqrt(sumST / (sumaC - 1));
    syx = Math.sqrt(sumSR / (sumaC - 3));
    r = Math.sqrt((sumST - sumSR) / sumST) * 100

    document.querySelector('#lineal').style.display = ''
    document.querySelector('.lista-x').innerHTML = `X = ${x}`
    document.querySelector('.lista-y').innerHTML = `Y = ${y}`
    document.querySelector('.funcion').innerHTML = `Función: Y = ${a0.toFixed(5)}+${a1.toFixed(5)}+${a2.toFixed(5)}x^2`
    document.querySelector('.dev-estandar').innerHTML = `Desviacion estandar = ${sy.toFixed(5)}`
    document.querySelector('.error-estandar').innerHTML = `Error estandar = ${syx.toFixed(5)}`
    document.querySelector('.coef-correlacion').innerHTML = `Coeficiente de correlacion = ${r.toFixed(5)}`

    elt.style.display = '';
    calculator.setExpression({id: 'graph1', latex: `y=${a0}+${a1}x^1+${a2}x^2`});

    for (let i = 0; i < valor; i++) {
        calculator.setExpression({
            id: `point${letras[i]}`,
            latex: `${letras[i]} = (${x[i]}, ${y[i]})`,
            dragMode: Desmos.DragModes.NONE,
            pointStyle: Desmos.Styles.OPEN
        })
    }
}

function gauss(a, b) {
    var n = b.length;
    for (var i = 0; i < n; i++) {
        {
            if (i === n - 1 && a[i][i] === 0) {
                return b;
            } else
                while ((a[i][i] === 0)) {
                    {
                        for (var h = i; h < n - 1; h++) {
                            {
                                for (var g = i; g < n; g++) {
                                    {
                                        var aux1_1 = a[h + 1][g];
                                        a[h + 1][g] = a[h][g];
                                        a[h][g] = aux1_1;
                                    }
                                    ;
                                }
                                var aux1 = b[h + 1];
                                b[h + 1] = b[h];
                                b[h] = aux1;
                            }
                            ;
                        }
                    }
                }
            ;
            var divide = a[i][i];
            for (var g = i; g < n; g++) {
                {
                    a[i][g] /= divide;
                }
                ;
            }
            b[i] /= divide;
            for (var k = i + 1; k < n; k++) {
                {
                    var fact = -a[k][i];
                    for (var j = i; j < n; j++) {
                        {
                            a[k][j] += (a[i][j] * fact);
                        }
                        ;
                    }
                    b[k] += (b[i] * fact);
                }
                ;
            }
            for (var k = i - 1; k >= 0; k--) {
                {
                    var fact = -a[k][i];
                    for (var j = i; j < n; j++) {
                        {
                            a[k][j] += (a[i][j] * fact);
                        }
                        ;
                    }
                    b[k] += (b[i] * fact);
                }
                ;
            }
        }
        ;
    }
    return b;
};