// ============================================
// IDIOMAS
// ============================================

let idiomaActual = 'es';

const traducciones = {
    es: {
        alertDosValores: "Por favor, ingrese exactamente 2 valores conocidos.",
        alertMasDeDos: "Ha ingresado más de 2 valores. Por favor, ingrese solo 2 valores y deje los demás vacíos.",
        alertAngulosIncompatibles: "No puede ingresar ambos ángulos simultáneamente. Uno se calcula automáticamente.",
        errorCatetoMayorHipotenusa: "El cateto no puede ser mayor que la hipotenusa",
        errorCombinacionInvalida: "Combinación de valores no válida para resolver el triángulo",
        errorAnguloInvalido: "El ángulo debe estar entre 0° y 90°"
    },
    en: {
        alertDosValores: "Please enter exactly 2 known values.",
        alertMasDeDos: "You have entered more than 2 values. Please enter only 2 values and leave the rest empty.",
        alertAngulosIncompatibles: "You cannot enter both angles simultaneously. One is calculated automatically.",
        errorCatetoMayorHipotenusa: "The leg cannot be greater than the hypotenuse",
        errorCombinacionInvalida: "Invalid combination of values to solve the triangle",
        errorAnguloInvalido: "The angle must be between 0° and 90°"
    }
};

function cambiarIdioma(idioma) {
    idiomaActual = idioma;
    
    // Actualizar botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === idioma) {
            btn.classList.add('active');
        }
    });
    
    // Actualizar todos los textos con atributos data-es y data-en
    document.querySelectorAll('[data-' + idioma + ']').forEach(elemento => {
        const textoEs = elemento.getAttribute('data-es');
        const textoEn = elemento.getAttribute('data-en');
        
        if (elemento.tagName === 'INPUT' || elemento.tagName === 'BUTTON') {
            elemento.textContent = idioma === 'es' ? textoEs : textoEn;
        } else {
            elemento.textContent = idioma === 'es' ? textoEs : textoEn;
        }
    });
    
    // Actualizar el atributo lang del documento
    document.documentElement.lang = idioma;
}

// ============================================
// FUNCIONES DE CONVERSIÓN
// ============================================

// Función para convertir grados a radianes
function gradosARadianes(grados) {
    return grados * (Math.PI / 180);
}

// Función para convertir radianes a grados
function radianesAGrados(radianes) {
    return radianes * (180 / Math.PI);
}

// ============================================
// FUNCIONES PARA TOMA DE VALORES
// ============================================

// Función para tomar los valores de los campos
function obtenerValores() {
    const angulo = document.getElementById("angulo").value;
    const opuesto = document.getElementById("opuesto").value;
    const adyacente = document.getElementById("adyacente").value;
    const hipotenusa = document.getElementById("hipotenusa").value;
    
    return {
        angulo: angulo !== "" ? Number(angulo) : null,
        opuesto: opuesto !== "" ? Number(opuesto) : null,
        adyacente: adyacente !== "" ? Number(adyacente) : null,
        hipotenusa: hipotenusa !== "" ? Number(hipotenusa) : null
    };
}

// Función para contar cuántos valores están ingresados
function contarValoresIngresados(valores) {
    let contador = 0;
    if (valores.angulo !== null) contador++;
    if (valores.opuesto !== null) contador++;
    if (valores.adyacente !== null) contador++;
    if (valores.hipotenusa !== null) contador++;
    return contador;
}

// Función para redondear valores calculados en los campos
function establecerValor(campo, valor) {
    const inputElement = document.getElementById(campo);
    inputElement.value = valor.toFixed(2);
    
    // animación de pulso al campo calculado
    inputElement.classList.add('calculated');
    setTimeout(() => {
        inputElement.classList.remove('calculated');
    }, 600);
}

// ============================================
// FUNCIÓN DE CÁLCULO PRINCIPAL
// ============================================

// Aquí se verifica que el usuario ingrese bien los valores
function calcular() {
    const valores = obtenerValores();
    const cantidadValores = contarValoresIngresados(valores);
    
    // Aquí se valida que haya exactamente 2 valores
    if (cantidadValores < 2) {
        alert(messages[currentLanguage].exactlyTwo);
        return;
    }
    
    if (cantidadValores > 2) {
        alert(messages[currentLanguage].moreThanTwo);
        return;
    }
    
    // Aquí ejecutamos la solución
    try {
        resolverTriangulo(valores);
    } catch (error) {
        alert(messages[currentLanguage].errorPrefix + error.message);
    }
}

// ============================================
// FUNCIÓN DE RESOLUCIÓN DEL TRIÁNGULO
// ============================================

// Si los campos pasan la validación, esta función resuelve el triángulo según los valores disponibles
function resolverTriangulo(v) {
    // Para Ángulo + Hipotenusa
    if (v.angulo !== null && v.hipotenusa !== null && v.opuesto === null && v.adyacente === null) {
        const anguloRad = gradosARadianes(v.angulo);
        establecerValor("opuesto", Math.sin(anguloRad) * v.hipotenusa);
        establecerValor("adyacente", Math.cos(anguloRad) * v.hipotenusa);
    }
    
    // Para Ángulo + Opuesto
    else if (v.angulo !== null && v.opuesto !== null && v.adyacente === null && v.hipotenusa === null) {
        const anguloRad = gradosARadianes(v.angulo);
        establecerValor("adyacente", v.opuesto / Math.tan(anguloRad));
        establecerValor("hipotenusa", v.opuesto / Math.sin(anguloRad));
    }
    
    // Para Ángulo + Adyacente
    else if (v.angulo !== null && v.adyacente !== null && v.opuesto === null && v.hipotenusa === null) {
        const anguloRad = gradosARadianes(v.angulo);
        establecerValor("opuesto", Math.tan(anguloRad) * v.adyacente);
        establecerValor("hipotenusa", v.adyacente / Math.cos(anguloRad));
    }
    
    // Para Opuesto + Adyacente
    else if (v.opuesto !== null && v.adyacente !== null && v.angulo === null && v.hipotenusa === null) {
        const hipotenusaCalc = Math.sqrt(Math.pow(v.opuesto, 2) + Math.pow(v.adyacente, 2));
        const anguloCalc = radianesAGrados(Math.atan(v.opuesto / v.adyacente));
        establecerValor("hipotenusa", hipotenusaCalc);
        establecerValor("angulo", anguloCalc);
    }
    
    // Para Opuesto + Hipotenusa
    else if (v.opuesto !== null && v.hipotenusa !== null && v.angulo === null && v.adyacente === null) {
        if (v.opuesto > v.hipotenusa) {
            throw new Error(messages[currentLanguage].oppositeGreater);
        }
        const adyacenteCalc = Math.sqrt(Math.pow(v.hipotenusa, 2) - Math.pow(v.opuesto, 2));
        const anguloCalc = radianesAGrados(Math.asin(v.opuesto / v.hipotenusa));
        establecerValor("adyacente", adyacenteCalc);
        establecerValor("angulo", anguloCalc);
    }
    
    // Para Adyacente + Hipotenusa
    else if (v.adyacente !== null && v.hipotenusa !== null && v.angulo === null && v.opuesto === null) {
        if (v.adyacente > v.hipotenusa) {
            throw new Error(messages[currentLanguage].adjacentGreater);
        }
        const opuestoCalc = Math.sqrt(Math.pow(v.hipotenusa, 2) - Math.pow(v.adyacente, 2));
        const anguloCalc = radianesAGrados(Math.acos(v.adyacente / v.hipotenusa));
        establecerValor("opuesto", opuestoCalc);
        establecerValor("angulo", anguloCalc);
    }
    
    else {
        throw new Error(messages[currentLanguage].invalidCombination);
    }
}

// ============================================
// FUNCIÓN DE LIMPIEZA
// ============================================

// Función para limpiar todos los campos
function limpiar() {
    document.getElementById("angulo").value = "";
    document.getElementById("opuesto").value = "";
    document.getElementById("adyacente").value = "";
    document.getElementById("hipotenusa").value = "";
}

// ============================================
// FUNCIONALIDAD IDIOMAS
// ============================================

// Función para cambiar el idioma
function toggleLanguage() {
    // Cambiar el idioma actual
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    
    // Actualizar el texto del botón
    document.getElementById('lang-text').textContent = currentLanguage === 'es' ? 'EN' : 'ES';
    
    // Actualizar todos los elementos con data-es y data-en
    updateLanguage();
}

// Función para actualizar todos los textos según el idioma
function updateLanguage() {
    // Actualizar el título de la página
    const title = document.querySelector('title');
    if (title) {
        title.textContent = title.getAttribute(`data-${currentLanguage}`);
    }
    
    // Actualizar todos los elementos con atributos de idioma
    const elements = document.querySelectorAll('[data-es], [data-en]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${currentLanguage}`);
        if (text) {
            // Si es un input, actualizar el placeholder
            if (element.tagName === 'INPUT') {
                element.placeholder = text;
            } 
            // Si es un botón, actualizar el contenido del texto
            else if (element.tagName === 'BUTTON') {
                element.textContent = text;
            }
            // Para otros elementos, actualizar el contenido de texto
            else {
                element.textContent = text;
            }
        }
    });
    
    // Actualizar placeholders específicos
    const inputs = ['angulo', 'opuesto', 'adyacente', 'hipotenusa'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            const placeholder = input.getAttribute(`data-${currentLanguage}-placeholder`);
            if (placeholder) {
                input.placeholder = placeholder;
            }
        }
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Establecer idioma inicial al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cambiarIdioma('es');
});
